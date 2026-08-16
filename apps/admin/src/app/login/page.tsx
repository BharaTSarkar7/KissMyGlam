import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-medium text-ink mb-2">
            Kiss<span className="text-[#fd5f88]">My</span>Glam
          </h1>
          <p className="text-ink-soft text-sm uppercase tracking-widest font-medium">
            Admin Panel
          </p>
        </div>

        <div className="bg-white p-8 rounded-[24px] shadow-lg border border-line/50">
          <h2 className="font-serif text-2xl font-medium text-ink mb-6 text-center">
            Sign In
          </h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-ink-soft/60 mt-8">
          This area is restricted to authorized administrators.
        </p>
      </div>
    </main>
  );
}
