import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useWatch } from 'react-hook-form'
import { adminCardSchema, type AdminCardValues } from '../../lib/validation'
import { useSaveCard } from '../../services/admin/admin.queries'
import type { AdminCard } from '../../services/admin/admin.types'
import { getErrorMessage } from '../../services/api'
import { DESTINATION_LABELS, STATUS_LABELS } from '../../services/cards/cards.types'
import { useToast } from '../toast/toast-context'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field } from '../ui/Field'
import { describedBy } from '../ui/describedBy'
import { Input, Select } from '../ui/Input'

export type CardDraft = Partial<Pick<AdminCardValues, 'name' | 'ownerEmail'>>

interface CardFormDialogProps {
  open: boolean
  /** The card to edit; leave empty to create a new one. */
  card?: AdminCard | null
  /** Starting values for a new card, e.g. from a card request. */
  draft?: CardDraft
  onClose: () => void
}

export function CardFormDialog({ open, card, draft, onClose }: CardFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={card ? 'Edit card' : 'New card'}
      description={card ? `Card ID ${card.code}. Its printed link never changes, only where it opens.` : 'The card gets a permanent link. You can change where it opens at any time.'}
    >
      <CardForm card={card ?? null} draft={draft} onDone={onClose} />
    </Dialog>
  )
}

function CardForm({ card, draft, onDone }: { card: AdminCard | null; draft?: CardDraft; onDone: () => void }) {
  const { toast } = useToast()
  const save = useSaveCard()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminCardValues>({
    resolver: yupResolver(adminCardSchema),
    defaultValues: {
      name: card?.name ?? draft?.name ?? '',
      ownerEmail: card?.ownerEmail ?? draft?.ownerEmail ?? '',
      status: card?.status ?? 'draft',
      destinationType: card?.destinationType ?? 'profile',
      destinationUrl: card?.destinationUrl ?? '',
    },
  })
  const destinationType = useWatch({ control, name: 'destinationType' })

  const onSubmit = (values: AdminCardValues) =>
    save.mutate(
      {
        code: card?.code,
        body: {
          name: values.name,
          ownerEmail: values.ownerEmail || null,
          status: values.status,
          destinationType: values.destinationType,
          destinationUrl: values.destinationType === 'profile' ? null : values.destinationUrl,
        },
      },
      {
        onSuccess: () => {
          toast(card ? 'Card updated.' : 'Card created.')
          onDone()
        },
        onError: (error) => toast(getErrorMessage(error), 'error'),
      },
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field id="cf-name" label="Card name" required error={errors.name?.message}>
        <Input id="cf-name" placeholder="e.g. Table menu" invalid={!!errors.name} {...describedBy('cf-name', errors.name?.message)} {...register('name')} />
      </Field>
      <Field id="cf-email" label="Owner email" optional hint="The card shows up in their dashboard once they sign up with this email." error={errors.ownerEmail?.message}>
        <Input id="cf-email" type="email" placeholder="owner@business.com" invalid={!!errors.ownerEmail} {...describedBy('cf-email', errors.ownerEmail?.message, true)} {...register('ownerEmail')} />
      </Field>
      <Field id="cf-status" label="Status">
        <Select id="cf-status" {...register('status')}>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="cf-type" label="Opens">
        <Select id="cf-type" {...register('destinationType')}>
          {Object.entries(DESTINATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      {destinationType !== 'profile' && (
        <Field id="cf-url" label="Link" required error={errors.destinationUrl?.message}>
          <Input id="cf-url" type="url" placeholder="https://" invalid={!!errors.destinationUrl} {...describedBy('cf-url', errors.destinationUrl?.message)} {...register('destinationUrl')} />
        </Field>
      )}
      <div className="row">
        <Button variant="s" onClick={onDone}>
          Cancel
        </Button>
        <Button variant="p" type="submit" loading={save.isPending}>
          {card ? 'Save changes' : 'Create card'}
        </Button>
      </div>
    </form>
  )
}
