// app/government/services/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, DollarSign, FileText, List, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageProps {
  params: { id: string };
}

interface ServiceDetail {
  id: string;
  name: string;
  description?: string;
  status: string;
  department?: string;
  documents?: string[];
  request_process?: string[];
  duration?: {
    processing_time?: string;
    office_hours?: string;
    availability?: string;
  };
  cost?: {
    service_fee?: string;
    additional_charges?: string;
    payment_method?: string;
  };
  institutions: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  categories?: {
    name: string;
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const supabase = await createClient(); // Add await here

  // Get service details with institution info
  const { data: service }: { data: ServiceDetail | null } = await supabase
    .from('services')
    .select(`
      *,
      institutions (
        id,
        name,
        address,
        phone,
        email
      ),
      categories (
        name
      )
    `)
    .eq('id', params.id)
    .eq('status', 'active')
    .single();

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/government">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Government Services
              </Link>
            </Button>
            <span className="text-gray-400">/</span>
            <Button variant="ghost" asChild>
              <Link href={`/government/institutions/${service.institutions.id}`}>
                {service.institutions.name}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Service Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Building2 className="h-5 w-5" />
              <span>{service.institutions.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {service.name}
            </h1>
            <div className="flex items-center gap-4">
              {service.categories && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {service.categories.name}
                </span>
              )}
              {service.department && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {service.department}
                </span>
              )}
            </div>
            {service.description && (
              <p className="text-gray-600 text-lg mt-4 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="documents">कागजातहरु</TabsTrigger>
              <TabsTrigger value="process">निवेदन</TabsTrigger>
              <TabsTrigger value="duration">लाग्ने समय</TabsTrigger>
              <TabsTrigger value="cost">लाग्ने शुल्क</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents (आवश्यक कागजातहरु)
                  </CardTitle>
                  <CardDescription>
                    Documents you need to bring for this service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.documents && service.documents.length > 0 ? (
                    <ul className="space-y-3">
                      {service.documents.map((doc: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specific documents listed.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Application Process (निवेदन प्रक्रिया)
                  </CardTitle>
                  <CardDescription>
                    Step-by-step process to apply for this service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.request_process && service.request_process.length > 0 ? (
                    <div className="space-y-4">
                      {service.request_process.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-700">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specific process steps listed.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Duration Tab */}
            <TabsContent value="duration" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Information (समय सम्बन्धी जानकारी)
                  </CardTitle>
                  <CardDescription>
                    Processing time and office hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.duration?.processing_time && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Processing Time</h4>
                        <p className="text-gray-600">{service.duration.processing_time}</p>
                      </div>
                    )}
                    {service.duration?.office_hours && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Office Hours</h4>
                        <p className="text-gray-600">{service.duration.office_hours}</p>
                      </div>
                    )}
                    {service.duration?.availability && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                        <p className="text-gray-600">{service.duration.availability}</p>
                      </div>
                    )}
                    {!service.duration?.processing_time && !service.duration?.office_hours && !service.duration?.availability && (
                      <p className="text-gray-500">No time information available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cost Tab */}
            <TabsContent value="cost" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Information (शुल्क सम्बन्धी जानकारी)
                  </CardTitle>
                  <CardDescription>
                    Service fees and payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.cost?.service_fee && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Service Fee</h4>
                        <p className="text-gray-600 text-lg font-medium">{service.cost.service_fee}</p>
                      </div>
                    )}
                    {service.cost?.additional_charges && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Additional Charges</h4>
                        <p className="text-gray-600">{service.cost.additional_charges}</p>
                      </div>
                    )}
                    {service.cost?.payment_method && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                        <p className="text-gray-600">{service.cost.payment_method}</p>
                      </div>
                    )}
                    {!service.cost?.service_fee && !service.cost?.additional_charges && !service.cost?.payment_method && (
                      <p className="text-gray-500">No cost information available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Contact for More Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.institutions.address && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">{service.institutions.address}</p>
                  </div>
                )}
                {service.institutions.phone && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">{service.institutions.phone}</p>
                  </div>
                )}
                {service.institutions.email && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{service.institutions.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}