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
import { createProfileRecord } from "./actions"
import { countries, techStackOptions, occupations } from "@/utils/constants"



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








// Dummy function to simulate social connection status
const checkSocialConnections = async (): Promise<{ github: boolean; wakatime: boolean; linkedin: boolean }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For now, return dummy data - in real app, this would check database
  return {
    github: false,
    wakatime: false,
    linkedin: false
  }
}



export default function OnboardingPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [timeCommitment, setTimeCommitment] = useState<[number, number]>([10, 40])
  const [socialConnections, setSocialConnections] = useState<{ github: boolean; wakatime: boolean; linkedin: boolean }>({
    github: false,
    wakatime: false,
    linkedin: false
  })
  const [isCheckingSocials, setIsCheckingSocials] = useState(false)

  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 


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

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      console.log("Onboarding data received for submission:", data);
  
      // 1. Execute the Prisma data insertion operation
      const newRecord = await createProfileRecord(data, session?.user?.id || "");
  
  // 2. Log the result from the database
  console.log("✅ Prisma insertion complete. New Record:", newRecord);

  // Redirect the user to preferences so they can set partner preferences
  router.push("/preferences")
  // Show a quick toast/alert for feedback
  alert("Onboarding completed successfully! Redirecting to preferences...");
      
    } catch (error) {
      console.error("❌ Error submitting onboarding:", error);
      alert("There was an error submitting your information. Please try again.");
    }
  };

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

  const handleSocialConnect = async (platform: 'github' | 'wakatime' | 'linkedin') => {
    setIsCheckingSocials(true)
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, just toggle the state - in real app, this would handle OAuth
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
    let fieldsToValidate: (keyof OnboardingFormData)[] = []
    
    if (currentPage === 1) {
      fieldsToValidate = ["name", "age", "gender"]
    } else if (currentPage === 2) {
      fieldsToValidate = ["timeCommitment", "country", "occupation"]
    } else if (currentPage === 3) {
      fieldsToValidate = ["techStack"]
    }
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleBack = () => {
    setCurrentPage(currentPage - 1)
  }

  const canCompleteOnboarding = () => {
    const connectedCount = Object.values(socialConnections).filter(Boolean).length
    return connectedCount >= 2
  }

  const renderPage1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Tell us about yourself</h1>
        <p className="text-muted-foreground mt-2">
          Let's start with some basic information
        </p>
      </div>

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
    </div>
  )

  const renderPage2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your availability</h1>
        <p className="text-muted-foreground mt-2">
          Help us understand your schedule and preferences
        </p>
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
    </div>
  )

  const renderPage3 = () => {
    // Sort tech stack options to show selected ones first
    const sortedTechStackOptions = [...techStackOptions].sort((a, b) => {
      const aSelected = selectedTechStack.includes(a)
      const bSelected = selectedTechStack.includes(b)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
    })

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your tech stack</h1>
          <p className="text-muted-foreground mt-2">
            Select all technologies you work with
          </p>
        </div>

        {/* Tech Stack - Duolingo Style with Bubbling */}
        <div className="space-y-3">
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
          {errors.techStack && (
            <p className="text-sm text-destructive">{errors.techStack.message}</p>
          )}
        </div>
      </div>
    )
  }

  const renderPage4 = () => {
    const connectedCount = Object.values(socialConnections).filter(Boolean).length
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Connect your socials</h1>
          <p className="text-muted-foreground mt-2">
            Connect at least 2 platforms to complete your profile
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {connectedCount}/3 connected
          </p>
        </div>

        <div className="space-y-4">
          {/* GitHub */}
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

          {/* Wakatime */}
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

          {/* LinkedIn */}
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

        {connectedCount < 2 && (
          <p className="text-sm text-destructive text-center">
            Please connect at least 2 platforms to continue
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16 flex items-center">
      <div className="max-w-sm mx-auto py-8 px-4 w-full">
        {/* Progress Indicator */}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {currentPage === 1 && renderPage1()}
          {currentPage === 2 && renderPage2()}
          {currentPage === 3 && renderPage3()}
          {currentPage === 4 && renderPage4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentPage > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            {currentPage < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !canCompleteOnboarding()}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? "Completing..." : "Complete Onboarding"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}