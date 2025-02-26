// components/auth/sign-out-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
}
