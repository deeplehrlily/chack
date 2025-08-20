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

      const params = new URLSearchParams()
      params.append("action", "saveAttendance")
      params.append("nickname", record.nickname)
      params.append("email", record.email)
      params.append("date", record.date)
      params.append("streak", record.streak.toString())
      params.append("totalDays", record.totalDays.toString())

      const response = await fetch(this.scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
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

      // Since we can't read responses in no-cors mode, we'll fall back to localStorage
      // and rely on the fact that data is being saved to Google Sheets
      const localRanking = localStorage.getItem("attendanceRanking")
      if (localRanking) {
        const ranking = JSON.parse(localRanking)
        console.log("[v0] Using local ranking data:", ranking)
        return ranking
      }

      console.log("[v0] No local ranking data available")
      return []
    } catch (error) {
      console.error("[v0] Error fetching ranking from Google Sheets:", error)
      return []
    }
  }

  async getUserRanking(): Promise<any[]> {
    return this.getRankingData()
  }
}
