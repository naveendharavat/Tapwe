import { TEAM, type TeamMember } from '../../content/team'
import { initials } from '../../lib/initials'
import { revealDelay } from '../../lib/cssVars'

const TEAM_LEAD = 'A small team helping businesses turn every in-person visit into a lasting connection.'

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article className="tmc rv" style={revealDelay(index * 0.1)}>
      <div className="tmb" aria-hidden="true">
        <span className="tmr">{member.role}</span>
      </div>
      <div className="tma" style={member.photo ? { backgroundImage: `url('${member.photo}')` } : undefined}>
        {!member.photo && <span aria-hidden="true">{initials(member.name)}</span>}
      </div>
      <div className="tmx">
        <h3>{member.name}</h3>
        <div className="role">{member.role}, Tapwe</div>
        <p>{member.bio}</p>
        <ul className="tmt" aria-label="Focus areas">
          {member.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function TeamGrid() {
  return (
    <div className="tmg">
      {TEAM.map((member, i) => (
        <TeamCard key={member.name} member={member} index={i} />
      ))}
    </div>
  )
}

export function TeamSection() {
  return (
    <section className="s" id="team">
      <div className="wrap">
        <div className="sh rv">
          <div className="eyebrow">Team</div>
          <h2>The people behind Tapwe</h2>
          <p>{TEAM_LEAD}</p>
        </div>
        <h3 className="tm-group rv">Founders</h3>
        <TeamGrid />
      </div>
    </section>
  )
}
