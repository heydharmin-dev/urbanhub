import { cn } from "@/lib/utils"

export default function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className={cn(sizes[size], "border-primary border-t-transparent rounded-full animate-spin", className)} />
  )
}
