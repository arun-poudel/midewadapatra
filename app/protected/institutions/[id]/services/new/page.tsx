// app/protected/institutions/[id]/services/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageProps {
  params: { id: string };
}

interface Category {
  id: string;
  name: string;
}

interface Institution {
  id: string;
  name: string;
  status: string;
}

export default function NewServicePage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    requirements: "",
    process: "",
    timeline: "",
    fees: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Get categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Get institution details
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('services')
        .insert([
          {
            ...formData,
            institution_id: params.id
          }
        ]);

      if (error) throw error;

      router.push(`/protected/institutions/${params.id}`);
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error creating service. Please try again.');
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Service</h1>
        <p className="text-muted-foreground">
          Create a new service for {institution.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Fill in the information about the service you want to offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Citizenship Certificate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => handleChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of the service"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Required Documents</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                placeholder="List all required documents (one per line)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="process">Process Steps</Label>
              <Textarea
                id="process"
                value={formData.process}
                onChange={(e) => handleChange('process', e.target.value)}
                placeholder="Describe the step-by-step process"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Processing Time</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleChange('timeline', e.target.value)}
                  placeholder="e.g., 5-7 working days"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees">Service Fees</Label>
                <Input
                  id="fees"
                  value={formData.fees}
                  onChange={(e) => handleChange('fees', e.target.value)}
                  placeholder="e.g., Rs. 500 or Free"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.category_id}
              >
                {loading ? "Creating..." : "Create Service"}
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