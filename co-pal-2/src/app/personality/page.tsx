"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function PersonalityPage() {
	const [mbti, setMbti] = useState("")
	const [error, setError] = useState("")

	const validate = (value: string) => {
		const v = value.trim().toUpperCase()
		if (!/^[EI][SN][FT][JP]$/.test(v)) {
			return "Please enter a valid 4-letter MBTI (e.g. ESFJ)"
		}
		return ""
	}

	const onSave = () => {
		const err = validate(mbti)
		setError(err)
		if (err) return
		// TODO: persist to server or user profile
		console.log("MBTI saved:", mbti.toUpperCase())
		alert(`Saved MBTI: ${mbti.toUpperCase()}`)
	}

	return (
		<div className="min-h-screen bg-background py-12 flex items-start">
			<div className="max-w-sm w-full mx-auto px-4">
				<h1 className="text-2xl font-bold mb-3">Personality</h1>

				<p className="mb-4 text-sm text-muted-foreground">Take a quick MBTI quiz and paste your 4-letter type below.</p>

				<div className="mb-6">
					<a href="https://uquiz.com/quiz/ehcP7j/i-mbti-type-you-in-10-questions" target="_blank" rel="noreferrer" className="inline-block w-full text-center bg-primary text-primary-foreground px-4 py-3 rounded-md shadow">
						Take the 10-question MBTI quiz
					</a>
				</div>

				<div className="space-y-2">
					<Label>Enter your MBTI (4 letters)</Label>
					<Input value={mbti} onChange={(e) => setMbti(e.target.value)} placeholder="e.g. ESFJ" maxLength={4} />
					{error && <p className="text-sm text-destructive">{error}</p>}
					<div className="flex justify-end mt-2">
						<Button onClick={onSave}>Save</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
