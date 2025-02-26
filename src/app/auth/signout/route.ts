import { createServerSupabaseClient } from "@/lib/supabase-client";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
}
