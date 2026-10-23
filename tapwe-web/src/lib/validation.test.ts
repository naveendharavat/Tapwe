import { firstErrors, requestSchema, signUpSchema } from './validation'

const validRequest = {
  name: 'Asha Rao',
  businessName: 'Blue Tokai Café',
  email: 'asha@cafe.in',
  phone: '+91 98765 43210',
  businessType: 'Restaurant or café',
  quantity: '1',
  destinations: ['Menu'],
  city: '',
  note: '',
  agreed: true,
}

describe('requestSchema', () => {
  it('rejects a short phone with the design copy', () => {
    expect(firstErrors(requestSchema, { ...validRequest, phone: '12345' })).toEqual({
      phone: 'Enter a valid 10-digit mobile number.',
    })
  })

  it('accepts a +91 number with spaces and normalizes it', () => {
    expect(firstErrors(requestSchema, validRequest)).toEqual({})
    expect(requestSchema.cast(validRequest).phone).toBe('9876543210')
  })

  it('reports every missing field at once, in design copy', () => {
    const errors = firstErrors(requestSchema, {
      ...validRequest,
      name: ' ',
      email: '',
      businessType: '',
      destinations: [],
      agreed: false,
    })
    expect(errors).toEqual({
      name: 'Enter your name.',
      email: 'Enter your email address.',
      businessType: 'Choose your business type.',
      destinations: 'Choose at least one option.',
      agreed: 'Please confirm to continue.',
    })
  })
})

describe('signUpSchema', () => {
  it('rejects a 7-character password', () => {
    expect(firstErrors(signUpSchema, { name: 'A', email: 'a@b.in', password: '1234567' })).toEqual({
      password: 'Use at least 8 characters.',
    })
  })
})
