import { useEffect, useMemo, useState } from 'react'
import { decorativeQrCells, QR_GRID } from './decorativeQr'
import { qrSvgMarkup } from './qrSvg'

interface QRCodePreviewProps {
  /** Encode this value as a real, scannable QR code. */
  value?: string
  /** Without a value, draw the design's decorative placeholder from this seed. */
  seed?: string
}

export function QRCodePreview({ value, seed = 'ab12cd' }: QRCodePreviewProps) {
  return value ? <RealQr value={value} /> : <DecorativeQr seed={seed} />
}

function RealQr({ value }: { value: string }) {
  const [markup, setMarkup] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    qrSvgMarkup(value).then((svg) => active && setMarkup(svg))
    return () => {
      active = false
    }
  }, [value])

  return (
    <div
      role="img"
      aria-label={`QR code for ${value}`}
      className="qr-real"
      // Generated locally by the qrcode library from the card URL.
      dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
    />
  )
}

function DecorativeQr({ seed }: { seed: string }) {
  const cells = useMemo(() => decorativeQrCells(seed), [seed])
  const N = QR_GRID
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" stroke="#1c1b22" strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  )
  return (
    <svg viewBox={`0 0 ${N} ${N}`} fill="#1c1b22" shapeRendering="crispEdges" role="img" aria-label="QR code preview (design placeholder)">
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" />
      ))}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  )
}
