// app/protected/institutions/[id]/departments/[departmentId]/services/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string; departmentId: string };
}

export default async function DepartmentServicesPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Get institution
  const { data: institution } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .eq('created_by', data.user.id)
    .single();

  if (!institution) {
    redirect("/protected/institutions");
  }

  // Get department
  const { data: department } = await supabase
    .from('departments')
    .select('*')
    .eq('id', params.departmentId)
    .eq('institution_id', params.id)
    .single();

  if (!department) {
    redirect(`/protected/institutions/${params.id}/departments`);
  }

  // Get services for this department
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('institution_id', params.id)
    .eq('department', department.name)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/protected/institutions/${params.id}/departments`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {department.name}
          </h1>
          {department.name_nepali && (
            <p className="text-lg text-muted-foreground mb-2">
              {department.name_nepali}
            </p>
          )}
          <p className="text-muted-foreground">
            {institution.name} • Services in this department
          </p>
        </div>
        <Button asChild>
          <Link href={`/protected/institutions/${params.id}/departments/${params.departmentId}/services/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Department Info */}
      {department.description && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{department.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            Services offered by this department
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services && services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{service.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        service.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                    
                    {service.categories && (
                      <p className="text-xs text-blue-600 mb-2">
                        {service.categories.name}
                      </p>
                    )}
                    
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {service.duration?.processing_time && (
                        <div>
                          <span className="font-medium">Processing Time: </span>
                          <span className="text-muted-foreground">{service.duration.processing_time}</span>
                        </div>
                      )}
                      {service.cost?.service_fee && (
                        <div>
                          <span className="font-medium">Service Fee: </span>
                          <span className="text-muted-foreground">{service.cost.service_fee}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/protected/services/${service.id}`}>
                          <Building2 className="mr-1 h-3 w-3" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                No services added yet for this department.
              </div>
              <Button asChild>
                <Link href={`/protected/institutions/${params.id}/departments/${params.departmentId}/services/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Service
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}