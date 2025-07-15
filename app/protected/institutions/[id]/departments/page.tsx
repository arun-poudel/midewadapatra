// app/protected/institutions/[id]/departments/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function DepartmentsPage({ params }: PageProps) {
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

  // Get departments
  const { data: departments } = await supabase
    .from('departments')
    .select('*')
    .eq('institution_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Departments</h1>
          <p className="text-muted-foreground">
            Manage departments for {institution.name}
          </p>
        </div>
        <Button asChild>
          <Link href={`/protected/institutions/${params.id}/departments/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{department.name}</CardTitle>
              {department.name_nepali && (
                <p className="text-sm text-muted-foreground">{department.name_nepali}</p>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {department.description || 'No description provided'}
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/protected/institutions/${params.id}/departments/${department.id}/services`}>
                  <Building2 className="mr-2 h-3 w-3" />
                  View Services
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}