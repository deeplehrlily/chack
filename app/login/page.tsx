"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim() || !email.trim()) {
      alert("닉네임과 이메일을 모두 입력해주세요.")
      return
    }

    if (!email.includes("@")) {
      alert("올바른 이메일 형식을 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      // 사용자 정보 저장
      const userInfo = {
        nickname: nickname.trim(),
        email: email.trim(),
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      localStorage.setItem("isLoggedIn", "true")

      // 출석체크 페이지로 이동
      router.push("/")
    } catch (error) {
      console.error("로그인 처리 중 오류:", error)
      alert("로그인 처리 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">출석체크 이벤트</CardTitle>
          <CardDescription className="text-gray-400">디맨드 커뮤니티 출석체크에 참여하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-white">
                닉네임
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "처리 중..." : "시작하기"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">디맨드 커뮤니티와 함께하는 출석체크 이벤트</p>
            <a
              href="https://www.dmand.co.kr/community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              디맨드 커뮤니티 바로가기
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
