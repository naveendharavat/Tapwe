interface PageHeadProps {
  eyebrow: string
  title: string
  lead: string
}

export function PageHead({ eyebrow, title, lead }: PageHeadProps) {
  return (
    <div className="pagehead">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
    </div>
  )
}
