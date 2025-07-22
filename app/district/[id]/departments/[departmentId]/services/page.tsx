// app/district/[id]/departments/[departmentId]/services/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, FileText, List } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string; departmentId: string };
}

interface Service {
  id: string;
  name: string;
  description?: string;
  status: string;
  documents?: string[];
  request_process?: string[];
  duration?: {
    processing_time?: string;
    office_hours?: string;
  };
  cost?: {
    service_fee?: string;
  };
  categories?: {
    name: string;
  };
}

interface Department {
  id: string;
  name: string;
  name_nepali?: string;
  description?: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
}

export default async function DepartmentServicesPage({ params }: PageProps) {
  const supabase = await createClient(); // Add await here like in government services

  // Get institution details - same pattern as government services
  const { data: institution }: { data: Institution | null } = await supabase
    .from('institutions')
    .select('id, name, type')
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (!institution) {
    notFound();
  }

  // Get department details - same pattern as government services
  const { data: department }: { data: Department | null } = await supabase
    .from('departments')
    .select('*')
    .eq('id', params.departmentId)
    .eq('institution_id', params.id)
    .single();

  if (!department) {
    notFound();
  }

  // Get services for this department - same pattern as government services
  const { data: services }: { data: Service[] | null } = await supabase
    .from('services')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('institution_id', params.id)
    .eq('department', department.name)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/district/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {department.name}
            </h1>
            {department.name_nepali && (
              <p className="text-lg text-gray-600 mb-2">{department.name_nepali}</p>
            )}
            <p className="text-gray-500">{institution.name}</p>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="container mx-auto px-4 py-8">
        {services && services.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Services</h2>
              <p className="text-gray-600">{services.length} service{services.length !== 1 ? 's' : ''} available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  institutionId={params.id}
                  departmentId={params.departmentId}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600">
              This department hasn&apos;t added any services yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ 
  service, 
  institutionId, 
  departmentId 
}: { 
  service: Service; 
  institutionId: string;
  departmentId: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
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
          {/* Processing Time */}
          {service.duration?.processing_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Processing: {service.duration.processing_time}</span>
            </div>
          )}
          
          {/* Service Fee */}
          {service.cost?.service_fee && (
            <div className="flex items-center gap-2 text-sm">
              <span className="h-4 w-4 text-gray-400">₨</span>
              <span className="text-gray-600">Fee: {service.cost.service_fee}</span>
            </div>
          )}

          {/* Required Documents Count */}
          {service.documents && service.documents.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{service.documents.length} documents required</span>
            </div>
          )}

          {/* Process Steps Count */}
          {service.request_process && service.request_process.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <List className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{service.request_process.length} process steps</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <Button asChild className="w-full">
            <Link href={`/district/${institutionId}/departments/${departmentId}/services/${service.id}`}>
              View Service Details
            </Link>
          </Button>
          
          {/* Quick Info Preview */}
          {(service.documents?.length || service.request_process?.length) && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2">
                {service.documents?.length && (
                  <div>
                    <span className="font-medium">Documents:</span>
                    <ul className="mt-1 space-y-1">
                      {service.documents.slice(0, 2).map((doc, index) => (
                        <li key={index} className="truncate">• {doc}</li>
                      ))}
                      {service.documents.length > 2 && (
                        <li className="text-blue-600">+{service.documents.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {service.request_process?.length && (
                  <div>
                    <span className="font-medium">Process:</span>
                    <ul className="mt-1 space-y-1">
                      {service.request_process.slice(0, 2).map((step, index) => (
                        <li key={index} className="truncate">{index + 1}. {step}</li>
                      ))}
                      {service.request_process.length > 2 && (
                        <li className="text-blue-600">+{service.request_process.length - 2} more steps</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}