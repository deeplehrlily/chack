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

export function DailyMission() {
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [missionProgress, setMissionProgress] = useState<"pending" | "in-progress" | "completed">("pending")

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
  }, [])

  const handleMissionClick = async () => {
    if (missionCompleted) return

    setMissionProgress("in-progress")

    // Open mission URL
    if (currentMission.url) {
      window.open(currentMission.url, "_blank")
    }

    // Simulate completion after a short delay
    setTimeout(async () => {
      setMissionProgress("completed")
      setMissionCompleted(true)

      // Save completion status
      const today = new Date().toDateString()
      const completedMissions = JSON.parse(localStorage.getItem("completedMissions") || "{}")
      completedMissions[today] = true
      localStorage.setItem("completedMissions", JSON.stringify(completedMissions))

      const event = new CustomEvent("missionCompleted", {
        detail: { mission: currentMission.title },
      })
      window.dispatchEvent(event)
    }, 2000)
  }

  return (
    <Card className="p-6 space-y-5 gradient-card border-0 shadow-lg hover-lift">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">오늘의 미션</h2>
        <Badge
          className={`px-3 py-1 text-sm font-semibold shadow-sm animate-pulse-glow ${
            missionCompleted ? "gradient-success text-white" : "gradient-mission text-white"
          }`}
        >
          {missionCompleted ? "완료!" : "미션"}
        </Badge>
      </div>

      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 hover-lift ${
            missionCompleted ? "gradient-success animate-pulse-glow" : "gradient-mission animate-bounce-soft"
          }`}
        >
          {missionCompleted ? (
            <CheckCircle2 className="w-8 h-8 text-white animate-check-mark" />
          ) : (
            <MissionIcon className="w-8 h-8 text-white" />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="space-y-1 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground">{currentMission.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{currentMission.description}</p>
          </div>
          <Button
            className={`w-full h-11 font-semibold shadow-md transition-all duration-300 hover-lift hover-glow ${
              missionCompleted ? "" : missionProgress === "in-progress" ? "" : "gradient-primary"
            }`}
            onClick={handleMissionClick}
            disabled={missionCompleted}
            variant={missionCompleted ? "secondary" : missionProgress === "in-progress" ? "outline" : "default"}
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
            ) : (
              <>
                {currentMission.action}
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {missionProgress === "in-progress" && (
        <div className="gradient-mission rounded-lg p-3 text-center animate-pulse-glow">
          <p className="text-sm text-white font-medium">미션을 수행하고 있습니다...</p>
        </div>
      )}

      {missionCompleted && (
        <div className="gradient-success rounded-lg p-3 text-center animate-scale-in">
          <p className="text-sm text-white font-medium">오늘의 미션을 완료했습니다! 디맨드 플랫폼을 활용해보세요.</p>
        </div>
      )}
    </Card>
  )
}
