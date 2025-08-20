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
    "https://script.google.com/macros/s/AKfycbz8oPwB2bkFGTWXY2JSirRqL4ImjG_MY_ilgntcWRcPyYVBzfebjph-Q7t4qOrOz0ytJA/exec"

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

  async getUserRanking(): Promise<any[]> {
    try {
      console.log("[v0] Fetching user ranking from Google Sheets")

      const response = await fetch(`${this.scriptUrl}?action=getRanking`, {
        method: "GET",
        mode: "no-cors",
      })

      console.log("[v0] Ranking request sent (no-cors mode)")
      return []
    } catch (error) {
      console.error("[v0] Error fetching ranking from Google Sheets:", error)
      return []
    }
  }
}
