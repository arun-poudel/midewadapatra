// app/page.tsx
import Navbar from "@/components/navbar";
import CategoriesContainer from "@/components/ui/categories-container";
import Footer from "@/components/ui/footer";
import HeroBanner from "@/components/ui/hero-banner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBanner/>
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
        
          <CategoriesContainer/>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
   
    </div>
  );
}