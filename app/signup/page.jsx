// app/signup/page.js
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen mt-24">
      <SignupForm />
    </div>
  );
}
