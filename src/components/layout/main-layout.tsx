"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/magicui/particles";
import { Sun, Moon, LogOut } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Particles
            className="absolute inset-0"
            quantity={100}
            color={theme === "dark" ? "#0070AD" : "#12ABDB"}
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
                <p className="text-xs text-muted-foreground mt-1">
                  more than sneakers.
                </p>
              </div>

              <div className="ml-2">
                <h1 className="text-2xl font-bold">Capreciate</h1>
                <p className="text-sm text-muted-foreground">
                  Appreciate Capgemini Excellence
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

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
