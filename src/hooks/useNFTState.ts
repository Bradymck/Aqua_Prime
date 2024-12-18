import { useState, useCallback } from 'react'
import { mintNFTs, burnNFTs } from '../app/utils/nft'
import { playPopSound, playJewelSound } from '../app/utils/nftUtils'

export const useNFTState = () => {
  const [nfts, setNfts] = useState<Array<{ id: string; image: string; wear: number; mintDate: string; power: number }>>([])
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0)
  const [moonstoneBalance, setMoonstoneBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMint = useCallback(async (count: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const newNFTs = await mintNFTs([count], [1]) // Assuming 1 as the amount for each NFT
      setNfts(prevNfts => [...prevNfts, ...newNFTs])
      playPopSound()
    } catch (error) {
      console.error("Error minting NFTs:", error)
      setError("Failed to mint NFTs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleBurn = useCallback(async () => {
    if (selectedNFTs.length === 0) return

    try {
      const moonstone = await burnNFTs(selectedNFTs)
      setMoonstoneBalance(prev => prev + moonstone)
      setNfts(prev => prev.filter(nft => !selectedNFTs.includes(nft.id)))
      setSelectedNFTs([])
      playJewelSound()
    } catch (error) {
      console.error("Error burning NFTs:", error)
    }
  }, [selectedNFTs])

  const handleNFTSelection = useCallback((id: string) => {
    setSelectedNFTs(prev => {
      const newSelection = prev.includes(id) ? prev.filter(nftId => nftId !== id) : [...prev, id]
      return newSelection
    })
  }, [])

  const navigateNFT = useCallback((direction: 'left' | 'right') => {
    setCurrentNFTIndex(prev => {
      if (direction === 'left') {
        return (prev - 1 + nfts.length) % nfts.length
      } else {
        return (prev + 1) % nfts.length
      }
    })
    setSelectedNFTs([])
  }, [nfts.length])

  return {
    nfts,
    selectedNFTs,
    currentNFTIndex,
    moonstoneBalance,
    isLoading,
    error,
    handleMint,
    handleBurn,
    handleNFTSelection,
    navigateNFT
  }
}
