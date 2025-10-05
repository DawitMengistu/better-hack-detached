"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { preferencesSchema, type PreferencesFormData } from "@/lib/schemas/preferences"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { techStackOptions, countries, occupations } from "@/utils/constants"




export default function PreferencesPage() {
	const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
	const [ageRange, setAgeRange] = useState<[number, number]>([18, 40])
	const [timeCommitment, setTimeCommitment] = useState<[number, number]>([5, 20])

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<PreferencesFormData>({
		resolver: zodResolver(preferencesSchema),
		defaultValues: {
			preferredGenders: ["male", "female"],
			ageRange: [18, 40] as [number, number],
			timeCommitment: [5, 60] as [number, number],
			techStack: [],
			countryPreferences: [],
			occupations: [],
		},
	})

	const handleTechToggle = (tech: string) => {
		const next = selectedTechStack.includes(tech)
			? selectedTechStack.filter((t) => t !== tech)
			: [...selectedTechStack, tech]
		setSelectedTechStack(next)
		setValue("techStack", next)
	}

	const onSubmit = async (data: PreferencesFormData) => {
		try {
			console.log("Preferences saved:", data)
			alert("Preferences saved")
		} catch (err) {
			console.error(err)
			alert("Failed to save preferences")
		}
	}

	return (
			<div className="min-h-screen bg-background pb-16 flex items-start">
				<div className="max-w-sm w-full mx-auto px-4 pt-8">
					<h1 className="text-2xl font-bold mb-3">Partner Preferences</h1>
					<p className="text-sm text-muted-foreground mb-5">Set what you&apos;re looking for in a partner to improve matching.</p>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<Label>Preferred Genders</Label>
								<div className="flex gap-2 mt-2">
									{(["male","female"] as const).map((g) => (
										<button
											key={g}
											type="button"
											onClick={() => {
												const current = watch('preferredGenders') as (typeof g)[] || []
												const next = current.includes(g) ? current.filter((x:any)=>x!==g) : [...current, g]
												setValue('preferredGenders', next as any)
											}}
											className={cn('px-3 py-2 rounded-full border', (watch('preferredGenders')||[]).includes(g) ? 'bg-primary text-primary-foreground' : 'bg-background')}
										>
											{g}
										</button>
									))}
								</div>
								{errors.preferredGenders && <p className="text-sm text-destructive">{errors.preferredGenders.message as any}</p>}
							</div>

					<div>
						<Label>Preferred Age Range</Label>
						<div className="flex items-center gap-4 mt-2">
							<Input type="number" value={ageRange[0]} onChange={(e)=>{const v = Number(e.target.value); setAgeRange([v, ageRange[1]]); setValue('ageRange',[v, ageRange[1]])}} className="w-24" />
							<span>to</span>
							<Input type="number" value={ageRange[1]} onChange={(e)=>{const v = Number(e.target.value); setAgeRange([ageRange[0], v]); setValue('ageRange',[ageRange[0], v])}} className="w-24" />
						</div>
						{errors.ageRange && <p className="text-sm text-destructive">{errors.ageRange.message as any}</p>}
					</div>

					<div>
						<Label>Time Commitment (hrs/week)</Label>
						<div className="mt-2">
							<Slider value={timeCommitment} onValueChange={(v)=>{ const nv = [v[0], v[1]] as [number,number]; setTimeCommitment(nv); setValue('timeCommitment', nv)}} min={0} max={80} step={1} className="w-full" />
							<div className="flex justify-between text-sm text-muted-foreground mt-2">
								<span>{timeCommitment[0]} hrs</span>
								<span>{timeCommitment[1]} hrs</span>
							</div>
						</div>
						{errors.timeCommitment && <p className="text-sm text-destructive">{errors.timeCommitment.message as any}</p>}
					</div>

		  <SearchableMultiSelect
			label="Tech Stack"
			options={techStackOptions}
			selected={selectedTechStack}
			onChange={(next)=>{ setSelectedTechStack(next); setValue('techStack', next) }}
			placeholder="Search techology"
		  />

		  <SearchableMultiSelect
			label="Country Preferences"
			options={countries}
			selected={(watch('countryPreferences') as string[]) || []}
			onChange={(next)=>setValue('countryPreferences', next)}
			placeholder="Search countries"
		  />

		  <SearchableMultiSelect
			label="Occupations"
			options={occupations}
			selected={(watch('occupations') as string[]) || []}
			onChange={(next)=>setValue('occupations', next)}
			placeholder="Search occupations"
		  />


								<div className="flex justify-end">
									<Button type="submit" disabled={isSubmitting}>Save Preferences</Button>
								</div>
				</form>
			</div>
		</div>
	)
}


			// --- Inline compact searchable multiselect component ---
			function SearchableMultiSelect({
				label,
				options,
				selected,
				onChange,
				placeholder,
			}: {
				label: string
				options: string[]
				selected: string[]
				onChange: (next: string[]) => void
				placeholder?: string
			}) {
				const [open, setOpen] = useState(false)
				const [query, setQuery] = useState("")

				const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

				const toggle = (o: string) => {
					const next = selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]
					onChange(next)
				}

					const containerRef = useRef<HTMLDivElement | null>(null)

					useEffect(() => {
						function onDocClick(e: MouseEvent) {
							if (!containerRef.current) return
							if (!containerRef.current.contains(e.target as Node)) {
								setOpen(false)
							}
						}

						function onKey(e: KeyboardEvent) {
							if (e.key === "Escape") setOpen(false)
						}

						document.addEventListener("mousedown", onDocClick)
						document.addEventListener("keydown", onKey)
						return () => {
							document.removeEventListener("mousedown", onDocClick)
							document.removeEventListener("keydown", onKey)
						}
					}, [containerRef])

					return (
						<div ref={containerRef} className="relative">
							<Label>{label}</Label>
							<div className="mt-2">
								<input
									className="w-full border rounded-md px-3 py-2 text-sm"
									placeholder={placeholder}
									value={query}
									onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
									onFocus={() => setOpen(true)}
									aria-label={label}
								/>

								{/* Selected chips underneath so input doesn't shrink */}
								<div className="mt-2 flex flex-wrap gap-2">
									{selected.map((s) => (
										<button key={s} type="button" onClick={() => toggle(s)} className="flex items-center gap-2 px-2 py-1 rounded-full border bg-primary text-primary-foreground text-xs">
											<span className="truncate max-w-[10rem]">{s}</span>
											<span className="opacity-70">×</span>
										</button>
									))}
								</div>

								{open && (
									<div className="absolute z-50 left-0 right-0 mt-2 bg-popover border rounded-md shadow-md max-h-56 overflow-y-auto p-2">
										<div className="px-2 pb-2 border-b border-border mb-2">
											<div className="text-xs text-muted-foreground">Tap an item to toggle selection</div>
										</div>
										{filtered.length === 0 ? (
											<div className="text-sm text-muted-foreground p-2">No results</div>
										) : (
											filtered.map((o) => (
												<button
													key={o}
													type="button"
													onClick={() => toggle(o)}
													className="w-full text-left flex items-center gap-3 px-2 py-2 hover:bg-accent rounded"
												>
													<span className={cn("w-4 h-4 inline-flex items-center justify-center rounded-sm text-xs", selected.includes(o) ? "bg-primary text-primary-foreground" : "border bg-background")}>
														{selected.includes(o) ? "✓" : ""}
													</span>
													<span className="text-sm truncate">{o}</span>
												</button>
											))
										)}
									</div>
								)}
							</div>
						</div>
					)
			}

