import { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { Button } from './ui/button';
import { TraitMixingService } from '../services/traitMixingService';

export const TestTransactions = () => {
  const { state, actions } = useContracts();
  const [testTokenId, setTestTokenId] = useState(1);
  const traitService = TraitMixingService.getInstance();

  const handleTestMint = async () => {
    // Generate traits
    const traits = traitService.generateInitialTraits();
    
    // Create metadata
    const metadata = {
      name: `ARI #${testTokenId}`,
      description: "A unique AquaPrime character",
      image: "ipfs://placeholder",
      attributes: Object.entries(traits).map(([category, trait]) => ({
        trait_type: category,
        value: trait.name
      }))
    };

    // Test mint with metadata
    await actions.mintNFT(JSON.stringify(metadata));
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-2">Contract State</h3>
        <p>Subscribed: {state.isSubscribed ? 'Yes' : 'No'}</p>
        <p>Moonstone Balance: {state.moonstoneBalance}</p>
        <p>NFT Balance: {state.nftBalance}</p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => actions.startTrial()}
          disabled={state.isSubscribed}
        >
          Start Trial
        </Button>

        <Button
          onClick={handleTestMint}
          disabled={state.isMinting || !state.isSubscribed}
        >
          {state.isMinting ? 'Minting...' : 'Test Mint'}
        </Button>

        <Button
          onClick={() => actions.burnNFT(testTokenId)}
          disabled={state.isBurning}
        >
          {state.isBurning ? 'Burning...' : 'Test Burn'}
        </Button>
      </div>
    </div>
  );
}; 