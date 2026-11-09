import { TEAM, type TeamMember } from '../../content/team'
import { revealDelay } from '../../lib/cssVars'
import { initials } from '../../lib/initials'
import { Box, Card, Section, SectionHeader } from '../ui'

const TEAM_LEAD = 'A small team helping businesses turn every in-person visit into a lasting connection.'

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Card as="article" className="tmc rv" style={revealDelay(index * 0.1)}>
      <Box className="tmb" aria-hidden="true">
        <span className="tmr">{member.role}</span>
      </Box>
      <Box className="tma" style={member.photo ? { backgroundImage: `url('${member.photo}')` } : undefined}>
        {!member.photo && <span aria-hidden="true">{initials(member.name)}</span>}
      </Box>
      <Box className="tmx">
        <h3>{member.name}</h3>
        <Box className="role">{member.role}, Tapwe</Box>
        <p>{member.bio}</p>
        <ul className="tmt" aria-label="Focus areas">
          {member.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </Box>
    </Card>
  )
}

export function TeamSection() {
  return (
    <Section id="team">
      <SectionHeader eyebrow="Team" title="The people behind Tapwe" lead={TEAM_LEAD} />
      <h3 className="tm-group rv">Founders</h3>
      <Box className="tmg">
        {TEAM.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </Box>
    </Section>
  )
}
