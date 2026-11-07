import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { homePath, useAuth } from '../../../auth/auth-context'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { Box, Button, describedBy, Field, LinkButton, PasswordInput, Skeleton } from '../../../components/ui'
import { useToast } from '../../../components/toast/toast-context'
import { resetPasswordSchema, type ResetPasswordValues } from '../../../lib/validation'
import { AuthService } from '../../../services/auth/auth.service'
import { getErrorMessage } from '../../../services/supabase'

/** Opened from the email link; Supabase signs the person in from the link before this renders. */
export default function ResetPassword() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: yupResolver(resetPasswordSchema), defaultValues: { password: '' } })

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    try {
      await AuthService.updatePassword(password)
      toast('Password updated.')
      navigate(user ? homePath(user) : '/sign-in', { replace: true })
    } catch (error) {
      toast(getErrorMessage(error), 'error')
    }
  }

  const expired = !isLoading && !user

  return (
    <AuthLayout
      asideTitle="Welcome back to your cards."
      asideText="Choose a new password and get back to your dashboard."
      title={expired ? 'This link has expired' : 'Choose a new password'}
      subtitle={expired ? 'Reset links work once and expire after an hour. Request a new one to continue.' : 'Use at least 8 characters.'}
      footer={
        <>
          Back to <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      {isLoading && <Skeleton label="Checking your reset link" />}
      {expired && (
        <Box className="auth-actions">
          <LinkButton variant="p" size="lg" to="/forgot-password">
            Request a new link
          </LinkButton>
        </Box>
      )}
      {!isLoading && user && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field id="pw" label="New password" required error={errors.password?.message}>
            <PasswordInput id="pw" autoComplete="new-password" invalid={!!errors.password} {...describedBy('pw', errors.password?.message)} {...register('password')} />
          </Field>
          <Button variant="p" size="lg" type="submit" loading={isSubmitting}>
            Save password
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
