"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockSignup } from "@/lib/mockAuthApi";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    const result = await mockSignup(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="text-center text-sm text-gray-600">Create a new account</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                ref={emailRef}
                placeholder="Enter your email"
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                placeholder="Enter your password"
                className="pl-10 pr-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
