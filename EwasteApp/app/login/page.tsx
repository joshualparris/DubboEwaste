import Link from "next/link";
import { login } from "./actions";

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
          <h1>DubboEwaste</h1>
          <p className="muted">Sign in to intake, inventory and chain-of-custody operations.</p>
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

        <p className="muted small">
          New staff or volunteers can <Link href="/signup"><strong>create an account</strong></Link> with the current access code.
        </p>
      </section>
    </main>
  );
}
