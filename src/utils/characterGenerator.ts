export const generateCharacter = async () => {
  // Fetch traits if needed
  const traits = await fetchTraits();
  return selectAllTraits(traits);
};

// Implement the fetchTraits function to get traits from your API
const fetchTraits = async () => {
  const response = await fetch('/api/traits');
  if (!response.ok) {
    throw new Error('Failed to fetch traits');
  }
  return response.json();
};

// Define selectAllTraits function
const selectAllTraits = (allTraits: Record<string, any[]>) => {
  const selectedTraits: Record<string, any> = {};
  Object.entries(allTraits).forEach(([category, traits]) => {
    if (category !== 'Outlines  & Templates' && traits.length > 0) {
      selectedTraits[category] = traits[Math.floor(Math.random() * traits.length)];
    }
  });
  return selectedTraits;
};
