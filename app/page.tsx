// app/page.tsx
import Navbar from "@/components/navbar";
import CategoriesContainer from "@/components/ui/categories-container";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center">eWadapatra</h1>
          <p className="text-center text-muted-foreground mt-4">
            Digital Government Services Platform
          </p>
          <CategoriesContainer/>
        </div>
      </main>

      {/* Footer */}
   
    </div>
  );
}