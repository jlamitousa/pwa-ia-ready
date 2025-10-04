import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function getIntentColor(intent: string, enabled: boolean): string {
  if (!enabled) return 'intent-disabled'
  
  switch (intent) {
    case 'findable': return 'intent-findable'
    case 'comparable': return 'intent-comparable'
    case 'verifiable': return 'intent-verifiable'
    case 'summarizable': return 'intent-summarizable'
    case 'recommendable': return 'intent-recommendable'
    default: return 'intent-disabled'
  }
}

export function getCoverageColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
