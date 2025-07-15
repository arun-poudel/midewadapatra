// app/protected/institutions/[id]/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, MapPin, Phone, Mail, Globe, Building2, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function InstitutionPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Get institution details
  const { data: institution } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .eq('created_by', data.user.id)
    .single();

  if (!institution) {
    redirect("/protected/institutions");
  }

  // Get departments for this institution
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .eq('institution_id', params.id)
    .order('created_at', { ascending: false });

  // Get services for this institution
  const { data: services } = await supabase
    .from('services')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('institution_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{institution.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground capitalize">
              {institution.type}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              institution.status === 'approved' ? 'bg-green-100 text-green-800' :
              institution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {institution.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/protected/institutions/${params.id}/departments`}>
              <Users className="mr-2 h-4 w-4" />
              Manage Departments
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/protected/institutions/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Institution
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institution Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institution Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {institution.description && (
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{institution.description}</p>
                </div>
              )}
              
              {institution.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium mb-1">Address</h4>
                    <p className="text-sm text-muted-foreground">{institution.address}</p>
                  </div>
                </div>
              )}

              {institution.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-sm text-muted-foreground">{institution.phone}</p>
                  </div>
                </div>
              )}

              {institution.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">{institution.email}</p>
                  </div>
                </div>
              )}

              {institution.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium mb-1">Website</h4>
                    <a 
                      href={institution.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {institution.website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Departments and Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Departments Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>
                    Departments in this institution
                  </CardDescription>
                </div>
                {institution.status === 'approved' && (
                  <Button variant="outline" asChild>
                    <Link href={`/protected/institutions/${params.id}/departments/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Department
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {institution.status !== 'approved' ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">
                    Institution must be approved before you can manage departments.
                  </p>
                </div>
              ) : departments && departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {departments.map((department) => (
                    <Card key={department.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{department.name}</h4>
                            {department.name_nepali && (
                              <p className="text-xs text-muted-foreground">{department.name_nepali}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/protected/institutions/${params.id}/departments/${department.id}/services`}>
                              <Building2 className="mr-1 h-3 w-3" />
                              Services
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-muted-foreground mb-2 text-sm">
                    No departments added yet.
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/protected/institutions/${params.id}/departments/new`}>
                      <Plus className="mr-2 h-3 w-3" />
                      Add First Department
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Services</CardTitle>
                  <CardDescription>
                    All services offered by this institution
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/protected/institutions/${params.id}/departments`}>
                    View All Departments
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {institution.status !== 'approved' ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Institution must be approved before you can add services.
                  </p>
                </div>
              ) : services && services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            {service.department && (
                              <p className="text-xs text-muted-foreground">
                                Department: {service.department}
                              </p>
                            )}
                          </div>
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
                        
                        {/* Display new service structure */}
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
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/protected/services/${service.id}/edit`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
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
                    No services added yet.
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add departments first, then create services within those departments.
                  </p>
                  <Button asChild>
                    <Link href={`/protected/institutions/${params.id}/departments`}>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Departments
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}