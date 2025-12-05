// Utility function to create page URLs
export function createPageUrl(pageName) {
  const pageMap = {
    'Home': '/',
    'Chapter1': '/chapter1',
    'Chapter2': '/chapter2',
    'Chapter3': '/chapter3',
    'Chapter4': '/chapter4',
    'Forum': '/forum',
    'ImpactTracker': '/impact',
    'Profile': '/profile',
    'Profil': '/profile',
    'SimulationGame': '/simulation',
    'Resources': '/resources',
    'EstablishmentDashboard': '/dashboard',
    'MigrationGuide': '/migration',
    'CarbonFootprintCalculator': '/carbon-calculator',
    'CostComparator': '/cost-comparator',
    'NIRDMap': '/map'
  };
  
  return pageMap[pageName] || `/${pageName.toLowerCase()}`;
}

