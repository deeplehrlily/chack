"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, BookOpen, Users, Gift, Star, Target } from "lucide-react"

interface MissionRecord {
  date: string
  dayOfWeek: number
  title: string
  points: number
  completed: boolean
}

export function MissionHistory() {
  const [missionHistory, setMissionHistory] = useState<MissionRecord[]>([])

  const missionIcons = {
    0: Calendar, // Sunday
    1: Calendar, // Monday
    2: BookOpen, // Tuesday
    3: Users, // Wednesday
    4: Gift, // Thursday
    5: Star, // Friday
    6: Target, // Saturday
  }

  const missionTitles = {
    0: "주간 정리하기",
    1: "오늘의 공고 확인하러 가기",
    2: "가이드북 받아보기",
    3: "커뮤니티 참여하기",
    4: "이벤트 참여하기",
    5: "주간 리뷰 작성하기",
    6: "목표 설정하기",
  }

  const missionPoints = {
    0: 25,
    1: 10,
    2: 15,
    3: 20,
    4: 25,
    5: 30,
    6: 20,
  }

  useEffect(() => {
    // Generate last 7 days of mission history
    const history: MissionRecord[] = []
    const completedMissions = JSON.parse(localStorage.getItem("completedMissions") || "{}")

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayOfWeek = date.getDay()
      const dateString = date.toDateString()

      history.push({
        date: dateString,
        dayOfWeek,
        title: missionTitles[dayOfWeek as keyof typeof missionTitles],
        points: missionPoints[dayOfWeek as keyof typeof missionPoints],
        completed: completedMissions[dateString] || false,
      })
    }

    setMissionHistory(history)
  }, [])

  return (
    <Card className="p-6 space-y-4 bg-card border-0 shadow-lg">
      <h2 className="text-xl font-bold text-foreground">미션 히스토리</h2>

      <div className="space-y-3">
        {missionHistory.map((mission, index) => {
          const IconComponent = missionIcons[mission.dayOfWeek as keyof typeof missionIcons]
          const date = new Date(mission.date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isToday ? "bg-primary/10 border border-primary/20" : "bg-muted/10"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  mission.completed ? "bg-[color:var(--color-success-green)]/20" : "bg-muted/30"
                }`}
              >
                {mission.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[color:var(--color-success-green)]" />
                ) : (
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{mission.title}</span>
                  {isToday && (
                    <Badge variant="outline" className="text-xs">
                      오늘
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {date.toLocaleDateString("ko-KR", { month: "short", day: "numeric", weekday: "short" })}
                </div>
              </div>

              <div
                className={`text-sm font-semibold ${
                  mission.completed ? "text-[color:var(--color-success-green)]" : "text-muted-foreground"
                }`}
              >
                {mission.completed ? `+${mission.points}` : `${mission.points}pt`}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
