import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { homePath, useAuth } from '../auth/auth-context'
import { AuthLayout } from '../components/auth/AuthLayout'
import { PasswordInput } from '../components/auth/PasswordInput'
import { useToast } from '../components/toast/toast-context'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { describedBy } from '../components/ui/describedBy'
import { Input } from '../components/ui/Input'
import { signInSchema, type SignInValues } from '../lib/validation'
import { getErrorMessage } from '../services/api'

export default function SignIn() {
  const { user, signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: yupResolver(signInSchema), defaultValues: { email: '', password: '' } })

  if (user) return <Navigate to={homePath(user)} replace />

  const onSubmit = async (values: SignInValues) => {
    try {
      const signedIn = await signIn(values)
      toast('Signed in.')
      navigate(from ?? homePath(signedIn), { replace: true })
    } catch (error) {
      toast(getErrorMessage(error), 'error')
    }
  }

  return (
    <AuthLayout
      asideTitle="Welcome back to your cards."
      asideText="Sign in to view your cards and request changes."
      title="Sign in"
      subtitle="Enter your details to manage your cards."
      footer={
        <>
          New to Tapwe? <Link to="/sign-up">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="email" label="Email" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" aria-required invalid={!!errors.email} {...describedBy('email', errors.email?.message)} {...register('email')} />
        </Field>
        <Field id="pw" label="Password" required error={errors.password?.message}>
          <PasswordInput id="pw" autoComplete="current-password" invalid={!!errors.password} {...describedBy('pw', errors.password?.message)} {...register('password')} />
        </Field>
        <Button variant="p" size="lg" type="submit" loading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  )
}
