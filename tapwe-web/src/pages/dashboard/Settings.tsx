import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../auth/auth-context'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { useToast } from '../../components/toast/toast-context'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { describedBy } from '../../components/ui/describedBy'
import { Input } from '../../components/ui/Input'
import { settingsSchema, type SettingsValues } from '../../lib/validation'
import { getErrorMessage } from '../../services/api'
import { AuthService } from '../../services/auth/auth.service'

export default function Settings() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const save = useMutation({ mutationFn: AuthService.updateMe })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: yupResolver(settingsSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const onSubmit = (values: SettingsValues) =>
    save.mutate(values, {
      onSuccess: (updated) => {
        setUser(updated)
        toast('Account details saved.')
      },
      onError: (error) => toast(getErrorMessage(error), 'error'),
    })

  return (
    <>
      <PageTitle title="Account Settings" description="Update your name and email." />
      <div className="card" style={{ padding: 24, maxWidth: 520 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'grid', gap: 20 }}>
          <Field id="an" label="Full name" error={errors.name?.message}>
            <Input id="an" autoComplete="name" invalid={!!errors.name} {...describedBy('an', errors.name?.message)} {...register('name')} />
          </Field>
          <Field id="ae" label="Email" error={errors.email?.message}>
            <Input id="ae" type="email" autoComplete="email" invalid={!!errors.email} {...describedBy('ae', errors.email?.message)} {...register('email')} />
          </Field>
          <div>
            <Button variant="p" type="submit" loading={save.isPending}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
