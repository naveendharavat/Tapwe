import { CtaBand } from '../components/home/CtaBand'
import { TeamGrid } from '../components/home/TeamSection'
import { PageHead } from '../components/layout/PageHead'
import { useReveal } from '../hooks/useReveal'

export default function Team() {
  useReveal()
  return (
    <>
      <PageHead
        eyebrow="Team"
        title="The people behind Tapwe"
        lead="A small team helping businesses turn every in-person visit into a lasting connection."
      />
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <TeamGrid />
      </div>
      <CtaBand />
    </>
  )
}
