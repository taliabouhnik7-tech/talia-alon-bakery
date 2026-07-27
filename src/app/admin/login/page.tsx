import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">כניסת מנהל</h1>
        <p className="text-sm text-gray-500 mb-4">
          התחברות למערכת הניהול של הקונדיטוריה
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
