import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { Button, describedBy, Field, Input, Note } from '../../../components/ui'
import { useToast } from '../../../components/toast/toast-context'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../../../lib/validation'
import { AuthService } from '../../../services/auth/auth.service'
import { getErrorMessage } from '../../../services/supabase'

export default function ForgotPassword() {
  const { toast } = useToast()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: yupResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    try {
      await AuthService.requestPasswordReset(email)
      setSentTo(email)
    } catch (error) {
      toast(getErrorMessage(error), 'error')
    }
  }

  return (
    <AuthLayout
      asideTitle="Welcome back to your cards."
      asideText="Choose a new password and get back to your dashboard."
      title="Reset your password"
      subtitle={sentTo ? `If an account exists for ${sentTo}, a reset link is on its way.` : 'Enter your email and we will send you a link to choose a new password.'}
      footer={
        <>
          Remembered it? <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      {sentTo ? (
        <Note>Check your inbox and open the link to set a new password. It expires after an hour, so request a new one if it stops working.</Note>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field id="email" label="Email" required error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" aria-required invalid={!!errors.email} {...describedBy('email', errors.email?.message)} {...register('email')} />
          </Field>
          <Button variant="p" size="lg" type="submit" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
