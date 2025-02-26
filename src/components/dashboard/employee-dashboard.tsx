"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Marquee } from "@/components/magicui/marquee";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

type Appreciation = {
  id: string;
  client_name: string;
  client_email: string;
  message: string;
  image_url: string | null;
  created_at: string;
};

type ReferralLinkCardProps = {
  referralLink: string;
  onCopy: () => void;
};

function ReferralLinkCard({ referralLink, onCopy }: ReferralLinkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Link</CardTitle>
        <CardDescription>
          Share this link with clients to let them appreciate you directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input value={referralLink} readOnly />
          <Button variant="outline" size="icon" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type AppreciationCardProps = {
  appreciation: Appreciation;
};

function AppreciationCard({ appreciation }: AppreciationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{appreciation.client_name}</CardTitle>
        <CardDescription>
          {format(new Date(appreciation.created_at), "PPP 'at' p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="italic">&ldquo;{appreciation.message}&rdquo;</p>
        <p className="text-sm text-muted-foreground">
          From: {appreciation.client_email}
        </p>
        {appreciation.image_url && (
          <div className="relative h-48 w-full rounded-md overflow-hidden">
            <Image
              src={appreciation.image_url}
              alt="Appreciation image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type AppreciationsListProps = {
  appreciations: Appreciation[];
};

function AppreciationsList({ appreciations }: AppreciationsListProps) {
  if (appreciations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            You haven&apos;t received any appreciations yet. Share your referral
            link to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Marquee className="py-4" pauseOnHover>
        {appreciations.map((appreciation) => (
          <div key={appreciation.id} className="mx-4">
            <span className="font-medium">{appreciation.client_name}</span>:{" "}
            &quot;{appreciation.message.substring(0, 50)}...&quot;
          </div>
        ))}
      </Marquee>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appreciations.map((appreciation) => (
          <AppreciationCard key={appreciation.id} appreciation={appreciation} />
        ))}
      </div>
    </div>
  );
}

export default function EmployeeDashboard({ userId }: { userId: string }) {
  const [appreciations, setAppreciations] = useState<Appreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState("");
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const fetchAppreciations = async () => {
      try {
        const { data, error } = await supabase
          .from("appreciations")
          .select("*")
          .eq("employee_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAppreciations(data || []);
      } catch (error: unknown) {
        console.error(
          "Error fetching appreciations:",
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppreciations();
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}?ref=${userId}`);
    }
  }, [userId, supabase]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied!", {
      description: "Your referral link has been copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        Loading your appreciations...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReferralLinkCard referralLink={referralLink} onCopy={copyReferralLink} />

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Appreciations</h2>
        <AppreciationsList appreciations={appreciations} />
      </div>
    </div>
  );
}
