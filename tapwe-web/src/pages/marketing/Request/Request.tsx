import { yupResolver } from '@hookform/resolvers/yup'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardFan } from '../../../components/cards/SmartCardPreview'
import { useToast } from '../../../components/toast/toast-context'
import {
  Box,
  Button,
  Card,
  Container,
  describedBy,
  Field,
  FieldError,
  FieldRow,
  Icon,
  Input,
  LinkButton,
  RequiredMark,
  Select,
  Stack,
  Textarea,
  Typography,
} from '../../../components/ui'
import { useReveal } from '../../../hooks/useReveal'
import { revealDelay } from '../../../lib/cssVars'
import { BUSINESS_TYPES, CARD_QUANTITIES, REQUEST_DESTINATIONS } from '../../../lib/options'
import { requestSchema, type RequestValues } from '../../../lib/validation'
import { getErrorMessage } from '../../../services/api'
import { useSubmitCardRequest } from '../../../services/card-requests/card-requests.queries'

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
  const box = useRef<HTMLElement>(null)

  const onSent = (values: RequestValues) => {
    setSubmitted(values)
    box.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Box className="hero-wrap">
      <Container>
        <section className="rq">
          <Box className="rv">
            <Typography variant="eyebrow">Request a card</Typography>
            <h1>
              Get your own <span className="gt">Tapwe card</span>
            </h1>
            <Typography variant="lead">
              Tell us about your business and what you want your card to open. We will use these details to set up your
              card.
            </Typography>
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
            <Box className="mock">
              <CardFan />
            </Box>
          </Box>
          <Card size="lg" className="rqc rv" style={revealDelay(0.1)} ref={box}>
            {submitted ? <Received values={submitted} onAgain={() => setSubmitted(null)} /> : <RequestForm onSent={onSent} />}
          </Card>
        </section>
      </Container>
    </Box>
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
      <Typography variant="hint" className="form-intro">
        Fields marked <span className="req">*</span> are required.
      </Typography>
      <FieldRow>
        <Field id="rq-name" label="Full name" required error={e.name}>
          <Input id="rq-name" autoComplete="name" aria-required invalid={!!e.name} {...describedBy('rq-name', e.name)} {...register('name')} />
        </Field>
        <Field id="rq-biz" label="Business name" required error={e.biz}>
          <Input id="rq-biz" autoComplete="organization" aria-required invalid={!!e.biz} {...describedBy('rq-biz', e.biz)} {...register('businessName')} />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field id="rq-email" label="Email" required error={e.email}>
          <Input id="rq-email" type="email" autoComplete="email" placeholder="you@business.com" aria-required invalid={!!e.email} {...describedBy('rq-email', e.email)} {...register('email')} />
        </Field>
        <Field id="rq-phone" label="Phone or WhatsApp" required error={e.phone} hint="We may call or message you about this request.">
          <Input id="rq-phone" type="tel" autoComplete="tel" placeholder="10-digit mobile number" aria-required invalid={!!e.phone} {...describedBy('rq-phone', e.phone, true)} {...register('phone')} />
        </Field>
      </FieldRow>
      <FieldRow>
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
      </FieldRow>
      <fieldset className="fieldset" aria-describedby={e.dest ? 'rq-dest-e' : undefined}>
        <legend className="legend">
          What should the card open?
          <RequiredMark />
        </legend>
        <Box className="pills" id="rq-dest">
          {REQUEST_DESTINATIONS.map(([label, icon]) => (
            <label key={label} className="pill">
              <input type="checkbox" value={label} {...register('destinations')} />
              <Icon name={icon} />
              {label}
            </label>
          ))}
        </Box>
        <Typography variant="hint" className="pills-hint">
          Pick one or more. You can change this later.
        </Typography>
        <FieldError id="rq-dest-e" message={e.dest} />
      </fieldset>
      <FieldRow>
        <Field id="rq-city" label="City" optional>
          <Input id="rq-city" autoComplete="address-level2" {...register('city')} />
        </Field>
      </FieldRow>
      <Field id="rq-note" label="Anything else?" optional>
        <Textarea id="rq-note" rows={3} {...register('note')} />
      </Field>
      <Box>
        <label className="chk">
          <input type="checkbox" id="rq-ok" aria-describedby={e.ok ? 'rq-ok-e' : undefined} {...register('agreed')} />
          <span>
            I agree to be contacted about this request.
            <RequiredMark />
          </span>
        </label>
        <FieldError id="rq-ok-e" message={e.ok} />
      </Box>
      <Button variant="p" size="lg" type="submit" loading={submit.isPending}>
        {submit.isPending ? 'Sending' : 'Send request'}
      </Button>
    </form>
  )
}

function Received({ values, onAgain }: { values: RequestValues; onAgain: () => void }) {
  const firstName = values.name.trim().split(/\s+/)[0]
  return (
    <Box className="rqok">
      <Box className="big">
        <Icon name="check" />
      </Box>
      <h2>Request received</h2>
      <p>Thanks, {firstName}. We will review your details and get in touch to confirm.</p>
      <dl>
        <Box>
          <dt>Business</dt>
          <dd>{values.businessName.trim()}</dd>
        </Box>
        <Box>
          <dt>Cards</dt>
          <dd>{values.quantity}</dd>
        </Box>
        <Box>
          <dt>Card opens</dt>
          <dd>{values.destinations.join(', ')}</dd>
        </Box>
      </dl>
      <Stack direction="row" gap={3} justify="center" wrap className="rqok-actions">
        <LinkButton variant="s" to="/">
          Back to home
        </LinkButton>
        <Button variant="p" onClick={onAgain}>
          Submit another request
        </Button>
      </Stack>
    </Box>
  )
}
