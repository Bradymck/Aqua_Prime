export const formatTraitValue = (value: string): string => {
  // Remove underscores and replace with spaces
  const withoutUnderscores = value.replace(/_/g, ' ');
  
  // Capitalize each word
  return withoutUnderscores
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatMetadataAttributes = (traits: Record<string, string | number>) => {
  return Object.entries(traits).map(([trait_type, value]) => ({
    trait_type: formatTraitValue(trait_type),
    value: typeof value === 'string' ? formatTraitValue(value) : value
  }));
}; 