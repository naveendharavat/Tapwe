export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalPage {
  title: string
  lead: string
  updated: string
  sections: LegalSection[]
}

export const PRIVACY_POLICY: LegalPage = {
  title: 'Privacy Policy',
  lead: 'What Tapwe collects when you use tapwe.in, why we collect it, and how to reach us about it.',
  updated: '6 November 2026',
  sections: [
    {
      heading: 'What we collect',
      paragraphs: [
        'When you request a card, we collect the details you type into the form: your name, business name, email, phone or WhatsApp number, business type, how many cards you want, what the card should open, and your city and note if you add them.',
        'When you create an account, we store your name and email. Your password is handled by our sign-in provider, Supabase, and is never visible to us. Anything you add to your digital profile, such as a business description, phone number or website, is stored with your account.',
        'When someone taps or scans one of your cards, we record that a tap happened and when, so your dashboard can show a count. We do not record who tapped.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use your request details to reply to you, confirm what you need, and set up and deliver your cards. We may contact you by phone, WhatsApp or email about your request or your cards.',
        'We use account and card data to run your dashboard and to support you. We do not sell your details, share them with advertisers, or add you to marketing lists.',
      ],
    },
    {
      heading: 'Your public card page',
      paragraphs: [
        'Anything you put on your digital profile, such as your business name, description, phone number and website, is shown to anyone who opens your card link. Only add details you are happy to make public.',
      ],
    },
    {
      heading: 'Where it is stored and for how long',
      paragraphs: [
        'Your data is stored with Supabase, the hosting and database provider for Tapwe. We keep card requests and account data for as long as we need them to provide the service.',
        'To see, correct or delete your data, call us on the numbers below. We will remove it unless we have to keep it for a legal reason.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'Tapwe does not use advertising cookies or third-party trackers. When you sign in, the site stores a sign-in token in your browser so you stay signed in.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: ['If we change this policy, we will update this page and the date at the top.'],
    },
  ],
}

export const TERMS: LegalPage = {
  title: 'Terms and Conditions',
  lead: 'The terms that apply when you request, own or use a Tapwe card.',
  updated: '6 November 2026',
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        'Tapwe supplies physical cards with an NFC chip and a QR code. Each card opens one permanent link that Tapwe manages. You tell us what the link should open, we set it up, and you can ask us to change it later from your dashboard or by calling us.',
      ],
    },
    {
      heading: 'Requests, prices and payment',
      paragraphs: [
        'A request sent through the website is not an order. We contact you to confirm the details, the number of cards and the price before anything is printed. Prices are quoted for each request, and payment terms are agreed when we confirm your order.',
      ],
    },
    {
      heading: 'What your card opens',
      paragraphs: [
        'You are responsible for the content your card opens, including your profile text, menu, forms and websites, and for having the right to share it. We may decline or disable a card that points to content that is unlawful, harmful or misleading.',
      ],
    },
    {
      heading: 'Cards and phones',
      paragraphs: [
        'The NFC tap works on phones with NFC switched on. The QR code works with any phone camera and is the fallback for phones without NFC. We cannot guarantee that every phone and case combination reads the chip.',
      ],
    },
    {
      heading: 'Your account',
      paragraphs: [
        'Keep your password private. You are responsible for activity under your account. We may suspend accounts or cards that misuse the service.',
      ],
    },
    {
      heading: 'Availability and liability',
      paragraphs: [
        'We aim to keep every card link working at all times, but we cannot promise uninterrupted service. To the extent the law allows, Tapwe is not liable for losses caused by downtime or by content that you or a third party provides.',
      ],
    },
    {
      heading: 'Changes and contact',
      paragraphs: [
        'If we change these terms, we will update this page and the date at the top. These terms are governed by the laws of India. Questions about them can be sent to the numbers below.',
      ],
    },
  ],
}
