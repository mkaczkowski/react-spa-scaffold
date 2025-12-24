import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type ContactFormData, contactFormSchema } from '@/lib/validations';

/**
 * Example React Hook Form + Zod hook for a contact form.
 * Demonstrates the pattern for form validation.
 */
export function useContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Replace with your actual form submission logic
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
    // await api.submitContactForm(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}
