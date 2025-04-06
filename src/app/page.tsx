"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { login } from "./store/userSlice";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const errormessage = (message: string) => {
    if (errorRef.current) {
      errorRef.current.innerText = message;
      errorRef.current.style.display = "block";
    }
  };

  const hideerror = () => {
    if (errorRef.current) {
      errorRef.current.innerText = "";
      errorRef.current.style.display = "none";
    }
  };
  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      errormessage("email and password is required");
      return;
    }
    hideerror();

    dispatch(login({ email, password }));
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
        <span ref={errorRef} className="none text-red-700 font-semibold text-sm mb-1.5"></span>
        <input
          type="email"
          placeholder="email"
          className="w-full border p-2 mb-4 rounded"
          ref={emailRef}
        />
        <input
          type="password"
          placeholder="password"
          className="w-full border p-2 mb-4 rounded"
          ref={passwordRef}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={handleLogin}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
