import { useSearchParams } from 'react-router'
import { QRCodePreview } from '../../components/cards/QRCodePreview'
import { downloadQrSvg } from '../../components/cards/downloadQr'
import { PageTitle } from '../../components/dashboard/PageTitle'
import { useCopyCardUrl } from '../../components/dashboard/useCopyCardUrl'
import { useToast } from '../../components/toast/toast-context'
import { Button, LinkButton } from '../../components/ui/Button'
import { EmptyState, Skeleton } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { Select } from '../../components/ui/Input'
import { useCards } from '../../services/cards/cards.queries'
import type { Card } from '../../services/cards/cards.types'

export default function QrCode() {
  const cards = useCards()
  const [params, setParams] = useSearchParams()

  const renderBody = () => {
    if (cards.isPending) return <Skeleton label="Loading cards" />
    if (cards.isError) return <EmptyState icon="alert" title="We couldn’t load your cards" description="Check your connection and try again." />
    if (!cards.data.length) {
      return (
        <EmptyState
          icon="qr"
          title="No cards yet"
          description="Request a card and we will set up its QR code."
          actions={
            <LinkButton variant="p" to="/app/create">
              Request a Card
            </LinkButton>
          }
        />
      )
    }
    const selected = cards.data.find((c) => c.code === params.get('card')) ?? cards.data[0]
    return (
      <div className="card" style={{ padding: 24 }}>
        <div className="field" style={{ maxWidth: 320, marginBottom: 24 }}>
          <label htmlFor="qsel">Card</label>
          <Select id="qsel" value={selected.code} onChange={(e) => setParams({ card: e.target.value })}>
            {cards.data.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <CardQr card={selected} />
      </div>
    )
  }

  return (
    <>
      <PageTitle title="QR Code" description="Download or copy the link for any card." />
      {renderBody()}
    </>
  )
}

function CardQr({ card }: { card: Card }) {
  const { toast } = useToast()
  const copyUrl = useCopyCardUrl()

  const download = async () => {
    try {
      await downloadQrSvg(card.url, card.code)
      toast('QR code downloaded as SVG.')
    } catch {
      toast('Could not create the QR code. Please try again.', 'error')
    }
  }

  return (
    <div className="qrbox">
      <div className="q">
        <QRCodePreview value={card.url} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <b style={{ fontSize: 14, fontWeight: 500 }}>Permanent card URL</b>
        <div className="url">{card.url}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <Button size="sm" onClick={() => void copyUrl(card.url)}>
            <Icon name="copy" />
            Copy URL
          </Button>
          <Button size="sm" onClick={() => void download()}>
            <Icon name="dl" />
            Download QR (SVG)
          </Button>
        </div>
        <p className="hint" style={{ fontSize: 12, marginTop: 12 }}>
          The NFC chip and this QR code open the same link. SVG stays sharp at any print size.
        </p>
      </div>
    </div>
  )
}
