const SHORT_DATE = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

/** "24 Oct 2026" */
export const shortDate = (iso: string) => SHORT_DATE.format(new Date(iso))
