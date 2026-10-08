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
          <div className="badge">Volunteer & staff portal</div>
          <h1>Dubbo Circular Learning & volunteer portals</h1>
          <p className="muted">
            One account for the learning hub, DubboEwaste, Repair Café and Library of Things access you have been granted.
          </p>
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
          New volunteers and Library of Things team members can{" "}
          <Link href="/signup"><strong>create an account</strong></Link> using the access code supplied for their team.
        </p>
      </section>
    </main>
  );
}
