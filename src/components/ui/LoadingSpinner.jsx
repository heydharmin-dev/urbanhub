export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className={`${sizes[size]} border-indigo-500 border-t-transparent rounded-full animate-spin`} />
  )
}
