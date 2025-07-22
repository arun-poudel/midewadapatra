// components/categories-container.tsx
import { createClient } from "@/lib/supabase/server";
import CategoryRow from "./category-row";

interface Institution {
  id: string;
  name: string;
  type: string;
}

interface InstitutionTypeGroup {
  type: string;
  institutions: Institution[];
}

// Institution type mappings with Nepali names and images
const institutionTypeMappings = {
  'ward': {
    nepali: 'वडा',
    image: '/images/rupandehi.png'
  },
  'government': {
    nepali: 'सरकारी कार्यालय',
    image: '/images/rupandehi.png'
  },
  'municipality': {
    nepali: 'नगरपालिका',
    image: '/images/rupandehi.png'
  },
  'District Administration': {
    nepali: 'जिल्ला प्रशासन कार्यालय',
    image: '/images/rupandehi.png'
  },
  'bank': {
    nepali: 'बैंक',
    image: '/images/rupandehi.png'
  },
  'hospital': {
    nepali: 'अस्पताल',
    image: '/images/rupandehi.png'
  },
  'school': {
    nepali: 'विद्यालय',
    image: '/images/rupandehi.png'
  },
  'other': {
    nepali: 'अन्य',
    image: '/images/rupandehi.png'
  }
} as const;

export default async function CategoriesContainer() {
  const supabase = await createClient();

  // Get all approved institutions that have active services
  const { data: institutionsWithServices } = await supabase
    .from('institutions')
    .select(`
      id,
      name,
      type,
      services!inner (
        id,
        status
      )
    `)
    .eq('status', 'approved')
    .eq('services.status', 'active');

  // Group institutions by type
  const institutionTypeGroups: InstitutionTypeGroup[] = [];

  if (institutionsWithServices) {
    // Create a map to group institutions by type
    const typeMap = new Map<string, Set<string>>();

    // Group unique institutions by type
    institutionsWithServices.forEach((institution) => {
      const institutionType = institution.type;
      
      if (!typeMap.has(institutionType)) {
        typeMap.set(institutionType, new Set());
      }
      
      // Add institution to the type group (using Set to avoid duplicates)
      typeMap.get(institutionType)?.add(JSON.stringify({
        id: institution.id,
        name: institution.name,
        type: institution.type
      }));
    });

    // Convert map to array format
    typeMap.forEach((institutionStrings, type) => {
      const institutions: Institution[] = Array.from(institutionStrings).map(str => JSON.parse(str));
      
      if (institutions.length > 0) {
        institutionTypeGroups.push({
          type,
          institutions
        });
      }
    });

    // Sort by type name for consistent ordering
    institutionTypeGroups.sort((a, b) => a.type.localeCompare(b.type));
  }

  if (institutionTypeGroups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h2>
        <p className="text-gray-600">Institution types with services will appear here once institutions add their services.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {institutionTypeGroups.map((group) => {
        const mapping = institutionTypeMappings[group.type as keyof typeof institutionTypeMappings] || {
          nepali: group.type,
          image: '/images/rupandehi.png'
        };

        return (
          <CategoryRow
            key={group.type}
            categoryName={group.type}
            categoryNameNepali={mapping.nepali}
            institutions={group.institutions}
            categoryImage={mapping.image}
          />
        );
      })}
    </div>
  );
}