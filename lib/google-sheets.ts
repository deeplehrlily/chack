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
    "https://script.google.com/a/macros/deeplehr.com/s/AKfycbz8oPwB2bkFGTWXY2JSirRqL4ImjG_MY_ilgntcWRcPyYVBzfebjph-Q7t4qOrOz0ytJA/exec"

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService()
    }
    return GoogleSheetsService.instance
  }

  async saveAttendance(record: AttendanceRecord): Promise<boolean> {
    try {
      console.log("[v0] Sending attendance data to Google Sheets:", record)

      const response = await fetch(this.scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "saveAttendance",
          data: record,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] Google Sheets response:", result)

      return result.success === true
    } catch (error) {
      console.error("[v0] Error saving to Google Sheets:", error)
      return false
    }
  }

  async getUserRanking(): Promise<any[]> {
    try {
      console.log("[v0] Fetching user ranking from Google Sheets")

      const response = await fetch(`${this.scriptUrl}?action=getRanking`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] Ranking data received:", result)

      return result.data || []
    } catch (error) {
      console.error("[v0] Error fetching ranking from Google Sheets:", error)
      return []
    }
  }
}
