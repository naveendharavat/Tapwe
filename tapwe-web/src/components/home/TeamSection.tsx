import { TEAM } from '../../content/team'
import { initials } from '../../lib/initials'

export function TeamGrid() {
  return (
    <div className="team">
      {TEAM.map((member) => (
        <article key={member.name} className="card person rv">
          <div className="av" aria-hidden="true">
            {initials(member.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3>{member.name}</h3>
            <div className="role">{member.role}</div>
            <p>{member.bio}</p>
          </div>
        </article>
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
        </div>
        <TeamGrid />
      </div>
    </section>
  )
}
