# Cursor Rules for Aqua Prime

## File Structure and Versioning

### Active File Locations
- Private game components: `/private/app/*`
- Public components: `/app/*`
- Shared infrastructure: `/contracts`, `/scripts`
- Public assets: `/app/public/*`

### Deprecated Locations (Do Not Use)
- ❌ `/app/api/profiles/generate/route.ts` - Use `/private/app/api/profiles/generate/route.ts` instead
- ❌ `/app/profile-pool/page.tsx` - Use `/private/app/profile-pool/page.tsx` instead

## Data Handling Rules

### NFT Metadata
- Always stringify `nftMetadata` before saving to database
- Always parse `nftMetadata` when reading from database
- Schema expects `nftMetadata` as String, not Object
```typescript
// Saving to database
await prisma.profile.create({
  data: {
    ...profile,
    nftMetadata: JSON.stringify(metadata)
  }
});

// Reading from database
const metadata = JSON.parse(profile.nftMetadata);
```

### Platypus Rendering
- Always encode trait parameters properly when calling `/api/render-platypus`
- Never pass empty trait objects - provide defaults
- Use encodeURIComponent only once to avoid double encoding
- Validate traits against AVAILABLE_TRAITS before rendering
```typescript
// Correct way to pass traits
const traits = {
  background: 'default',
  skin: 'default',
  // ... other required traits
};
const encodedTraits = encodeURIComponent(JSON.stringify(traits));
const imageUrl = `/api/render-platypus?traits=${encodedTraits}`;
```

## React Component Rules

### Key Management
- Always use unique keys for mapped components
- Prefer database IDs or UUIDs over array indices
- Never reuse keys across different components
- Add timestamp or counter if needed for uniqueness
```typescript
// Correct way to handle keys
{profiles.map((profile, index) => (
  <div key={`${profile.id}-${index}`}>
    {/* Component content */}
  </div>
))}
```

## Best Practices

### File Organization
- Keep private game logic in `/private` directory
- Use Eliza framework as service layer for social/AI features
- Public assets must be in `/app/public`
- Components reference assets from app's public directory

### Code Patterns
- Always clean up subscriptions and intervals in useEffect
- Use AbortController for fetch requests
- Clear timeouts and intervals on component unmount
- Remove event listeners when components unmount

### Styled Components
- Use singleton pattern to avoid multiple instances
- Import from shared barrel file
- Example: `import { styled } from '@/styles'`
- Never import directly from 'styled-components'

## Security Considerations
- Never modify .env or .env.local files
- Keep sensitive algorithms in `/private`
- Implement proper access controls between layers
- Maintain separate databases for private/public data