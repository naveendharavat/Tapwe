import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/auth-context'
import { AuthLayout } from '../components/auth/AuthLayout'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useToast } from '../components/toast/toast-context'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { describedBy } from '../components/ui/describedBy'
import { Input } from '../components/ui/Input'
import { signUpSchema, type SignUpValues } from '../lib/validation'
import { getErrorMessage } from '../services/api'

export default function SignUp() {
  const { user, signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: yupResolver(signUpSchema), defaultValues: { name: '', email: '', password: '' } })

  if (user) return <Navigate to="/app" replace />

  const onSubmit = async (values: SignUpValues) => {
    try {
      await signUp(values)
      toast('Account created.')
      navigate('/app', { replace: true })
    } catch (error) {
      toast(getErrorMessage(error), 'error')
    }
  }

  return (
    <AuthLayout
      asideTitle="We set up your card. You just tap."
      asideText="Create an account to follow your card request. Our team configures the card and delivers it ready to use."
      title="Create your account"
      subtitle="Track your card requests and changes."
      footer={
        <>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="name" label="Full name" required error={errors.name?.message}>
          <Input id="name" autoComplete="name" aria-required invalid={!!errors.name} {...describedBy('name', errors.name?.message)} {...register('name')} />
        </Field>
        <Field id="email" label="Email" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" aria-required invalid={!!errors.email} {...describedBy('email', errors.email?.message)} {...register('email')} />
        </Field>
        <Field id="pw" label="Password" required error={errors.password?.message} hint="At least 8 characters.">
          <PasswordInput id="pw" autoComplete="new-password" invalid={!!errors.password} {...describedBy('pw', errors.password?.message, true)} {...register('password')} />
        </Field>
        <Button variant="p" size="lg" type="submit" loading={isSubmitting}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  )
}
