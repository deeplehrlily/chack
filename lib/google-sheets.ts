export interface UserInfo {
  nickname: string
  email: string
}

export interface AttendanceRecord {
  nickname: string
  email: string
  date: string
  streak: number
  totalDays: number
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService
  private scriptUrl =
    "https://script.google.com/macros/s/AKfycbwZhmcR_q853cXQNaWrLrhnLdvpvhYoefPhnCPkNei6uzotFbup13xh1ZZs9yXzJI99iQ/exec"

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService()
    }
    return GoogleSheetsService.instance
  }

  async saveAttendance(record: AttendanceRecord): Promise<boolean> {
    try {
      console.log("[v0] Sending attendance data to Google Sheets:", record)

      const requestData = {
        action: "saveAttendance",
        nickname: record.nickname,
        email: record.email,
        date: record.date,
        streak: record.streak,
        totalDays: record.totalDays,
      }

      const response = await fetch(this.scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        mode: "no-cors",
      })

      console.log("[v0] Response received")

      return true
    } catch (error) {
      console.error("[v0] Error saving to Google Sheets:", error)
      return false
    }
  }

  async getRankingData(): Promise<any[]> {
    try {
      console.log("[v0] Fetching ranking data from Google Sheets")

      const ranking = await this.fetchRankingWithPOST()
      if (ranking && ranking.length > 0) {
        console.log("[v0] Successfully fetched ranking from Google Sheets:", ranking)
        // Cache the data locally
        localStorage.setItem("attendanceRanking", JSON.stringify(ranking))
        return ranking
      }

      // Fallback to localStorage if Google Sheets fails
      const localRanking = localStorage.getItem("attendanceRanking")
      if (localRanking) {
        const ranking = JSON.parse(localRanking)
        console.log("[v0] Using cached local ranking data:", ranking)
        return ranking
      }

      console.log("[v0] No ranking data available")
      return []
    } catch (error) {
      console.error("[v0] Error fetching ranking from Google Sheets:", error)

      // Fallback to localStorage
      const localRanking = localStorage.getItem("attendanceRanking")
      if (localRanking) {
        return JSON.parse(localRanking)
      }
      return []
    }
  }

  async getUserRanking(): Promise<any[]> {
    return this.getRankingData()
  }

  private async fetchRankingWithPOST(): Promise<any[]> {
    try {
      console.log("[v0] Making POST request for ranking data")

      const requestData = {
        action: "getRanking",
      }

      try {
        const response = await fetch(this.scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          mode: "cors",
        })

        console.log("[v0] CORS POST response received for ranking")

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Successfully parsed ranking data:", data)
          if (data.success && data.ranking) {
            return data.ranking
          }
        }
      } catch (corsError) {
        console.log("[v0] CORS failed, trying no-cors mode")

        // Fallback to no-cors mode
        await fetch(this.scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          mode: "no-cors",
        })

        console.log("[v0] No-cors POST request sent for ranking")
      }

      return []
    } catch (error) {
      console.error("[v0] POST request failed:", error)
      throw error
    }
  }
}
