"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, LogOut } from "lucide-react"
import { AttendanceCalendar } from "@/components/attendance-calendar"
import { DailyMission } from "@/components/daily-mission"
import { UserRanking } from "@/components/user-ranking"
import { GoogleSheetsService } from "@/lib/google-sheets"

export default function AttendancePage() {
  const [currentStreak, setCurrentStreak] = useState(0)
  const [hasCheckedToday, setHasCheckedToday] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [userInfo, setUserInfo] = useState<{ nickname: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attendanceCompleted, setAttendanceCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const storedUserInfo = localStorage.getItem("userInfo")

    if (!isLoggedIn || !storedUserInfo) {
      router.push("/login")
      return
    }

    try {
      const parsedUserInfo = JSON.parse(storedUserInfo)
      setUserInfo(parsedUserInfo)
    } catch (error) {
      console.error("Error parsing user info:", error)
      router.push("/login")
      return
    }

    const streakValue = localStorage.getItem("currentStreak") || "0"
    const savedStreak = Number.parseInt(streakValue)
    setCurrentStreak(Number.isNaN(savedStreak) ? 0 : savedStreak)

    const today = new Date()
    const todayString = today.toISOString().split("T")[0] // YYYY-MM-DD format
    const lastCheckDate = localStorage.getItem("lastAttendanceDate")

    if (lastCheckDate === todayString) {
      setHasCheckedToday(true)
      setAttendanceCompleted(true)
    } else {
      if (lastCheckDate) {
        const lastDate = new Date(lastCheckDate)
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff > 1) {
          setCurrentStreak(0)
          localStorage.setItem("currentStreak", "0")
        }
      }
      setHasCheckedToday(false)
      setAttendanceCompleted(false)
    }

    loadRankingFromSheets()

    const handleMissionCompleted = (event: CustomEvent) => {
      console.log("Mission completed:", event.detail)
      loadRankingFromSheets()
    }

    window.addEventListener("missionCompleted", handleMissionCompleted as EventListener)

    return () => {
      window.removeEventListener("missionCompleted", handleMissionCompleted as EventListener)
    }
  }, [router])

  const loadRankingFromSheets = async () => {
    try {
      const googleSheets = GoogleSheetsService.getInstance()
      const rankingData = await googleSheets.getRankingData()
      if (rankingData && rankingData.length > 0) {
        localStorage.setItem("rankingData", JSON.stringify(rankingData))
        console.log("[v0] Loaded ranking data from Google Sheets:", rankingData)
      }
    } catch (error) {
      console.error("[v0] Error loading ranking data from Google Sheets:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
    localStorage.removeItem("currentStreak")
    localStorage.removeItem("lastAttendanceDate")
    localStorage.removeItem("rankingData")
    router.push("/login")
  }

  const handleAttendanceCheck = async () => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0]
    const lastCheckDate = localStorage.getItem("lastAttendanceDate")

    if (lastCheckDate === todayString) {
      console.log("[v0] Already attended today, preventing duplicate attendance")
      return
    }

    if (!hasCheckedToday && !isLoading) {
      setIsLoading(true)
      const newStreak = currentStreak + 1
      setHasCheckedToday(true)
      setCurrentStreak(newStreak)
      setShowCongrats(true)
      setAttendanceCompleted(true)

      localStorage.setItem("lastAttendanceDate", todayString)
      localStorage.setItem("currentStreak", newStreak.toString())

      if (userInfo) {
        const totalDaysStr = localStorage.getItem("totalAttendanceDays") || "0"
        const totalDays = Number.parseInt(totalDaysStr) + 1
        updateRankingData(userInfo.nickname, newStreak, totalDays)
      }

      await saveAttendanceToSheet(newStreak)

      await loadRankingFromSheets()

      setIsLoading(false)
    }
  }

  const saveAttendanceToSheet = async (streak: number) => {
    if (!userInfo) return

    try {
      const totalDaysStr = localStorage.getItem("totalAttendanceDays") || "0"
      const totalDays = Number.parseInt(totalDaysStr) + 1
      localStorage.setItem("totalAttendanceDays", totalDays.toString())

      console.log("[v0] Saving attendance data:", {
        nickname: userInfo.nickname,
        email: userInfo.email,
        streak: streak,
        totalDays: totalDays,
      })

      const googleSheets = GoogleSheetsService.getInstance()
      const success = await googleSheets.saveAttendance({
        nickname: userInfo.nickname,
        email: userInfo.email,
        date: new Date().toISOString(),
        streak: streak,
        totalDays: totalDays,
      })

      if (success) {
        console.log("[v0] Successfully saved attendance to Google Sheets")
      } else {
        console.log("[v0] Failed to save to Google Sheets, but local data is preserved")
      }
    } catch (error) {
      console.error("[v0] Error saving attendance:", error)
    }
  }

  const updateRankingData = (nickname: string, streak: number, totalDays: number) => {
    try {
      const existingRankingData = localStorage.getItem("rankingData")
      let rankingData = existingRankingData ? JSON.parse(existingRankingData) : []

      const userIcons = ["👤", "🧑", "👩", "🧑‍💼", "👩‍💼", "🧑‍🎓", "👩‍🎓", "🧑‍💻", "👩‍💻", "🧑‍🔬"]
      const randomIcon = userIcons[Math.floor(Math.random() * userIcons.length)]

      const existingUserIndex = rankingData.findIndex((user: any) => user.name === nickname)

      if (existingUserIndex >= 0) {
        rankingData[existingUserIndex] = {
          ...rankingData[existingUserIndex],
          streak: streak,
          totalDays: totalDays,
          isCurrentUser: true,
        }
      } else {
        rankingData.push({
          name: nickname,
          streak: streak,
          totalDays: totalDays,
          icon: randomIcon,
          isCurrentUser: true,
        })
      }

      rankingData = rankingData.map((user: any) => ({
        ...user,
        isCurrentUser: user.name === nickname,
      }))

      rankingData.sort((a: any, b: any) => {
        if (b.streak !== a.streak) {
          return b.streak - a.streak
        }
        return b.totalDays - a.totalDays
      })

      rankingData = rankingData.map((user: any, index: number) => ({
        ...user,
        rank: index + 1,
      }))

      localStorage.setItem("rankingData", JSON.stringify(rankingData))
      console.log("[v0] Updated ranking data:", rankingData)
    } catch (error) {
      console.error("[v0] Error updating ranking data:", error)
    }
  }

  const handleMissionComplete = () => {
    console.log("[v0] Mission completed, refreshing ranking data")
    loadRankingFromSheets()
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로그인 확인 중...</p>
        </div>
      </div>
    )
  }

  if (showCongrats) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm p-8 text-center space-y-6 glass-card border-0 shadow-2xl animate-scale-in hover-lift">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground animate-bounce-soft">축하합니다!</h1>
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 gradient-success rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                <CheckCircle2 className="w-10 h-10 text-white animate-check-mark" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[color:var(--color-success-green)] animate-slide-up">
              출석 완료!
            </div>
          </div>

          <div className="space-y-2 animate-slide-up">
            <p className="text-lg text-muted-foreground">오늘도 출석을 완료했어요</p>
            <div className="text-sm text-muted-foreground glass-card-light rounded-lg p-3 glass-shimmer">
              연속 출석 : {currentStreak}일
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 glass-card-light border-2 hover:bg-muted/20 hover-lift bg-transparent"
              onClick={() => setShowCongrats(false)}
            >
              출석으로
            </Button>
            <Button
              className="flex-1 glass-button shadow-lg hover-lift hover-glow"
              onClick={() => setShowCongrats(false)}
            >
              완료
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="glass-card border-b border-border/50">
        <div className="container mx-auto p-4 max-w-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-primary-foreground font-bold text-lg">
                {userInfo?.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{userInfo?.nickname}</p>
              <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground hover-lift"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-md space-y-6">
        <div className="text-center space-y-4 pt-4 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">출석하기</h1>
          <div className="flex items-center justify-center gap-2 glass-card-light rounded-full px-4 py-2 animate-pulse-glow">
            <CheckCircle2 className="w-6 h-6 text-[color:var(--color-success-green)] animate-bounce-soft" />
            <span className="text-xl font-bold text-primary">
              {currentStreak === 0 ? "첫 출석을 시작해보세요!" : `${currentStreak}일째 연속 출석 중!`}
            </span>
          </div>
        </div>

        <div className="animate-slide-up">
          <AttendanceCalendar currentStreak={currentStreak} />
        </div>

        <div className="animate-slide-up">
          <DailyMission attendanceCompleted={attendanceCompleted} onMissionComplete={handleMissionComplete} />
        </div>

        <div className="animate-slide-up">
          <UserRanking />
        </div>

        <div className="space-y-4 animate-slide-up">
          <Card className="p-4 text-center glass-card border-0 hover-lift">
            <p className="text-lg text-muted-foreground mb-2">
              {hasCheckedToday ? "오늘은 출석을 완료했어요" : "오늘도 출석하고 디맨드를 활용해보세요"}
            </p>
          </Card>

          <Button
            className={`w-full h-14 text-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift hover-glow transition-all duration-300 ${
              hasCheckedToday ? "glass-card-light" : "glass-button animate-pulse-glow"
            }`}
            onClick={handleAttendanceCheck}
            disabled={hasCheckedToday || isLoading}
          >
            {isLoading ? "저장 중..." : hasCheckedToday ? "출석 완료" : "출석하기"}
          </Button>
        </div>
      </div>
    </div>
  )
}
