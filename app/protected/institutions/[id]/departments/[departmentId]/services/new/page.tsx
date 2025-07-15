// app/protected/institutions/[id]/departments/[departmentId]/services/new/page.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

interface PageProps {
  params: { id: string; departmentId: string };
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

interface Department {
  id: string;
  name: string;
  name_nepali: string;
}

export default function NewServicePage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    documents: [] as string[],
    request_process: [] as string[],
    duration: {
      processing_time: "",
      office_hours: "",
      availability: ""
    },
    cost: {
      service_fee: "",
      additional_charges: "",
      payment_method: ""
    }
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

      // Get institution and department details
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
            return;
          }
        }

        const { data: departmentData } = await supabase
          .from('departments')
          .select('*')
          .eq('id', params.departmentId)
          .eq('institution_id', params.id)
          .single();
        
        if (departmentData) {
          setDepartment(departmentData);
        } else {
          router.push(`/protected/institutions/${params.id}/departments`);
        }
      }
    };

    fetchData();
  }, [params.id, params.departmentId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('services')
        .insert([
          {
            institution_id: params.id,
            department: department?.name,
            name: formData.name,
            description: formData.description,
            category_id: formData.category_id,
            documents: formData.documents,
            request_process: formData.request_process,
            duration: formData.duration,
            cost: formData.cost
          }
        ]);

      if (error) throw error;

      router.push(`/protected/institutions/${params.id}/departments/${params.departmentId}/services`);
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error creating service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: 'documents' | 'request_process', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeItem = (field: 'documents' | 'request_process', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateDuration = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      duration: {
        ...prev.duration,
        [field]: value
      }
    }));
  };

  const updateCost = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      cost: {
        ...prev.cost,
        [field]: value
      }
    }));
  };

  if (!institution || !department) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Service</h1>
        <p className="text-muted-foreground">
          Create a new service for {department.name} ({department.name_nepali}) - {institution.name}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., नागरिकता प्रमाणपत्र"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Details - 4 Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Fill in the detailed information for each category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="documents">कागजातहरु</TabsTrigger>
                  <TabsTrigger value="request">निवेदन</TabsTrigger>
                  <TabsTrigger value="duration">लाग्ने समय</TabsTrigger>
                  <TabsTrigger value="cost">लाग्ने शुल्क</TabsTrigger>
                </TabsList>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Documents (कागजातहरु)</h4>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter required document"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('documents', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addItem('documents', input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1">
                        {formData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{doc}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem('documents', index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Request Process Tab */}
                <TabsContent value="request" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Request Process (निवेदन)</h4>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter process step"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('request_process', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addItem('request_process', input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1">
                        {formData.request_process.map((step, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{step}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem('request_process', index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Duration Tab */}
                <TabsContent value="duration" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Time Duration (लाग्ने समय)</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Processing Time</Label>
                        <Input
                          placeholder="e.g., 5-7 working days"
                          value={formData.duration.processing_time}
                          onChange={(e) => updateDuration('processing_time', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Office Hours</Label>
                        <Input
                          placeholder="e.g., 10:00 AM - 4:00 PM"
                          value={formData.duration.office_hours}
                          onChange={(e) => updateDuration('office_hours', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <Input
                          placeholder="e.g., Sunday to Friday"
                          value={formData.duration.availability}
                          onChange={(e) => updateDuration('availability', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Cost Tab */}
                <TabsContent value="cost" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Service Cost (लाग्ने शुल्क)</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Service Fee</Label>
                        <Input
                          placeholder="e.g., Rs. 100 or Free"
                          value={formData.cost.service_fee}
                          onChange={(e) => updateCost('service_fee', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Additional Charges</Label>
                        <Input
                          placeholder="e.g., Photo: Rs. 50"
                          value={formData.cost.additional_charges}
                          onChange={(e) => updateCost('additional_charges', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Input
                          placeholder="e.g., Cash, Online Banking"
                          value={formData.cost.payment_method}
                          onChange={(e) => updateCost('payment_method', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
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
        </div>
      </form>
    </div>
  );
}