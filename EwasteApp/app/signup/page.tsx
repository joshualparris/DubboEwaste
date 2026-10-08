import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="login-wrap">
      <section className="login-card stack">
        <div>
          <div className="badge">Staff & volunteer signup</div>
          <h1>Create account</h1>
          <p className="muted">
            Use the access code supplied by your E-waste, Library of Things or Repair Café coordinator. New accounts receive volunteer access to that programme only.
          </p>
        </div>

        {error ? <div className="error">{error}</div> : null}

        <form action={signup} className="form">
          <label>
            Name
            <input name="full_name" type="text" autoComplete="name" required maxLength={120} />
          </label>

          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            Password
            <input name="password" type="password" autoComplete="new-password" minLength={10} required />
          </label>

          <label>
            Confirm password
            <input name="confirm_password" type="password" autoComplete="new-password" minLength={10} required />
          </label>

          <label>
            Access code
            <input
              name="access_code"
              type="password"
              autoComplete="off"
              required
              spellCheck={false}
              aria-describedby="access-help"
            />
          </label>
          <p id="access-help" className="muted small">
            Ask the DubboEwaste administrator for the current access code.
          </p>

          <button className="button" type="submit">Create account</button>
        </form>

        <p className="muted small">
          Already have an account? <Link href="/login"><strong>Sign in</strong></Link>.
        </p>
      </section>
    </main>
  );
}
