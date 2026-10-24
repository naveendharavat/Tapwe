import { qrSvgMarkup } from './qrSvg'

/** Saves the card's QR code as a print-ready SVG file. */
export async function downloadQrSvg(url: string, code: string): Promise<void> {
  const blob = new Blob([await qrSvgMarkup(url)], { type: 'image/svg+xml' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `tapwe-${code}.svg`
  link.click()
  URL.revokeObjectURL(link.href)
}
