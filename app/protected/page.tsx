// app/protected/institutions/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, Building2 } from "lucide-react";
import Link from "next/link";

export default async function InstitutionsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  console.log("Current user ID:", data.user.id); // Debug log

  // Try fetching without the created_by filter first to see all institutions
  const { data: allInstitutions, error: allError } = await supabase
    .from('institutions')
    .select('*')
    .order('created_at', { ascending: false });

  console.log("All institutions:", allInstitutions); // Debug log
  console.log("All institutions error:", allError); // Debug log

  // Now fetch with the filter
  const { data: institutions, error: institutionsError } = await supabase
    .from('institutions')
    .select('*')
    .eq('created_by', data.user.id)
    .order('created_at', { ascending: false });

  console.log("User institutions:", institutions); // Debug log
  console.log("User institutions error:", institutionsError); // Debug log

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Institutions</h1>
          <p className="text-muted-foreground">
            Manage your registered institutions
          </p>
          {/* Debug info */}
          <div className="text-xs text-muted-foreground mt-2">
            User ID: {data.user.id}<br/>
            Total institutions in DB: {allInstitutions?.length || 0}<br/>
            Your institutions: {institutions?.length || 0}
          </div>
        </div>
        <Button asChild>
          <Link href="/protected/institutions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Institution
          </Link>
        </Button>
      </div>

      {institutions && institutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((institution) => (
            <Card key={institution.id}>
              <CardHeader>
                <CardTitle className="text-lg">{institution.name}</CardTitle>
                <div className="flex justify-between items-center">
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
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {institution.description || 'No description provided'}
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  Created by: {institution.created_by}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/protected/institutions/${institution.id}`}>
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/protected/institutions/${institution.id}/edit`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No institutions yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Start by creating your first institution to offer services on the platform.
            </p>
            {/* Debug info */}
            <div className="text-xs text-muted-foreground mb-4 text-center">
              Debug: User ID: {data.user.id}<br/>
              Total in DB: {allInstitutions?.length || 0}, Yours: {institutions?.length || 0}
            </div>
            <Button asChild>
              <Link href="/protected/institutions/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Institution
              </Link>
            </Button>
          </CardContent>
        </Card>

        
      )}
    </div>
  );
}