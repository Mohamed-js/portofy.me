// app/login/page.jsx
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-4 mx-4 bg-white/10 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Login to Portofy.me
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
