import { redirect } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import LoginForm from "@/app/(auth)/login-form";
import { Particles } from "@/components/magicui/particles";
import Link from "next/link";
import Image from "next/image";

export default async function LoginPage() {
  const supabase = await createClientSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
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
        <Link href="/" className="flex items-center space-x-4 mb-12">
          <div className="flex items-center">
            <Image
              src="/capgemini-logo.png"
              alt="Capgemini Logo"
              width={40}
              height={40}
            />
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          <div className="flex items-center">
            <Image
              src="/footlocker-logo.png"
              alt="Foot Locker Logo"
              width={40}
              height={40}
            />
          </div>

          <div className="ml-2">
            <h1 className="text-2xl font-bold">Capreciate</h1>
            <p className="text-sm text-muted-foreground">
              Appreciate Capgemini Excellence
            </p>
          </div>
        </Link>

        <LoginForm />
      </div>

      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Crafted with care by{" "}
            <a
              href="https://www.linkedin.com/in/prince-biswas-"
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
