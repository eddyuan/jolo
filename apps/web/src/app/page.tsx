import Link from 'next/link'

export default function Home() {
  return (
    <main className="container">
      <h1>Jolo</h1>
      <p className="muted">
        Your job search agent: a tailored resume for every role, applications you approve, and
        every reply tracked in one place.
      </p>
      <Link href="/dashboard" className="btn btn-primary">
        Get started
      </Link>
    </main>
  )
}
