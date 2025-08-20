"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Users, Gift, Star, Target, CheckCircle2, Clock, ExternalLink } from "lucide-react"

interface Mission {
  title: string
  description: string
  icon: any
  action: string
  url?: string
  completed?: boolean
}

interface DailyMissionProps {
  attendanceCompleted?: boolean
  onMissionComplete?: () => void
}

export function DailyMission({ attendanceCompleted = false, onMissionComplete }: DailyMissionProps) {
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [missionProgress, setMissionProgress] = useState<"pending" | "in-progress" | "completed">("pending")
  const [missionUnlocked, setMissionUnlocked] = useState(false)

  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

  const missions: Record<number, Mission> = {
    1: {
      // Monday
      title: "디맨드 커뮤니티에서 오늘의 공고 확인하기",
      description: "디맨드 커뮤니티에서 새로운 채용 공고를 확인하고 관심 있는 포지션을 찾아보세요",
      icon: Calendar,
      action: "공고 보기",
      url: "https://www.dmand.co.kr/community",
    },
    2: {
      // Tuesday
      title: "디맨드 가이드북 받아보기",
      description: "디맨드에서 제공하는 취업 준비 가이드북을 다운로드하세요",
      icon: BookOpen,
      action: "다운로드",
      url: "https://www.dmand.co.kr/guide",
    },
    3: {
      // Wednesday
      title: "디맨드 커뮤니티 참여하기",
      description: "디맨드 커뮤니티에서 다른 구직자들과 정보를 공유하고 네트워킹해보세요",
      icon: Users,
      action: "참여하기",
      url: "https://www.dmand.co.kr/community",
    },
    4: {
      // Thursday
      title: "디맨드 이벤트 참여하기",
      description: "디맨드에서 진행하는 특별 채용 이벤트에 참여하여 기회를 놓치지 마세요",
      icon: Gift,
      action: "참여하기",
      url: "https://www.dmand.co.kr/events",
    },
    5: {
      // Friday
      title: "디맨드에서 주간 리뷰 작성하기",
      description: "디맨드 플랫폼에서 이번 주 취업 활동을 돌아보고 다음 주 계획을 세워보세요",
      icon: Star,
      action: "작성하기",
      url: "https://www.dmand.co.kr/review",
    },
    6: {
      // Saturday
      title: "디맨드에서 목표 설정하기",
      description: "디맨드 플랫폼에서 다음 주 취업 목표를 구체적으로 설정해보세요",
      icon: Target,
      action: "설정하기",
      url: "https://www.dmand.co.kr/goals",
    },
    0: {
      // Sunday
      title: "디맨드에서 주간 정리하기",
      description: "디맨드 플랫폼에서 한 주간의 성과를 정리하고 새로운 한 주를 준비해보세요",
      icon: Calendar,
      action: "정리하기",
      url: "https://www.dmand.co.kr/summary",
    },
  }

  const currentMission = missions[today]
  const MissionIcon = currentMission.icon

  useEffect(() => {
    const today = new Date().toDateString()
    const completedMissions = JSON.parse(localStorage.getItem("completedMissions") || "{}")
    setMissionCompleted(completedMissions[today] || false)

    const lastAttendanceDate = localStorage.getItem("lastAttendanceDate")
    const todayDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

    console.log("[v0] Mission unlock check:", {
      attendanceCompleted,
      lastAttendanceDate,
      todayDate,
      matches: lastAttendanceDate === todayDate,
    })

    const isUnlocked = attendanceCompleted || (lastAttendanceDate && lastAttendanceDate.startsWith(todayDate))
    setMissionUnlocked(isUnlocked)

    console.log("[v0] Mission unlocked:", isUnlocked)
  }, [attendanceCompleted]) // Added dependency to re-run when attendance status changes

  useEffect(() => {
    if (attendanceCompleted) {
      setMissionUnlocked(true)
      console.log("[v0] Mission unlocked via prop change")
    }
  }, [attendanceCompleted])

  const handleMissionClick = async () => {
    if (missionCompleted || !missionUnlocked) return

    setMissionProgress("in-progress")

    if (currentMission.url) {
      window.open(currentMission.url, "_blank")
    }

    setTimeout(async () => {
      setMissionProgress("completed")
      setMissionCompleted(true)

      const today = new Date().toDateString()
      const completedMissions = JSON.parse(localStorage.getItem("completedMissions") || "{}")
      completedMissions[today] = true
      localStorage.setItem("completedMissions", JSON.stringify(completedMissions))

      if (onMissionComplete) {
        onMissionComplete()
      }

      const event = new CustomEvent("missionCompleted", {
        detail: { mission: currentMission.title },
      })
      window.dispatchEvent(event)
    }, 2000)
  }

  return (
    <Card className="p-6 space-y-5 glass-card border-0 shadow-lg hover-lift">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">오늘의 미션</h2>
        <Badge
          className={`px-3 py-1 text-sm font-semibold shadow-sm ${
            missionCompleted
              ? "bg-green-500 text-white"
              : missionUnlocked
                ? "bg-blue-500 text-white animate-pulse"
                : "bg-gray-400 text-white"
          }`}
        >
          {missionCompleted ? "완료!" : missionUnlocked ? "활성화" : "잠김"}
        </Badge>
      </div>

      {!missionUnlocked && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-800 font-medium">출석체크를 완료하면 오늘의 미션이 활성화됩니다!</p>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 hover-lift ${
            missionCompleted ? "bg-green-500" : missionUnlocked ? "bg-blue-500 animate-pulse" : "bg-gray-400"
          }`}
        >
          {missionCompleted ? (
            <CheckCircle2 className="w-8 h-8 text-white" />
          ) : (
            <MissionIcon className="w-8 h-8 text-white" />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className={`text-lg font-semibold ${missionUnlocked ? "text-foreground" : "text-gray-400"}`}>
              {currentMission.title}
            </h3>
            <p className={`text-sm leading-relaxed ${missionUnlocked ? "text-muted-foreground" : "text-gray-400"}`}>
              {currentMission.description}
            </p>
          </div>
          <Button
            className={`w-full h-11 font-semibold shadow-md transition-all duration-300 hover-lift ${
              missionCompleted
                ? ""
                : missionProgress === "in-progress"
                  ? ""
                  : missionUnlocked
                    ? "bg-blue-500 hover:bg-blue-600"
                    : ""
            }`}
            onClick={handleMissionClick}
            disabled={missionCompleted || !missionUnlocked}
            variant={
              missionCompleted
                ? "secondary"
                : missionProgress === "in-progress"
                  ? "outline"
                  : missionUnlocked
                    ? "default"
                    : "secondary"
            }
          >
            {missionCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                완료됨
              </>
            ) : missionProgress === "in-progress" ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                진행 중...
              </>
            ) : missionUnlocked ? (
              <>
                {currentMission.action}
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            ) : (
              "출석체크 필요"
            )}
          </Button>
        </div>
      </div>

      {missionProgress === "in-progress" && (
        <div className="bg-blue-500 rounded-lg p-3 text-center animate-pulse">
          <p className="text-sm text-white font-medium">미션을 수행하고 있습니다...</p>
        </div>
      )}

      {missionCompleted && (
        <div className="bg-green-500 rounded-lg p-3 text-center">
          <p className="text-sm text-white font-medium">오늘의 미션을 완료했습니다! 디맨드 플랫폼을 활용해보세요.</p>
        </div>
      )}
    </Card>
  )
}
