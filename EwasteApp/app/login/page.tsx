import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="login-wrap">
      <section className="login-card stack">
        <div>
          <div className="badge">Private staff system</div>
          <h1>DubboEwaste</h1>
          <p className="muted">Sign in to intake, inventory and chain-of-custody operations.</p>
        </div>

        {error ? <div className="error">{error}</div> : null}

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
          Accounts are created by an administrator. There is no public sign-up.
        </p>
      </section>
    </main>
  );
}
