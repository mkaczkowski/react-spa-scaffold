import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type RegisterFormData, registerFormSchema } from '@/lib/validations';

/**
 * React Hook Form + Zod hook for registration.
 * Demonstrates cross-field validation (password confirmation).
 */
export function useRegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Replace with your actual registration logic
    // eslint-disable-next-line no-console
    console.log('Registration submitted:', data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    reset: form.reset,
  };
}
