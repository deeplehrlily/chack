"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RankingChangeProps {
  oldRank: number
  newRank: number
  show: boolean
  onClose: () => void
}

export function RankingChangeNotification({ oldRank, newRank, show, onClose }: RankingChangeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!isVisible) return null

  const getRankingChange = () => {
    if (newRank < oldRank) {
      return {
        direction: "up" as const,
        change: oldRank - newRank,
        icon: TrendingUp,
        color: "text-[color:var(--color-success-green)]",
        bgColor: "bg-[color:var(--color-success-green)]/10",
        message: `${oldRank - newRank}단계 상승!`,
      }
    } else if (newRank > oldRank) {
      return {
        direction: "down" as const,
        change: newRank - oldRank,
        icon: TrendingDown,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        message: `${newRank - oldRank}단계 하락`,
      }
    } else {
      return {
        direction: "same" as const,
        change: 0,
        icon: Minus,
        color: "text-muted-foreground",
        bgColor: "bg-muted/10",
        message: "순위 유지",
      }
    }
  }

  const rankingChange = getRankingChange()
  const IconComponent = rankingChange.icon

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
      <Card className={`p-4 ${rankingChange.bgColor} border-0 shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${rankingChange.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-4 h-4 ${rankingChange.color}`} />
          </div>
          <div>
            <div className={`font-semibold ${rankingChange.color}`}>랭킹 변동</div>
            <div className="text-sm text-muted-foreground">
              #{oldRank} → #{newRank} ({rankingChange.message})
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
