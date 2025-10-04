"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { onboardingSchema, type OnboardingFormData } from "@/lib/schemas/onboarding"
import { cn } from "@/lib/utils"

const techStackOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "Flutter",
  "React Native",
  "Vue.js",
  "Angular",
  "Svelte",
  "Express.js",
  "FastAPI",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Rails",
  "ASP.NET",
  "GraphQL",
  "REST API",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Firebase",
  "Supabase",
  "Prisma",
  "Sequelize",
  "TypeORM",
  "Jest",
  "Cypress",
  "Playwright",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Chakra UI",
  "Ant Design",
]

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Ireland",
  "Portugal",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Slovenia",
  "Slovakia",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "Singapore",
  "India",
  "China",
  "Brazil",
  "Argentina",
  "Chile",
  "Mexico",
  "South Africa",
  "Israel",
  "Turkey",
  "Russia",
  "Ukraine",
  "Other",
]

const occupations = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Mobile Developer",
  "Game Developer",
  "Web Developer",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "Technical Lead",
  "Engineering Manager",
  "CTO",
  "CEO/Founder",
  "Freelancer",
  "Student",
  "Bootcamp Graduate",
  "Career Changer",
  "Consultant",
  "Other",
]

export default function OnboardingPage() {
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [timeCommitment, setTimeCommitment] = useState<[number, number]>([10, 40])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      timeCommitment: [10, 40],
      techStack: [],
      openForProjects: false,
    },
  })

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      console.log("Onboarding data:", data)
      // Here you would typically send the data to your API
      // await submitOnboardingData(data)
      alert("Onboarding completed successfully!")
    } catch (error) {
      console.error("Error submitting onboarding:", error)
      alert("There was an error submitting your information. Please try again.")
    }
  }

  const handleTechStackToggle = (tech: string) => {
    const newTechStack = selectedTechStack.includes(tech)
      ? selectedTechStack.filter((t) => t !== tech)
      : [...selectedTechStack, tech]
    
    setSelectedTechStack(newTechStack)
    setValue("techStack", newTechStack)
  }

  const handleTimeCommitmentChange = (value: number[]) => {
    const newValue = [value[0], value[1]] as [number, number]
    setTimeCommitment(newValue)
    setValue("timeCommitment", newValue)
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-sm mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Co-Pal!</h1>
          <p className="text-muted-foreground mt-1">
            Let's get to know you better to find your perfect coding partner
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              {...register("age", { valueAsNumber: true })}
              className={errors.age ? "border-destructive" : ""}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select onValueChange={(value) => setValue("gender", value as any)}>
              <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>

          {/* Time Commitment */}
          <div className="space-y-4">
            <Label>Time Commitment (hours per week) *</Label>
            <div className="px-3">
              <Slider
                value={timeCommitment}
                onValueChange={handleTimeCommitmentChange}
                min={0}
                max={80}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{timeCommitment[0]} hours</span>
                <span>{timeCommitment[1]} hours</span>
              </div>
            </div>
            {errors.timeCommitment && (
              <p className="text-sm text-destructive">{errors.timeCommitment.message}</p>
            )}
          </div>

          {/* Tech Stack - Duolingo Style */}
          <div className="space-y-3">
            <Label>Tech Stack *</Label>
            <p className="text-sm text-muted-foreground">Select all technologies you work with</p>
            <div className="flex flex-wrap gap-2">
              {techStackOptions.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechStackToggle(tech)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    selectedTechStack.includes(tech)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
            {errors.techStack && (
              <p className="text-sm text-destructive">{errors.techStack.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label>Country of Residence *</Label>
            <Select onValueChange={(value) => setValue("country", value)}>
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label>Occupation *</Label>
            <Select onValueChange={(value) => setValue("occupation", value)}>
              <SelectTrigger className={errors.occupation ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your occupation" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {occupations.map((occupation) => (
                  <SelectItem key={occupation} value={occupation}>
                    {occupation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.occupation && (
              <p className="text-sm text-destructive">{errors.occupation.message}</p>
            )}
          </div>

          {/* Open for Projects - Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="openForProjects" className="text-base">
                  Open for Projects
                </Label>
                <p className="text-sm text-muted-foreground">
                  I'm currently open for new projects and collaborations
                </p>
              </div>
              <Switch
                id="openForProjects"
                checked={watch("openForProjects")}
                onCheckedChange={(checked) => setValue("openForProjects", checked)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Completing Onboarding..." : "Complete Onboarding"}
          </Button>
        </form>
      </div>
    </div>
  )
}