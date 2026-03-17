import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-sm border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
              error ? "border-accent focus:border-accent focus:ring-accent" : "border-gray-300",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-accent mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-text-secondary mt-0.5">{helperText}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
