import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NFTDisplayProps {
  nfts: Array<{ id: string; image: string; wear: number; mintDate: string; power: number }>
  currentNFTIndex: number
  selectedNFTs: string[]
  handleNFTSelection: (id: string) => void
  navigateNFT: (direction: 'left' | 'right') => void
  showBurnGuidance: boolean
}

export const NFTDisplay: React.FC<NFTDisplayProps> = ({
  nfts,
  currentNFTIndex,
  selectedNFTs,
  handleNFTSelection,
  navigateNFT,
  showBurnGuidance
}) => {
  if (nfts.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center rounded-lg">
        <Image
          src="/img/cycle.png"
          alt="NFT Cycle"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square">
      {nfts.map((nft, index) => (
        <motion.div
          key={nft.id}
          className={`absolute inset-0 ${index === currentNFTIndex ? 'z-10' : 'z-0'}`}
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{
            scale: index === currentNFTIndex ? 1 : 0.8,
            rotate: index === currentNFTIndex ? 0 : -10 + index * 5,
            opacity: index === currentNFTIndex ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="nft-card w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
            <Image
              src={nft.image}
              alt={`NFT ${nft.id}`}
              layout="fill"
              objectFit="contain"
            />
            <div
              className="absolute bottom-4 right-4 z-20"
              onClick={(e) => {
                e.stopPropagation()
                handleNFTSelection(nft.id)
              }}
            >
              <Button
                className={`rounded-full bg-black bg-opacity-50 backdrop-blur-md text-white hover:bg-opacity-70 ${
                  selectedNFTs.includes(nft.id) ? 'bg-red-500 bg-opacity-80 hover:bg-red-600' : ''
                } ${showBurnGuidance ? 'burn-guidance' : ''}`}
              >
                🔥
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      <Button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-yellow-400 hover:text-yellow-300 focus:ring-0"
        onClick={() => navigateNFT('left')}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-yellow-400 hover:text-yellow-300 focus:ring-0"
        onClick={() => navigateNFT('right')}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}