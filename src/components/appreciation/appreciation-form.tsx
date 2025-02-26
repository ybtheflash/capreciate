"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Employee = {
  id: string;
  email: string;
  full_name: string;
};

export default function AppreciationForm({ employeeId = "" }) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, email, full_name");

        if (error) throw error;
        setEmployees(data || []);

        // If employeeId is provided (from referral link), set the selected employee
        if (employeeId) {
          const employee = data?.find((emp) => emp.id === employeeId);
          if (employee) {
            setSelectedEmployee(employee);
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error fetching employees:", errorMessage);
      }
    };

    fetchEmployees();
  }, [employeeId, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        toast.error("File too large", {
          description: "Please select an image under 1MB",
        });
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Error", {
        description: "Please select an employee to appreciate",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `appreciation-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("appreciation-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("appreciation-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Submit appreciation
      const { error } = await supabase.from("appreciations").insert({
        employee_id: selectedEmployee.id,
        client_name: clientName,
        client_email: clientEmail,
        message,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Appreciation sent!", {
        description: `Your appreciation for ${selectedEmployee.full_name} has been submitted.`,
      });

      // Reset form
      setClientName("");
      setClientEmail("");
      setMessage("");
      setImage(null);
    } catch (error: unknown) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Appreciate a Capgemini Employee</CardTitle>
        <CardDescription>
          Let them know how they&apos;ve made a difference!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  id="employee"
                  placeholder="Search for an employee by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  {filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setSearchTerm(emp.full_name);
                      }}
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      {emp.full_name} ({emp.email})
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Your Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Your Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Appreciation Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              rows={5}
              required
              placeholder="Share how this employee made a difference..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Attach an Image (optional, max 1MB)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Appreciation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
