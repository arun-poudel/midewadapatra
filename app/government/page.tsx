// app/government/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface SearchParams {
  search?: string;
  type?: string;
}

interface Department {
  id: string;
  name: string;
  name_nepali?: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  address?: string;
  description?: string;
  created_at: string;
  departments?: Department[];
}

export default async function GovernmentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient(); // Add await here

  // Get all approved institutions
  let query = supabase
    .from('institutions')
    .select(`
      *,
      departments (
        id,
        name,
        name_nepali
      )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  // Apply search filter if provided
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`);
  }

  // Apply type filter if provided
  if (searchParams.type) {
    query = query.eq('type', searchParams.type);
  }

  const { data: institutions }: { data: Institution[] | null } = await query;

  // Get service statistics
  const { data: totalServices } = await supabase
    .from('services')
    .select('id')
    .eq('status', 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Government Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find information about government services, required documents, and procedures
            </p>
          </div>

          {/* Search Bar */}
          <Suspense fallback={<div>Loading...</div>}>
            <SearchBar />
          </Suspense>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {institutions?.length || 0}
                </div>
                <div className="text-gray-600">Institutions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalServices?.length || 0}
                </div>
                <div className="text-gray-600">Services Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {institutions?.reduce((sum: number, inst: Institution) => sum + (inst.departments?.length || 0), 0) || 0}
                </div>
                <div className="text-gray-600">Departments</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Government Institutions</h2>
          <p className="text-gray-600">Browse institutions and their services</p>
        </div>

        {institutions && institutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution: Institution) => (
              <Card key={institution.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{institution.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="capitalize">{institution.type}</span>
                      </div>
                      {institution.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{institution.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {institution.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {institution.description}
                    </p>
                  )}
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      {institution.departments?.length || 0} departments available
                    </div>
                    {institution.departments && institution.departments.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {institution.departments.slice(0, 2).map((dept: Department) => (
                          <span 
                            key={dept.id} 
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {dept.name}
                          </span>
                        ))}
                        {institution.departments.length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{institution.departments.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/government/institutions/${institution.id}`}>
                      View Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No institutions found</h3>
            <p className="text-gray-600">
              {searchParams.search ? 'Try adjusting your search terms.' : 'No institutions have been added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Search Component
function SearchBar() {
  return (
    <form method="GET" className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          name="search"
          placeholder="Search for institutions or services..."
          className="pl-10 pr-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          Search
        </Button>
      </div>
    </form>
  );
}