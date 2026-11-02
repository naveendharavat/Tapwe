import { supabase, unwrap } from '../supabase'
import type { CreateCardRequest } from './card-requests.types'

export class CardRequestsService {
  static async submit(body: CreateCardRequest): Promise<void> {
    unwrap(
      await supabase.from('card_requests').insert({
        name: body.name.trim(),
        business_name: body.businessName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone,
        business_type: body.businessType,
        quantity: body.quantity,
        destinations: body.destinations,
        city: body.city?.trim() || null,
        note: body.note?.trim() || null,
        agreed: body.agreed,
      }),
    )
  }
}
