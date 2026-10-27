export interface TeamMember {
  name: string
  role: string
  bio: string
  tags: string[]
  /** Photo URL; the avatar shows initials when it is empty. */
  photo?: string
}

export const TEAM: TeamMember[] = [
  {
    name: 'Dharavath Naveen',
    role: 'Founder',
    bio: 'Leads product and vision, shaping how Tapwe cards connect businesses to the digital world.',
    tags: ['Product', 'Vision'],
  },
  {
    name: 'Seelam Vamshidhar Goud',
    role: 'Founder',
    bio: 'Leads operations and partnerships, bringing Tapwe to restaurants, shops and professionals.',
    tags: ['Operations', 'Partnerships'],
  },
]
