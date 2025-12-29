import { Trans, useLingui } from '@lingui/react/macro';

import { Button } from '@/components/ui/button';
import { FieldErrorMessage } from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '@/hooks';

/**
 * Registration form component demonstrating cross-field validation.
 * Shows password confirmation with Zod's refine() for matching passwords.
 */
export function RegisterForm() {
  const { t } = useLingui();
  const { form, onSubmit, isSubmitting, errors } = useRegisterForm();
  const { register } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">
          <Trans comment="Register form username field label">Username</Trans>
        </Label>
        <Input
          id="username"
          placeholder={t({ message: 'johndoe', comment: 'Username placeholder example' })}
          autoComplete="username"
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        <FieldErrorMessage error={errors.username} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">
          <Trans comment="Register form email field label">Email</Trans>
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder={t({ message: 'john@example.com', comment: 'Email placeholder example' })}
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        <FieldErrorMessage error={errors.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          <Trans comment="Register form password field label">Password</Trans>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t({
            message: 'Min 8 chars, uppercase, lowercase, number',
            comment: 'Password requirements hint',
          })}
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <FieldErrorMessage error={errors.password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          <Trans comment="Register form confirm password field label">Confirm Password</Trans>
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t({ message: 'Re-enter your password', comment: 'Confirm password placeholder' })}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <FieldErrorMessage error={errors.confirmPassword} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <Trans comment="Register form submitting state">Creating account...</Trans>
        ) : (
          <Trans comment="Register form submit button">Create Account</Trans>
        )}
      </Button>
    </form>
  );
}
