// components/category-card.tsx
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  institutionId: string;
  institutionName: string;
  institutionType: string;
  categoryImage?: string;
}

export default function CategoryCard({ 
  institutionId, 
  institutionName, 
  institutionType,
  categoryImage = "/images/rupandehi.png" 
}: CategoryCardProps) {
  // Determine the route based on institution type
  const getRoute = () => {
    switch (institutionType.toLowerCase()) {
      case 'district administration':
        return `/district/${institutionId}`;
      case 'ward':
        return `/ward/${institutionId}`;
      case 'municipality':
        return `/municipality/${institutionId}`;
      case 'government':
        return `/government/institutions/${institutionId}`;
      default:
        return `/government/institutions/${institutionId}`;
    }
  };

  return (
    <Link href={getRoute()}>
      <Card className="w-full max-w-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative">
          <Image
            src={categoryImage}
            alt={`${institutionName} building`}
            width={400}
            height={320}
            quality={50}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 flex items-center justify-center">
            <h2 className="text-xl font-semibold text-center">{institutionName}</h2>
          </div>
        </div>
      </Card>
    </Link>
  );
}