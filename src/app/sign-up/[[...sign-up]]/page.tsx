import React, { Suspense } from "react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Icons } from "@/components/ui/Icons";

export const instant = false;

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8">
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-600/30">
            <Icons.Play size={20} className="translate-x-0.5 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Safe<span className="text-red-500">Stream</span>
          </span>
        </Link>
        <p className="text-xs text-zinc-400">
          Create your Nexora account with secure Clerk authentication.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-zinc-900" />}>
          <SignUp
          routing="path"
          path="/sign-up"
          forceRedirectUrl="/onboarding"
          signInForceRedirectUrl="/onboarding"
          rememberMe={true}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-3xl p-6 sm:p-8",
              headerTitle: "text-xl font-bold text-white",
              headerSubtitle: "text-xs text-zinc-400",
              socialButtonsBlockButton: "bg-zinc-950 border border-zinc-700 text-white hover:bg-zinc-800 transition rounded-xl",
              socialButtonsBlockButtonText: "text-xs font-semibold text-zinc-200",
              dividerLine: "bg-zinc-800",
              dividerText: "text-zinc-500 text-xs",
              formFieldLabel: "text-xs font-semibold text-zinc-300",
              formFieldInput: "bg-zinc-950 border-zinc-700 text-white rounded-xl focus:border-red-500 text-sm",
              formButtonPrimary: "bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs py-3 shadow-lg shadow-red-600/30 transition",
              footerActionLink: "text-red-400 hover:text-red-300 font-semibold",
              footerActionText: "text-zinc-400 text-xs",
              formFieldCheckbox: "text-red-400",
              formFieldCheckboxLabel: "text-xs text-zinc-300",
            },
            variables: {
              colorPrimary: "#dc2626",
              colorBackground: "#09090b",
              colorInputBackground: "#18181b",
              colorInputText: "#f4f4f5",
            },
          }}
          />
        </Suspense>
      </div>

      <div className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-red-400 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
