import { login } from "@/app/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--field)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "22rem" }}>
        <p className="ewb-eyebrow" style={{ color: "var(--gold)" }}>
          Officer access
        </p>
        <h1
          className="ewb-display"
          style={{ color: "var(--chalk)", fontSize: "2rem", marginTop: "0.5rem" }}
        >
          EWB-UVM Admin
        </h1>
        <form
          action={login}
          className="ewb-form"
          style={{ marginTop: "1.5rem", maxWidth: "none" }}
        >
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="ewb-input"
          />
          <button type="submit" className="ewb-btn ewb-btn-gold">
            Log in
          </button>
          {error && (
            <p className="ewb-note" style={{ color: "var(--gold)" }}>
              Wrong password.
            </p>
          )}
        </form>
        <p
          className="ewb-note"
          style={{ color: "var(--chalk-soft)", marginTop: "1.25rem" }}
        >
          For chapter officers maintaining the site. Ask the current webmaster
          for the password.
        </p>
      </div>
    </div>
  );
}
