// app/government/institutions/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Building2, Clock, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageProps {
  params: { id: string };
}

interface Service {
  id: string;
  name: string;
  description?: string;
  status: string;
  department?: string;
  duration?: {
    processing_time?: string;
  };
  cost?: {
    service_fee?: string;
  };
  documents?: string[];
  categories?: {
    name: string;
  };
}

interface Department {
  id: string;
  name: string;
  name_nepali?: string;
  description?: string;
  services?: Service[];
}

interface Institution {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

export default async function PublicInstitutionPage({ params }: PageProps) {
  const supabase = await createClient();

  // Get institution details (only approved ones)
  const { data: institution }: { data: Institution | null } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (!institution) {
    notFound();
  }

  // Get departments with services
  const { data: departments }: { data: Department[] | null } = await supabase
    .from('departments')
    .select(`
      *,
      services:services!department(
        *,
        categories (
          name
        )
      )
    `)
    .eq('institution_id', params.id)
    .order('created_at', { ascending: false });

  // Get all services for this institution
  const { data: allServices }: { data: Service[] | null } = await supabase
    .from('services')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('institution_id', params.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/government">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Government Services
            </Link>
          </Button>
        </div>
      </div>

      {/* Institution Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {institution.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="capitalize">{institution.type}</span>
                </div>
                {institution.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{institution.address}</span>
                  </div>
                )}
              </div>
              {institution.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {institution.description}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {institution.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{institution.phone}</span>
                  </div>
                )}
                {institution.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{institution.email}</span>
                  </div>
                )}
                {institution.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a 
                      href={institution.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="departments">By Department</TabsTrigger>
            <TabsTrigger value="all-services">All Services</TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments" className="mt-6">
            <div className="space-y-6">
              {departments && departments.length > 0 ? (
                departments.map((department: Department) => (
                  <Card key={department.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {department.name}
                      </CardTitle>
                      {department.name_nepali && (
                        <CardDescription className="text-lg">
                          {department.name_nepali}
                        </CardDescription>
                      )}
                      {department.description && (
                        <CardDescription>
                          {department.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {department.services && department.services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {department.services.map((service: Service) => (
                            <ServiceCard key={service.id} service={service} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No services available in this department yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No departments found</h3>
                  <p className="text-gray-600">This institution hasn&apos;t added any departments yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* All Services Tab */}
          <TabsContent value="all-services" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allServices && allServices.length > 0 ? (
                allServices.map((service: Service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600">This institution hasn&apos;t added any services yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          {service.categories && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {service.categories.name}
            </span>
          )}
        </div>
        {service.description && (
          <CardDescription className="line-clamp-2">
            {service.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {service.duration?.processing_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Processing: {service.duration.processing_time}</span>
            </div>
          )}
          
          {service.cost?.service_fee && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Fee: {service.cost.service_fee}</span>
            </div>
          )}

          {service.documents && service.documents.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{service.documents.length} documents required</span>
            </div>
          )}
        </div>

        <Button asChild className="w-full mt-4" variant="outline">
          <Link href={`/government/services/${service.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}