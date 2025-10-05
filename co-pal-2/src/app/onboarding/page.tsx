"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { onboardingSchema, type OnboardingFormData } from "@/lib/schemas/onboarding"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Github, Linkedin, Clock } from "lucide-react"
import { authClient } from "@/lib/auth-client"

import { createProfileRecord, saveGitHubData } from "./actions"
import { COUNTRIES, OCCUPATIONS, TECH_STACK_OPTIONS } from "@/utils/constants"
import { useGitHubStats } from "@/hooks/use-github-stats"



// The expected structure of the form data
// type OnboardingFormData = {
//   name: string;
//   email: string;
//   id: string; 
//   age: number;
//   gender: string;
//   timeCommitment: number[];
//   techStack: string[];
//   country: string;
//   occupation: string;
//   openForProjects: boolean;
// };

// Types
interface SocialConnections {
  github: boolean
  wakatime: boolean
  linkedin: boolean
}

type SocialPlatform = 'github' | 'wakatime' | 'linkedin'



// Sub-components
const ProgressIndicator = ({ currentPage }: { currentPage: number }) => (
  <div className="mb-8">
    <div className="flex items-center justify-center space-x-2">
      {[1, 2, 3, 4].map((page) => (
        <div
          key={page}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            page <= currentPage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {page}
        </div>
      ))}
    </div>
    <div className="text-center mt-2">
      <span className="text-sm text-muted-foreground">
        Step {currentPage} of 4
      </span>
    </div>
  </div>
)

const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
    <p className="text-muted-foreground mt-2">{subtitle}</p>
  </div>
)

const FormField = ({ 
  label, 
  error, 
  children 
}: { 
  label: string; 
  error?: string; 
  children: React.ReactNode 
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
)

const NavigationButtons = ({ 
  currentPage, 
  onBack, 
  onNext, 
  isSubmitting, 
  canComplete 
}: {
  currentPage: number
  onBack: () => void
  onNext: () => void
  isSubmitting: boolean
  canComplete: boolean
}) => (
  <div className="flex justify-between mt-8">
    {currentPage > 1 ? (
      <Button type="button" variant="outline" onClick={onBack} className="flex items-center space-x-2">
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
    ) : (
      <div />
    )}

    {currentPage < 4 ? (
      <Button type="button" onClick={onNext} className="flex items-center space-x-2">
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    ) : (
      <Button type="submit" disabled={isSubmitting || !canComplete} className="flex items-center space-x-2">
        {isSubmitting ? "Completing..." : "Complete Onboarding"}
      </Button>
    )}
  </div>
)

export default function OnboardingPage() {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [timeCommitment, setTimeCommitment] = useState<[number, number]>([10, 40])
  const [socialConnections, setSocialConnections] = useState<SocialConnections>({
    github: false,
    wakatime: false,
    linkedin: false
  })
  const [isCheckingSocials, setIsCheckingSocials] = useState(false)

  // Hooks
  const { data: session } = authClient.useSession()
  const { stats: githubStats } = useGitHubStats()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      timeCommitment: [10, 40],
      techStack: [],
      openForProjects: false,
    },
  })

  // Handlers
  const handleSubmitForm = async (data: OnboardingFormData) => {
    try {
      console.log("Onboarding data received for submission:", data)
      const newRecord = await createProfileRecord(data, session?.user?.id || "")
      console.log("✅ Prisma insertion complete. New Record:", newRecord)
      
      alert("Onboarding completed successfully!")
      
      // Redirect to main app
      router.push("/feed")

    } catch (error) {
      console.error("❌ Error submitting onboarding:", error)
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

  const handleSocialConnect = async (platform: SocialPlatform) => {
    setIsCheckingSocials(true)
    
    try {
      console.log("🌄👉: ", platform)
      if (platform === 'github' && githubStats) {
        await saveGitHubData(githubStats, session?.user?.id || "")
        console.log("🌄✅👉: GitHub data saved")
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSocialConnections(prev => ({
        ...prev,
        [platform]: !prev[platform]
      }))
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error)
    } finally {
      setIsCheckingSocials(false)
    }
  }

  const handleNext = async () => {
    const validationFields: Record<number, (keyof OnboardingFormData)[]> = {
      1: ["name", "age", "gender"],
      2: ["timeCommitment", "country", "occupation"],
      3: ["techStack"]
    }
    
    const fieldsToValidate = validationFields[currentPage] || []
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleBack = () => setCurrentPage(currentPage - 1)

  const canCompleteOnboarding = () => {
    const connectedCount = Object.values(socialConnections).filter(Boolean).length
    return connectedCount >= 2
  }

  // Page renderers
  const renderPage1 = () => (
    <div className="space-y-6">
      <PageHeader 
        title="Tell us about yourself" 
        subtitle="Let's start with some basic information" 
      />

      <FormField label="Full Name *" error={errors.name?.message}>
        <Input
          placeholder="Enter your full name"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Age *" error={errors.age?.message}>
        <Input
          type="number"
          placeholder="Enter your age"
          {...register("age", { valueAsNumber: true })}
          className={errors.age ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Gender *" error={errors.gender?.message}>
        <Select onValueChange={(value) => setValue("gender", value as any)}>
          <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  )

  const renderPage2 = () => (
    <div className="space-y-6">
      <PageHeader 
        title="Your availability" 
        subtitle="Help us understand your schedule and preferences" 
      />

      <FormField label="Time Commitment (hours per week) *" error={errors.timeCommitment?.message}>
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
      </FormField>

      <FormField label="Country of Residence *" error={errors.country?.message}>
        <Select onValueChange={(value) => setValue("country", value)}>
          <SelectTrigger className={errors.country ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Occupation *" error={errors.occupation?.message}>
        <Select onValueChange={(value) => setValue("occupation", value)}>
          <SelectTrigger className={errors.occupation ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your occupation" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {OCCUPATIONS.map((occupation) => (
              <SelectItem key={occupation} value={occupation}>
                {occupation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

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
    </div>
  )

  const renderPage3 = () => {
    const sortedTechStackOptions = [...TECH_STACK_OPTIONS].sort((a, b) => {
      const aSelected = selectedTechStack.includes(a)
      const bSelected = selectedTechStack.includes(b)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
    })

    return (
      <div className="space-y-6">
        <PageHeader 
          title="Your tech stack" 
          subtitle="Select all technologies you work with" 
        />

        <FormField label="" error={errors.techStack?.message}>
          <div className="flex flex-wrap gap-2">
            {sortedTechStackOptions.map((tech) => (
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
        </FormField>
      </div>
    )
  }

  const renderPage4 = () => {
    const connectedCount = Object.values(socialConnections).filter(Boolean).length
    
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Connect your socials" 
          subtitle="Connect your platforms to enrich your profile" 
        />

        <div className="space-y-4">
          <Button
            type="button"
            variant={socialConnections.github ? "default" : "outline"}
            onClick={() => handleSocialConnect('github')}
            disabled={isCheckingSocials}
            className="w-full justify-start space-x-3 h-12"
          >
            <Github className="w-5 h-5" />
            <span>Connect GitHub</span>
            {socialConnections.github && <span className="ml-auto text-sm">✓ Connected</span>}
          </Button>

          <Button
            type="button"
            variant={socialConnections.wakatime ? "default" : "outline"}
            onClick={() => handleSocialConnect('wakatime')}
            disabled={isCheckingSocials}
            className="w-full justify-start space-x-3 h-12"
          >
            <Clock className="w-5 h-5" />
            <span>Connect Wakatime</span>
            {socialConnections.wakatime && <span className="ml-auto text-sm">✓ Connected</span>}
          </Button>

          <Button
            type="button"
            variant={socialConnections.linkedin ? "default" : "outline"}
            onClick={() => handleSocialConnect('linkedin')}
            disabled={isCheckingSocials}
            className="w-full justify-start space-x-3 h-12"
          >
            <Linkedin className="w-5 h-5" />
            <span>Connect LinkedIn</span>
            {socialConnections.linkedin && <span className="ml-auto text-sm">✓ Connected</span>}
          </Button>
        </div>

        {/* No minimum connection requirement */}
      </div>
    )
  }

  // Main render
  return (
    <div className="min-h-screen bg-background pb-16 flex items-center">
      <div className="max-w-sm mx-auto py-8 px-4 w-full">
        <ProgressIndicator currentPage={currentPage} />
        
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {currentPage === 1 && renderPage1()}
          {currentPage === 2 && renderPage2()}
          {currentPage === 3 && renderPage3()}
          {currentPage === 4 && renderPage4()}

          <NavigationButtons
            currentPage={currentPage}
            onBack={handleBack}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            canComplete={canCompleteOnboarding()}
          />
        </form>
      </div>
    </div>
  )
}