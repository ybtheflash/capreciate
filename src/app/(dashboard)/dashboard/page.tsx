import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import EmployeeDashboard from "@/components/dashboard/employee-dashboard";
import { Particles } from "@/components/magicui/particles";
import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@/components/auth/signout-button";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not logged in, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

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
            <Link href="/" className="flex items-center space-x-4">
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
            </Link>

            <form action="/auth/signout" method="post">
              <SignOutButton />
            </form>
          </div>

          <div className="text-center max-w-3xl mx-auto my-8">
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {profile?.full_name}
            </h2>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <EmployeeDashboard userId={session.user.id} />
      </main>

      <footer className="py-6 border-t">
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
