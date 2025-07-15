// app/protected/institutions/[id]/departments/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PageProps {
  params: { id: string };
}

interface Institution {
  id: string;
  name: string;
  status: string;
}

export default function NewDepartmentPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_nepali: "",
    description: ""
  });

  useEffect(() => {
    const fetchInstitution = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Get institution details
      const { data: institutionData } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', params.id)
        .eq('created_by', user.id)
        .single();
      
      if (institutionData) {
        setInstitution(institutionData);
        if (institutionData.status !== 'approved') {
          router.push(`/protected/institutions/${params.id}`);
        }
      } else {
        router.push('/protected/institutions');
      }
    };

    fetchInstitution();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('departments')
        .insert([
          {
            institution_id: params.id,
            name: formData.name,
            name_nepali: formData.name_nepali,
            description: formData.description
          }
        ]);

      if (error) throw error;

      router.push(`/protected/institutions/${params.id}/departments`);
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!institution) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Department</h1>
        <p className="text-muted-foreground">
          Create a new department for {institution.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>
            Fill in the information about the new department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Citizenship Department"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_nepali">Department Name (Nepali)</Label>
              <Input
                id="name_nepali"
                value={formData.name_nepali}
                onChange={(e) => handleChange('name_nepali', e.target.value)}
                placeholder="e.g., नागरिकता शाखा"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Brief description of what this department handles"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={loading || !formData.name}
              >
                {loading ? "Creating..." : "Create Department"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}