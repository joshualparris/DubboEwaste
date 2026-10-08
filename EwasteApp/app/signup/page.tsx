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
          <div className="badge">DubboEwaste & Repair Café volunteers</div>
          <h1>Create account</h1>
          <p className="muted">
            Enter the access code you were given. The code automatically puts your account in the correct volunteer area.
            You do not need to choose a team yourself.
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
            Volunteer access code
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
            Use the DubboEwaste code or Repair Café code supplied by the coordinator. The two codes grant different access.
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
