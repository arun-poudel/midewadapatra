// app/ward/[id]/page.tsx
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

// Department image mappings for ward services
const wardDepartmentImages: { [key: string]: string } = {
  'recommendation': '/images/citizenship.png',
  'birth': '/images/citizenship.png',
  'death': '/images/legal.png',
  'elderly': '/images/administration.png',
  'general': '/images/administration.png',
};

const getWardDepartmentImage = (departmentName: string): string => {
  const lowerName = departmentName.toLowerCase();
  
  if (lowerName.includes('recommendation') || lowerName.includes('सिफारिस')) {
    return wardDepartmentImages.recommendation;
  } else if (lowerName.includes('birth') || lowerName.includes('जन्म')) {
    return wardDepartmentImages.birth;
  } else if (lowerName.includes('death') || lowerName.includes('मृत्यु')) {
    return wardDepartmentImages.death;
  } else if (lowerName.includes('elderly') || lowerName.includes('ज्येष्ठ')) {
    return wardDepartmentImages.elderly;
  } else {
    return wardDepartmentImages.general;
  }
};

export default async function WardPage({ params }: PageProps) {
  const supabase = await createClient();

  // Get institution details
  const { data: institution }: { data: Institution | null } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'approved')
    .eq('type', 'ward')
    .single();

  if (!institution) {
    notFound();
  }

  // Get departments for this institution
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
            <p className="text-gray-600">Ward Office Services</p>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto px-4 py-12">
        {departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((department) => (
              <WardDepartmentCard key={department.id} department={department} institutionId={params.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600">This ward office hasn&apos;t added any services yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Ward Department Card Component
function WardDepartmentCard({ 
  department, 
  institutionId 
}: { 
  department: Department; 
  institutionId: string; 
}) {
  const departmentImage = getWardDepartmentImage(department.name);

  return (
    <Link href={`/ward/${institutionId}/departments/${department.id}/services`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
        <div className="relative">
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
            <Image
              src={departmentImage}
              alt={department.name}
              width={1200}
              height={800}
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