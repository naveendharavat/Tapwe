import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useWatch } from 'react-hook-form'
import { PhoneMockup, ProfileScreen } from '../../components/cards/PhoneMockup'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { useToast } from '../../components/toast/toast-context'
import { Button } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Field } from '../../components/ui/Field'
import { describedBy } from '../../components/ui/describedBy'
import { Input } from '../../components/ui/Input'
import { profileSchema, type ProfileValues } from '../../lib/validation'
import { getErrorMessage } from '../../services/api'
import { useProfile, useUpdateProfile } from '../../services/profile/profile.queries'
import type { BusinessProfile } from '../../services/profile/profile.types'

const toForm = (p: BusinessProfile): ProfileValues => ({
  businessName: p.businessName ?? '',
  description: p.description ?? '',
  phone: p.phone ?? '',
  website: p.website ?? '',
})

export default function Profile() {
  const profile = useProfile()
  return (
    <>
      <PageTitle title="Digital Profile" description="The page customers see when a card points to your profile." />
      {profile.isPending ? (
        <Skeleton label="Loading profile" />
      ) : profile.isError ? (
        <EmptyState icon="alert" title="We couldn’t load your profile" description="Check your connection and try again." />
      ) : (
        <ProfileForm initial={toForm(profile.data)} />
      )}
    </>
  )
}

function ProfileForm({ initial }: { initial: ProfileValues }) {
  const { toast } = useToast()
  const update = useUpdateProfile()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: yupResolver(profileSchema), defaultValues: initial })
  const [name, description] = useWatch({ control, name: ['businessName', 'description'] })

  const onSubmit = (values: ProfileValues) =>
    update.mutate(values, {
      onSuccess: () => toast('Profile saved.'),
      onError: (error) => toast(getErrorMessage(error), 'error'),
    })

  return (
    <div className="cc">
      <div className="card f">
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'grid', gap: 20 }}>
          <Field id="pn" label="Business name">
            <Input id="pn" {...register('businessName')} />
          </Field>
          <Field id="pt" label="Short description">
            <Input id="pt" placeholder="e.g. Café · Open until 10 pm" {...register('description')} />
          </Field>
          <Field id="pp" label="Phone" error={errors.phone?.message}>
            <Input id="pp" type="tel" invalid={!!errors.phone} {...describedBy('pp', errors.phone?.message)} {...register('phone')} />
          </Field>
          <Field id="pw2" label="Website" error={errors.website?.message}>
            <Input id="pw2" type="url" placeholder="https://" invalid={!!errors.website} {...describedBy('pw2', errors.website?.message)} {...register('website')} />
          </Field>
          <div>
            <Button variant="p" type="submit" loading={update.isPending}>
              Save profile
            </Button>
          </div>
        </form>
      </div>
      <aside>
        <p className="muted" style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
          Live preview
        </p>
        <div style={{ maxWidth: 220 }}>
          <PhoneMockup>
            <ProfileScreen name={name.trim() || 'Your Business'} description={description.trim()} />
          </PhoneMockup>
        </div>
      </aside>
    </div>
  )
}
