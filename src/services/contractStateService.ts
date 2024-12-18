import { create } from 'zustand'
import { GameState } from '@/types/game'

interface ContractStateStore {
  gameState: GameState
  setGameState: (state: GameState) => void
  selectedNFTId: string | null
  setSelectedNFTId: (id: string | null) => void
}

export const useContractState = create<ContractStateStore>((set) => ({
  gameState: "app-check",
  setGameState: (state) => set({ gameState: state }),
  selectedNFTId: null,
  setSelectedNFTId: (id) => set({ selectedNFTId: id }),
})) 