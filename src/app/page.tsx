import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import AppreciationForm from "@/components/appreciation/appreciation-form";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/magicui/particles";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const supabase = await createClientSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Await searchParams before using its properties
  const { ref: referralId = "" } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Particles
            className="absolute inset-0"
            quantity={100}
            color={"#0070AD"}
            ease={100}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Image
                  src="/capgemini-logo.png"
                  alt="Capgemini Logo"
                  width={40}
                  height={40}
                />
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

              <div className="flex flex-col items-center">
                <Image
                  src="/footlocker-logo.png"
                  alt="Foot Locker Logo"
                  width={40}
                  height={40}
                />
                {/* <p className="text-xs text-muted-foreground mt-1">
                  more than sneakers.
                </p> */}
              </div>

              <div className="ml-2">
                <h1 className="text-2xl font-bold">Kudos</h1>
                <p className="text-sm text-muted-foreground">by Foot Locker</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <AppreciationForm employeeId={referralId} />
        </Suspense>
      </main>

      <footer className="py-6 border-t">
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
