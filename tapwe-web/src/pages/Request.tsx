import { yupResolver } from '@hookform/resolvers/yup'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardFan } from '../components/cards/SmartCardPreview'
import { useToast } from '../components/toast/toast-context'
import { Button, LinkButton } from '../components/ui/Button'
import { Field, FieldError, RequiredMark } from '../components/ui/Field'
import { describedBy } from '../components/ui/describedBy'
import { Icon } from '../components/ui/Icon'
import { Input, Select, Textarea } from '../components/ui/Input'
import { useReveal } from '../hooks/useReveal'
import { revealDelay } from '../lib/cssVars'
import { BUSINESS_TYPES, CARD_QUANTITIES, REQUEST_DESTINATIONS } from '../lib/options'
import { requestSchema, type RequestValues } from '../lib/validation'
import { getErrorMessage } from '../services/api'
import { useSubmitCardRequest } from '../services/card-requests/card-requests.queries'

const STEPS: Array<[string, string]> = [
  ['Send your request', 'Share your business details and what the card should open.'],
  ['We review it', 'We check your details and get in touch to confirm.'],
  ['Your card is set up', 'One permanent link, with an NFC chip and a QR code.'],
]

const EMPTY: RequestValues = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  businessType: '',
  quantity: CARD_QUANTITIES[0],
  destinations: [],
  city: '',
  note: '',
  agreed: false,
}

export default function Request() {
  useReveal()
  const [submitted, setSubmitted] = useState<RequestValues | null>(null)
  const box = useRef<HTMLDivElement>(null)

  const onSent = (values: RequestValues) => {
    setSubmitted(values)
    box.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="hero-wrap">
      <div className="wrap">
        <section className="rq">
          <div className="rv">
            <div className="eyebrow">Request a card</div>
            <h1>
              Get your own <span className="gt">Tapwe card</span>
            </h1>
            <p className="lead">
              Tell us about your business and what you want your card to open. We will use these details to set up your
              card.
            </p>
            <ol>
              {STEPS.map(([title, text], i) => (
                <li key={title}>
                  <i>{i + 1}</i>
                  <span>
                    <b>{title}</b>
                    <span className="d">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mock">
              <CardFan />
            </div>
          </div>
          <div className="card rqc rv" style={revealDelay(0.1)} ref={box}>
            {submitted ? <Received values={submitted} onAgain={() => setSubmitted(null)} /> : <RequestForm onSent={onSent} />}
          </div>
        </section>
      </div>
    </div>
  )
}

function RequestForm({ onSent }: { onSent: (values: RequestValues) => void }) {
  const { toast } = useToast()
  const submit = useSubmitCardRequest()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestValues>({ resolver: yupResolver(requestSchema), defaultValues: EMPTY, mode: 'onSubmit', reValidateMode: 'onChange' })

  const onSubmit = (values: RequestValues) =>
    submit.mutate(
      { ...values, city: values.city || undefined, note: values.note || undefined },
      {
        onSuccess: () => {
          toast('Request received. We will be in touch soon.')
          onSent(values)
        },
        onError: (error) => toast(getErrorMessage(error), 'error'),
      },
    )

  const e = {
    name: errors.name?.message,
    biz: errors.businessName?.message,
    email: errors.email?.message,
    phone: errors.phone?.message,
    type: errors.businessType?.message,
    qty: errors.quantity?.message,
    dest: errors.destinations?.message ?? errors.destinations?.root?.message,
    ok: errors.agreed?.message,
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Your details</h2>
      <p className="hint" style={{ marginTop: -8 }}>
        Fields marked <span className="req">*</span> are required.
      </p>
      <div className="two">
        <Field id="rq-name" label="Full name" required error={e.name}>
          <Input id="rq-name" autoComplete="name" aria-required invalid={!!e.name} {...describedBy('rq-name', e.name)} {...register('name')} />
        </Field>
        <Field id="rq-biz" label="Business name" required error={e.biz}>
          <Input id="rq-biz" autoComplete="organization" aria-required invalid={!!e.biz} {...describedBy('rq-biz', e.biz)} {...register('businessName')} />
        </Field>
      </div>
      <div className="two">
        <Field id="rq-email" label="Email" required error={e.email}>
          <Input id="rq-email" type="email" autoComplete="email" placeholder="you@business.com" aria-required invalid={!!e.email} {...describedBy('rq-email', e.email)} {...register('email')} />
        </Field>
        <Field id="rq-phone" label="Phone or WhatsApp" required error={e.phone} hint="We may call or message you about this request.">
          <Input id="rq-phone" type="tel" autoComplete="tel" placeholder="10-digit mobile number" aria-required invalid={!!e.phone} {...describedBy('rq-phone', e.phone, true)} {...register('phone')} />
        </Field>
      </div>
      <div className="two">
        <Field id="rq-type" label="Business type" required error={e.type}>
          <Select id="rq-type" aria-required invalid={!!e.type} {...describedBy('rq-type', e.type)} {...register('businessType')}>
            <option value="">Select one</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field id="rq-qty" label="How many cards?" required error={e.qty}>
          <Select id="rq-qty" invalid={!!e.qty} {...register('quantity')}>
            {CARD_QUANTITIES.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </Select>
        </Field>
      </div>
      <fieldset style={{ border: 0, padding: 0 }} aria-describedby={e.dest ? 'rq-dest-e' : undefined}>
        <legend className="legend">
          What should the card open?
          <RequiredMark />
        </legend>
        <div className="pills" id="rq-dest">
          {REQUEST_DESTINATIONS.map(([label, icon]) => (
            <label key={label} className="pill">
              <input type="checkbox" value={label} {...register('destinations')} />
              <Icon name={icon} />
              {label}
            </label>
          ))}
        </div>
        <div className="hint" style={{ marginTop: 6 }}>
          Pick one or more. You can change this later.
        </div>
        <FieldError id="rq-dest-e" message={e.dest} />
      </fieldset>
      <div className="two">
        <Field id="rq-city" label="City" optional>
          <Input id="rq-city" autoComplete="address-level2" {...register('city')} />
        </Field>
        <div />
      </div>
      <Field id="rq-note" label="Anything else?" optional>
        <Textarea id="rq-note" rows={3} {...register('note')} />
      </Field>
      <div>
        <label className="chk">
          <input type="checkbox" id="rq-ok" aria-describedby={e.ok ? 'rq-ok-e' : undefined} {...register('agreed')} />
          <span>
            I agree to be contacted about this request.
            <RequiredMark />
          </span>
        </label>
        <FieldError id="rq-ok-e" message={e.ok} />
      </div>
      <Button variant="p" size="lg" type="submit" loading={submit.isPending}>
        {submit.isPending ? 'Sending' : 'Send request'}
      </Button>
    </form>
  )
}

function Received({ values, onAgain }: { values: RequestValues; onAgain: () => void }) {
  const firstName = values.name.trim().split(/\s+/)[0]
  return (
    <div className="rqok">
      <div className="big">
        <Icon name="check" />
      </div>
      <h2>Request received</h2>
      <p>Thanks, {firstName}. We will review your details and get in touch to confirm.</p>
      <dl>
        <div>
          <dt>Business</dt>
          <dd>{values.businessName.trim()}</dd>
        </div>
        <div>
          <dt>Cards</dt>
          <dd>{values.quantity}</dd>
        </div>
        <div>
          <dt>Card opens</dt>
          <dd>{values.destinations.join(', ')}</dd>
        </div>
      </dl>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
        <LinkButton variant="s" to="/">
          Back to home
        </LinkButton>
        <Button variant="p" onClick={onAgain}>
          Submit another request
        </Button>
      </div>
    </div>
  )
}
