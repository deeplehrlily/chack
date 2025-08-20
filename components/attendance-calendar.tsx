import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface AttendanceCalendarProps {
  currentStreak: number
}

export function AttendanceCalendar({ currentStreak }: AttendanceCalendarProps) {
  const attendanceData = Array.from({ length: 10 }, (_, index) => {
    const dayNumber = index + 1
    const isCompleted = dayNumber <= currentStreak
    const isCurrent = dayNumber === currentStreak && currentStreak > 0

    return {
      day: `${dayNumber}일차`,
      completed: isCompleted,
      current: isCurrent,
    }
  })

  return (
    <Card className="p-6 gradient-card border-0 shadow-lg hover-lift">
      <div className="grid grid-cols-5 gap-4">
        {attendanceData.map((item, index) => (
          <div
            key={index}
            className="text-center space-y-3 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-xs font-medium text-muted-foreground">{item.day}</div>
            <div className="relative">
              {item.completed ? (
                <div
                  className={`w-14 h-14 rounded-xl gradient-success flex items-center justify-center shadow-md transition-all duration-300 hover-lift ${
                    item.current
                      ? "ring-3 ring-primary/50 ring-offset-2 ring-offset-background scale-110 animate-pulse-glow"
                      : ""
                  }`}
                >
                  <CheckCircle2 className="w-7 h-7 text-white animate-check-mark" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-muted/50 flex items-center justify-center bg-muted/10 transition-all duration-300 hover:border-muted hover:bg-muted/20 hover-lift">
                  <Circle className="w-7 h-7 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
