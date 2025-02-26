import { redirect, notFound } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import SignupForm from "@/app/(auth)/signup-form";
import { Particles } from "@/components/magicui/particles";
import Link from "next/link";
import Image from "next/image";

// This is a secret key that should be stored in environment variables
const SIGNUP_SECRET = process.env.SIGNUP_SECRET;

export default async function SignupPage({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const supabase = await createClientSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Await params before using its properties
  const { secret } = await params;

  // Verify the secret key
  if (secret !== SIGNUP_SECRET) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <Particles
          className="absolute inset-0"
          quantity={100}
          color={"#0070AD"}
          ease={100}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        <Link href="/" className="flex items-center space-x-2 mb-12">
          <Image
            src="/capgemini-logo.png"
            alt="Capgemini Logo"
            width={40}
            height={40}
          />
          <div>
            <h1 className="text-2xl font-bold">Kudos</h1>
            <p className="text-sm text-muted-foreground">
              Appreciate Footlocker Excellence
            </p>
          </div>
        </Link>

        <SignupForm />
      </div>

      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Crafted with care by{" "}
            <a
              href="https://www.linkedin.com/in/princebiswas"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              Prince Biswas
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
