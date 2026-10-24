export interface CreateCardRequest {
  name: string
  businessName: string
  email: string
  phone: string
  businessType: string
  quantity: string
  destinations: string[]
  city?: string
  note?: string
  agreed: boolean
}
