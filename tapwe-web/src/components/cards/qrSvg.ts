import QRCode from 'qrcode'

/** SVG markup for a scannable QR code (rendered on screen and used for downloads). */
export function qrSvgMarkup(value: string): Promise<string> {
  return QRCode.toString(value, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1c1b22', light: '#ffffff' } })
}
