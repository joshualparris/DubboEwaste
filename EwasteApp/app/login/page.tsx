import Link from "next/link";
import { login, resendConfirmation } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main className="login-wrap">
      <section className="login-card stack">
        <div>
          <div className="badge">Private staff system</div>
          <h1>Dubbo community programmes</h1>
          <p className="muted">One login for Circular Learning, E-waste, Library of Things and Repair Café staff and volunteers. Your membership determines which items and sections you can access.</p>
        </div>

        {error ? <div className="error">{error}</div> : null}
        {message ? <div className="success">{message}</div> : null}

        <form action={login} className="form">
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="button" type="submit">Sign in</button>
        </form>

        <details>
          <summary><strong>Didn't get a working confirmation email?</strong></summary>
          <form action={resendConfirmation} className="form" style={{ marginTop: "0.75rem" }}>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <button className="button secondary" type="submit">Resend confirmation email</button>
          </form>
        </details>

        <p className="muted small">
          New staff or volunteers can <Link href="/signup"><strong>create an account</strong></Link> with the current access code.
        </p>
      </section>
    </main>
  );
}
