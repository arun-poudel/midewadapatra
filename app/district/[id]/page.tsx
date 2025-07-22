// app/district/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: { id: string };
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
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

// Department image mappings
const departmentImages: { [key: string]: string } = {
  'citizenship': '/images/citizenship.png',
  'passport': '/images/passport.png',
  'legal': '/images/legal.png',
  'accounting': '/images/accounting.png',
  'administration': '/images/administration.png',
  'general': '/images/rupandehi.png', // fallback
};

// Function to get image based on department name
const getDepartmentImage = (departmentName: string): string => {
  const lowerName = departmentName.toLowerCase();
  
  if (lowerName.includes('citizenship') || lowerName.includes('नागरिकता')) {
    return departmentImages.citizenship;
  } else if (lowerName.includes('passport') || lowerName.includes('राहदानी')) {
    return departmentImages.passport;
  } else if (lowerName.includes('legal') || lowerName.includes('मुद्दा')) {
    return departmentImages.legal;
  } else if (lowerName.includes('accounting') || lowerName.includes('लेखा')) {
    return departmentImages.accounting;
  } else if (lowerName.includes('administration') || lowerName.includes('प्रशासन')) {
    return departmentImages.administration;
  } else {
    return departmentImages.general;
  }
};

export default async function DistrictPage({ params }: PageProps) {
  const supabase = await createClient(); // Add await here like in government services

  // Get institution details - same pattern as government services
  const { data: institution }: { data: Institution | null } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'approved')
    .eq('type', 'District Administration')
    .single();

  if (!institution) {
    notFound();
  }

  // Get departments for this institution - same pattern as government services
  const { data: departments }: { data: Department[] | null } = await supabase
    .from('departments')
    .select('*')
    .eq('institution_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {institution.name}
            </h1>
            <p className="text-gray-600">District Administration Office Services</p>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto px-4 py-12">
        {departments && departments.length > 0 ? (
          <>
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Top Row - 4 equal cards */}
                {departments.slice(0, 4).map((department) => (
                  <DepartmentCard key={department.id} department={department} institutionId={params.id} />
                ))}
              </div>
              
              {/* Bottom Row - remaining departments */}
              {departments.length > 4 && (
                <div className="grid grid-cols-4 gap-4">
                  {departments.slice(4).map((department, index) => (
                    <div key={department.id} className={index === 0 ? "col-span-2" : ""}>
                      <DepartmentCard department={department} institutionId={params.id} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((department) => (
                <DepartmentCard key={department.id} department={department} institutionId={params.id} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Departments Available</h3>
            <p className="text-gray-600">This institution hasn&apos;t added any departments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Department Card Component
function DepartmentCard({ 
  department, 
  institutionId 
}: { 
  department: Department; 
  institutionId: string; 
}) {
  const departmentImage = getDepartmentImage(department.name);

  return (
    <Link href={`/district/${institutionId}/departments/${department.id}/services`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
        <div className="relative">
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <Image
              src={departmentImage}
              alt={department.name}
              width={800}
              height={1200}
              quality={100}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-gray-900 mb-1">
              {department.name}
            </h3>
            {department.name_nepali && (
              <p className="text-sm text-gray-600 mb-2">
                {department.name_nepali}
              </p>
            )}
            {department.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {department.description}
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}