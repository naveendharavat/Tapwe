import { useSearchParams } from 'react-router'
import { QRCodePreview } from '../../../components/cards/QRCodePreview'
import { downloadQrSvg } from '../../../components/cards/downloadQr'
import { PageTitle } from '../../../components/dashboard/PageTitle'
import { useCopyCardUrl } from '../../../components/dashboard/useCopyCardUrl'
import { useToast } from '../../../components/toast/toast-context'
import { Box, Button, Card, EmptyState, Icon, LinkButton, Select, Skeleton, Stack, Typography } from '../../../components/ui'
import { useCards } from '../../../services/cards/cards.queries'
import type { Card as UserCard } from '../../../services/cards/cards.types'

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
      <Card size="md">
        <Box className="field qr-select">
          <label htmlFor="qsel">Card</label>
          <Select id="qsel" value={selected.code} onChange={(e) => setParams({ card: e.target.value })}>
            {cards.data.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </Box>
        <CardQr card={selected} />
      </Card>
    )
  }

  return (
    <>
      <PageTitle title="QR Code" description="Download or copy the link for any card." />
      {renderBody()}
    </>
  )
}

function CardQr({ card }: { card: UserCard }) {
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
    <Box className="qrbox">
      <Box className="q">
        <QRCodePreview value={card.url} />
      </Box>
      <Box className="qr-info">
        <b className="card-label">Permanent card URL</b>
        <Box className="url">{card.url}</Box>
        <Stack direction="row" gap={2} wrap className="qr-actions">
          <Button size="sm" onClick={() => void copyUrl(card.url)}>
            <Icon name="copy" />
            Copy URL
          </Button>
          <Button size="sm" onClick={() => void download()}>
            <Icon name="dl" />
            Download QR (SVG)
          </Button>
        </Stack>
        <Typography variant="hint" className="qr-hint">
          The NFC chip and this QR code open the same link. SVG stays sharp at any print size.
        </Typography>
      </Box>
    </Box>
  )
}
