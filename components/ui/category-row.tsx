// components/category-row.tsx
"use client";

import { Button } from "@/components/ui/button";
import CategoryCard from "./category-card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Institution {
  id: string;
  name: string;
  type: string;
}

interface CategoryRowProps {
  categoryName: string;
  categoryNameNepali: string;
  institutions: Institution[];
  categoryImage?: string;
}

export default function CategoryRow({ 
  categoryName, 
  categoryNameNepali, 
  institutions, 
  categoryImage = "/images/rupandehi.png" 
}: CategoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Show first 4 items by default, or all if showAll is true
  const displayedInstitutions = showAll ? institutions : institutions.slice(0, 4);
  const hasMore = institutions.length > 4;

  const toggleShowAll = () => {
    setShowAll(!showAll);
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        {/* Header with title and See All button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {categoryNameNepali}
            </h1>
            <p className="text-gray-600 text-sm capitalize">{categoryName}</p>
            <p className="text-gray-500 text-xs">
              {institutions.length} {institutions.length === 1 ? 'institution' : 'institutions'} available
            </p>
          </div>
          {hasMore && (
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              onClick={toggleShowAll}
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  See All ({institutions.length})
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Cards grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 ${
          isExpanded ? 'auto-rows-fr' : ''
        }`}>
          {displayedInstitutions.map((institution) => (
            <CategoryCard 
              key={institution.id} 
              institutionId={institution.id}
              institutionName={institution.name}
              institutionType={institution.type}  // Add this line
              categoryImage={categoryImage}
            />
          ))}
        </div>

        {/* Loading animation for expansion */}
        {isExpanded && showAll && (
          <div className="mt-4 text-center text-gray-500">
            <p className="text-sm">Showing all {institutions.length} institutions</p>
          </div>
        )}
      </div>
    </section>
  );
}