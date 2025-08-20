"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, TrendingUp, Users, Crown } from "lucide-react"

interface User {
  rank: number
  name: string
  streak: number
  totalDays: number
  icon: any
  isCurrentUser?: boolean
}

export function UserRanking() {
  const [showFullRanking, setShowFullRanking] = useState(false)
  const [currentUserRank, setCurrentUserRank] = useState<User | null>(null)
  const [rankingData, setRankingData] = useState<User[]>([])

  useEffect(() => {
    const mockRankingData: User[] = [
      { rank: 1, name: "김철수", streak: 15, totalDays: 20, icon: Trophy },
      { rank: 2, name: "이영희", streak: 12, totalDays: 18, icon: Medal },
      { rank: 3, name: "박민수", streak: 10, totalDays: 16, icon: Award },
      { rank: 4, name: "정수진", streak: 8, totalDays: 15, icon: Award },
      { rank: 5, name: "홍길동", streak: 7, totalDays: 14, icon: Award },
      { rank: 6, name: "나현재", streak: 3, totalDays: 12, icon: Award, isCurrentUser: true },
      { rank: 7, name: "최민호", streak: 5, totalDays: 11, icon: Award },
      { rank: 8, name: "윤서연", streak: 4, totalDays: 10, icon: Award },
    ]

    setRankingData(mockRankingData)

    // Find current user's rank
    const currentUser = mockRankingData.find((user) => user.isCurrentUser)
    setCurrentUserRank(currentUser || null)
  }, [])

  const topThree = rankingData.slice(0, 3)
  const displayData = showFullRanking ? rankingData : topThree

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-5 bg-card border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[color:var(--color-point-gold)]/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[color:var(--color-point-gold)]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">출석 랭킹</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{rankingData.length}명 참여</span>
          </div>
        </div>

        <div className="space-y-3">
          {displayData.map((user) => {
            const IconComponent = user.icon
            const isCurrentUser = user.isCurrentUser

            return (
              <div
                key={user.rank}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                  isCurrentUser
                    ? "bg-primary/10 border-primary/30 shadow-md"
                    : "bg-muted/10 border-muted/20 hover:bg-muted/20"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                      user.rank === 1
                        ? "bg-gradient-to-br from-[color:var(--color-point-gold)] to-yellow-500"
                        : user.rank === 2
                          ? "bg-gradient-to-br from-gray-400 to-gray-500"
                          : user.rank === 3
                            ? "bg-gradient-to-br from-amber-600 to-amber-700"
                            : "bg-gradient-to-br from-muted to-muted-foreground"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {user.rank <= 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {user.name}
                      {isCurrentUser && <span className="text-sm text-primary ml-1">(나)</span>}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${
                        user.streak >= 10
                          ? "border-[color:var(--color-success-green)] text-[color:var(--color-success-green)]"
                          : "border-primary/30 text-primary"
                      }`}
                    >
                      {Number.isNaN(user.streak) ? "0" : user.streak}일 연속
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      총 {Number.isNaN(user.totalDays) ? "0" : user.totalDays}일 출석
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${isCurrentUser ? "text-primary" : "text-primary"}`}>
                    #{user.rank}
                  </div>
                  {user.rank <= 3 && <div className="text-xs text-muted-foreground">TOP 3</div>}
                </div>
              </div>
            )
          })}
        </div>

        {!showFullRanking && rankingData.length > 3 && (
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowFullRanking(true)}>
            전체 랭킹 보기 ({rankingData.length}명)
          </Button>
        )}

        {showFullRanking && (
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowFullRanking(false)}>
            TOP 3만 보기
          </Button>
        )}
      </Card>

      {/* Current User Rank Card */}
      {currentUserRank && !showFullRanking && currentUserRank.rank > 3 && (
        <Card className="p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">내 순위</span>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  #{currentUserRank.rank}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {Number.isNaN(currentUserRank.streak) ? "0" : currentUserRank.streak}일 연속 ·{" "}
                {Number.isNaN(currentUserRank.totalDays) ? "0" : currentUserRank.totalDays}일 출석
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">TOP 3까지</div>
              <div className="text-lg font-bold text-primary">
                {topThree.length >= 3 &&
                topThree[2]?.streak &&
                currentUserRank?.streak &&
                !Number.isNaN(topThree[2].streak) &&
                !Number.isNaN(currentUserRank.streak) &&
                topThree[2].streak - currentUserRank.streak > 0
                  ? `${topThree[2].streak - currentUserRank.streak}일`
                  : "달성!"}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Ranking Statistics */}
      <Card className="p-4 bg-card/50 border-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[color:var(--color-point-gold)]">
              {rankingData[0]?.totalDays || "0"}
            </div>
            <div className="text-xs text-muted-foreground">1위 출석일</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[color:var(--color-success-green)]">
              {rankingData.length > 0 ? Math.max(...rankingData.map((u) => u.streak || 0)) : 0}
            </div>
            <div className="text-xs text-muted-foreground">최고 연속</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {rankingData.length > 0
                ? Math.round(rankingData.reduce((sum, u) => sum + (u.totalDays || 0), 0) / rankingData.length) || 0
                : 0}
            </div>
            <div className="text-xs text-muted-foreground">평균 출석일</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
