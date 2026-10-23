import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { changeRequestSchema, type ChangeRequestValues } from '../../lib/validation'
import { getErrorMessage } from '../../services/api'
import { useDeleteCard, useRequestCardChange } from '../../services/cards/cards.queries'
import { STATUS_LABELS, type Card, type CardStatus } from '../../services/cards/cards.types'
import { useToast } from '../toast/toast-context'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Dropdown } from '../ui/Dropdown'
import { Field } from '../ui/Field'
import { describedBy } from '../ui/describedBy'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { useCopyCardUrl } from './useCopyCardUrl'

export function StatusBadge({ status }: { status: CardStatus }) {
  return <Badge tone={status === 'active' ? 'ok' : status === 'paused' ? 'warn' : undefined}>{STATUS_LABELS[status]}</Badge>
}

type Pending = { kind: 'change' | 'delete'; card: Card } | null

export function CardsTable({ cards }: { cards: Card[] }) {
  const [pending, setPending] = useState<Pending>(null)
  const copyUrl = useCopyCardUrl()
  const close = () => setPending(null)

  return (
    <>
      <div className="twrap">
        <table>
          <caption className="sr">Your cards</caption>
          <thead>
            <tr>
              <th scope="col">Card name</th>
              <th scope="col">Card ID</th>
              <th scope="col">Status</th>
              <th scope="col">Destination</th>
              <th scope="col">
                <span className="sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.code}>
                <td style={{ fontWeight: 500 }}>{card.name}</td>
                <td className="id">{card.code}</td>
                <td>
                  <StatusBadge status={card.status} />
                </td>
                <td className="dest">{card.destinationLabel}</td>
                <td className="act">
                  <Dropdown
                    trigger={(props) => (
                      <button type="button" className="btn icon btn-g" aria-label={`Actions for ${card.name}`} {...props}>
                        <Icon name="more" />
                      </button>
                    )}
                  >
                    {(closeMenu) => (
                      <>
                        <button type="button" role="menuitem" onClick={() => (closeMenu(), void copyUrl(card.url))}>
                          <Icon name="copy" />
                          Copy card URL
                        </button>
                        <Link role="menuitem" to={`/app/qr?card=${card.code}`}>
                          <Icon name="qr" />
                          View QR code
                        </Link>
                        <button type="button" role="menuitem" onClick={() => (closeMenu(), setPending({ kind: 'change', card }))}>
                          <Icon name="edit" />
                          Request a change
                        </button>
                        <hr />
                        <button type="button" role="menuitem" className="dng" onClick={() => (closeMenu(), setPending({ kind: 'delete', card }))}>
                          <Icon name="trash" />
                          Delete card
                        </button>
                      </>
                    )}
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChangeRequestDialog card={pending?.kind === 'change' ? pending.card : null} onClose={close} />
      <DeleteCardDialog card={pending?.kind === 'delete' ? pending.card : null} onClose={close} />
    </>
  )
}

function ChangeRequestDialog({ card, onClose }: { card: Card | null; onClose: () => void }) {
  const { toast } = useToast()
  const requestChange = useRequestCardChange()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeRequestValues>({ resolver: yupResolver(changeRequestSchema), defaultValues: { message: '' } })

  const finish = () => {
    reset()
    onClose()
  }
  const onSubmit = ({ message }: ChangeRequestValues) =>
    card &&
    requestChange.mutate(
      { code: card.code, message },
      {
        onSuccess: () => {
          toast('Change request sent. Our team will update it.')
          finish()
        },
        onError: (error) => toast(getErrorMessage(error), 'error'),
      },
    )

  const error = errors.message?.message
  return (
    <Dialog
      open={!!card}
      onClose={finish}
      title="Request a change"
      description={card && `${card.name} keeps the same card URL. Tell us what it should open and our team will update it.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="ed" label="What should it open?" required error={error}>
          <Input id="ed" placeholder="e.g. our new menu link" invalid={!!error} {...describedBy('ed', error)} {...register('message')} />
        </Field>
        <div className="row">
          <Button variant="s" onClick={finish}>
            Cancel
          </Button>
          <Button variant="p" type="submit" loading={requestChange.isPending}>
            Send request
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function DeleteCardDialog({ card, onClose }: { card: Card | null; onClose: () => void }) {
  const { toast } = useToast()
  const deleteCard = useDeleteCard()

  const confirm = () =>
    card &&
    deleteCard.mutate(card.code, {
      onSuccess: () => {
        toast('Card deleted.')
        onClose()
      },
      onError: (error) => toast(getErrorMessage(error), 'error'),
    })

  return (
    <Dialog
      open={!!card}
      onClose={onClose}
      title="Delete this card?"
      description={card && `“${card.name}” will stop working when tapped or scanned, and will be removed from your cards.`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          confirm()
        }}
      >
        <div className="row">
          <Button variant="s" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="d" type="submit" loading={deleteCard.isPending}>
            Delete card
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
