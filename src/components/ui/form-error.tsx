import { AlertCircle } from 'lucide-react';
import type { FieldError, FieldErrors } from 'react-hook-form';

import { cn } from '@/lib/utils';

export interface FieldErrorProps {
  error?: FieldError;
  className?: string;
}

/**
 * Display a single field error
 */
export function FieldErrorMessage({ error, className }: FieldErrorProps) {
  if (!error?.message) {
    return null;
  }

  return (
    <p className={cn('text-destructive mt-1 flex items-center gap-1 text-sm', className)} role="alert">
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{error.message}</span>
    </p>
  );
}

export interface FormErrorProps {
  errors?: FieldErrors;
  className?: string;
}

/**
 * Display all form errors in a summary
 */
export function FormErrorSummary({ errors, className }: FormErrorProps) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorMessages = Object.entries(errors)
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: (error as FieldError).message!,
    }));

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('bg-destructive/10 border-destructive/50 rounded-md border p-3', className)}
      role="alert"
      aria-live="polite"
    >
      <div className="text-destructive mb-2 flex items-center gap-2 font-medium">
        <AlertCircle className="size-4" />
        <span>Please fix the following errors:</span>
      </div>
      <ul className="text-destructive list-inside list-disc space-y-1 text-sm">
        {errorMessages.map(({ field, message }) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export interface RootErrorProps {
  message?: string;
  className?: string;
}

/**
 * Display a root-level form error (e.g., API error)
 */
export function RootFormError({ message, className }: RootErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-destructive/10 border-destructive text-destructive flex items-center gap-2 rounded-md border px-4 py-3 text-sm',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
