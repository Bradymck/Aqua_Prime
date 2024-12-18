'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button'; // Updated import
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import confetti from 'canvas-confetti'
import Battery from './Battery'
import { CollectPopup } from './CollectPopup';
import { MarketplacePopup } from './MarketplacePopup';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletConnection } from '../app/hooks/useWalletConnection'; // Updated import
import styles from './BurnGuidance.module.css';
import Image from 'next/image';
import { NFT } from '@/utils/nft';


const mintNFTs = async (count: number) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  const nftImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/262-TYAUaq16gVbB7Rb9TddDSWsiipJHkr.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/77-Ek6qtE9bx7jkXPexUuRklhxb1LUSrr.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/76-RswPnyinVpMOXEmCjPDz6kPuVzlt7J.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67-jhFvHooGQThWDoianYAjS3mXhfzX8e.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/30-WcQ5Ki5avzW1vN6lrymfTE6gBIrJpw.png"
  ]
  return Array(count).fill(0).map((_, i) => ({
    id: `NFT-${i + 1}`,
    image: nftImages[Math.floor(Math.random() * nftImages.length)],
    wear: Math.random(),
    mintDate: new Date().toISOString(),
    power: Math.floor(Math.random() * 100) + 1
  }))
}

const burnNFTs = async (nfts: string[]) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return nfts.length * 10
}

const playClickSound = () => {
  const audio = new Audio('/audio/click.wav')
  audio.volume = 0.1 // Adjust volume as needed
  audio.play()
}

const playPopSound = () => {
  const audio = new Audio('/audio/pop.wav')
  audio.volume = 0.1 // Adjust volume as needed
  audio.play()
}

const playThunkSound = () => {
  const audio = new Audio('/audio/thunk.wav')
  audio.volume = 0.1 // Adjust volume as needed
  audio.play()
}

const playJewelSound = () => {
  const audio = new Audio('/audio/jewel.wav');
  audio.volume = 0.1; // Adjust volume as needed
  audio.play();
};

const emitEmojis = (event: React.MouseEvent, phase: string) => {
  const emojis = {
    connect: ['🛸', '🌕', '📡', '🔗', '💫', '✨', '🚀'],
    collect: ['🛸', '💧', '🎮', '💎', '🦆', '🎲', ''],  
    mint: ['🌐', '⚒️', '💰', '💠', '🔨', '🧬', '📈'],
    enableMic: ['🎙️', '🧩', '📡', '🗣️', '🔊', '🎧', '📻'],
    burn: ['💥', '🧨', '🎇', '🌋', '💀', '🔥', '💣', '🧯'],
  }

  const selectedEmojis = emojis[phase as keyof typeof emojis] || emojis.connect

  playThunkSound()

  for (let i = 0; i < 10; i++) {
    const emoji = document.createElement('div')
    emoji.innerText = selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)]
    emoji.style.position = 'fixed'
    emoji.style.left = `${event.clientX}px`
    emoji.style.top = `${event.clientY}px`
    emoji.style.fontSize = '24px'
    emoji.style.pointerEvents = 'none'
    emoji.style.userSelect = 'none'
    document.body.appendChild(emoji)

    const angle = Math.random() * Math.PI * 2
    const distance = 100 + Math.random() * 60
    const duration = 1000 + Math.random() * 1000

    emoji.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      fill: 'forwards'
    }).onfinish = () => {
      if (document.body.contains(emoji)) {
        document.body.removeChild(emoji);
      }
    };
  }
}

export function NftMinter() {
  const { isConnected } = useWalletConnection();
  console.log('NftMinter render:', { isConnected });

  const [buttonState, setButtonState] = useState<'collect' | 'mint' | 'burn'>('collect');
  const [isProcessing, setIsProcessing] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [moonstoneBalance, setMoonstoneBalance] = useState(0);
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [showCollectPopup, setShowCollectPopup] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [sandDollarBalance, setSandDollarBalance] = useState(0);
  const [isNFTPoweredDown, setIsNFTPoweredDown] = useState(false);
  const [showBurnGuidance, setShowBurnGuidance] = useState(false);
  const [showMoonstonePopup, setShowMoonstonePopup] = useState(false);
  const [baseName, setBaseName] = useState<string | null>(null);

  const handleBatteryDrain = useCallback((amount: number) => {
    setBatteryLevel(prev => {
      const newLevel = Math.max(0, prev - amount)
      if (newLevel === 0 && !isNFTPoweredDown) {
        setIsNFTPoweredDown(true)
      }
      return newLevel
    })
    setSandDollarBalance(prev => Math.min(prev + amount * 20, prev))
  }, [isNFTPoweredDown])

  const handleMint = async (count: number) => {
    setIsProcessing(true)
    try {
      const newNFTs = await mintNFTs(count)
      setNfts([...nfts, ...newNFTs])
      setButtonState('burn')
      playPopSound()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (error) {
      console.error("Error minting NFTs:", error)
    } finally {
      setIsProcessing(false)
      setShowCollectPopup(false)
    }
  }
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    switch (buttonState) {
      case 'collect':
        setShowCollectPopup(true);
        break;
      case 'mint':
        handleMint(mintCount);
        break;
      case 'burn':
        if (selectedNFTs.length > 0) {
          setIsProcessing(true);
          try {
            const moonstone = await burnNFTs(selectedNFTs);
            setMoonstoneBalance(prev => prev + moonstone);
            setNfts(prev => prev.filter(nft => !selectedNFTs.includes(nft.id)));
            setSelectedNFTs([]);
            playJewelSound();
          } catch (error) {
            console.error("Error burning NFTs:", error);
          } finally {
            setIsProcessing(false);
          }
        } else {
          setShowBurnGuidance(true);
          setTimeout(() => setShowBurnGuidance(false), 3000);
        }
        break;
    }
  };

  const handleNFTSelection = (id: string) => {
    setSelectedNFTs(prev => {
      const newSelection = prev.includes(id) ? prev.filter(nftId => nftId !== id) : [...prev, id];
      return newSelection;
    });
  };
  const navigateNFT = (direction: 'left' | 'right') => {
    setCurrentNFTIndex(prev => {
      if (direction === 'left') {
        return (prev - 1 + nfts.length) % nfts.length
      } else {
        return (prev + 1) % nfts.length
      }
    })
    setSelectedNFTs([])
  }

  const logConnectionStatus = useCallback(() => {
    console.log('NftMinter effect - connection status:', { isConnected });
  }, [isConnected]);

  useEffect(() => {
    logConnectionStatus();
  }, [logConnectionStatus]);

  useEffect(() => {
    async function fetchBaseName() {
      const address = '0xYourWalletAddress'; // Replace with actual address
      const response = await fetch(`/api/baseName/${address}`);
      const data = await response.json();
      setBaseName(data.baseName);
    }
    fetchBaseName();
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen text-white overflow-hidden relative pt-0"
      onClick={(e) => emitEmojis(e, buttonState)}
    >
      {/* Logo */}
      <div className="w-full flex justify-center mb-4 z-10">
        <Image
          alt="Aqua Prime Logo"
          width={256}
          height={100}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Full%20Logo%20B-W-16EBgpfQ2S5lclcGCj61sOQpWKyu5K.png"
        />
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <ConnectButton />
        </div>
      ) : (
        <>
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md px-4 z-20">
            {/* NFT Display */}
            <div className="relative w-full aspect-square mb-8" style={{ maxWidth: '80vmin', maxHeight: '80vmin' }}>
              {nfts.length > 0 ? (
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
                            size="icon"
                            className={`rounded-full bg-black bg-opacity-50 backdrop-blur-md text-white hover:bg-opacity-70 ${
                              selectedNFTs.includes(nft.id) ? 'bg-red-500 bg-opacity-80 hover:bg-red-600' : ''
                            } ${showBurnGuidance ? styles.burnGuidance : ''}`}
                          >
                            🔥
                          </Button>
                        </div>
                        <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
                          <div className="mt-2 flex flex-col items-end space-y-1">
                            <Button
                              onClick={() => setShowMoonstonePopup(true)}
                              className="bg-black bg-opacity-50 backdrop-blur-md text-white px-2 py-1 rounded-full font-medium text-xs flex items-center space-x-1"
                            >
                              <span role="img" aria-label="Diamond" className="text-yellow-400 mr-1">💎</span>
                              <span>{moonstoneBalance}</span>
                            </Button>
                            <Button
                              className="bg-black bg-opacity-50 backdrop-blur-md text-white px-2 py-1 rounded-full font-medium text-xs flex items-center space-x-1"
                              onClick={() => setShowMarketplace(true)}
                            >
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/112-UgWTnRAqQhW3dXZhwCvD3yZrZ3ejef.png"
                                alt="Sand Dollar"
                                width={12}
                                height={12}
                                className="mr-1"
                              />
                              <span>{sandDollarBalance.toFixed(2)}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {/* Navigation Arrows */}
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
              ) : (
                <div className="w-full aspect-square flex items-center justify-center rounded-lg">
                  <Image
                    src="/img/cycle.png"
                    alt="NFT Cycle"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Buttons in corners and center */}
              <Button
                className="absolute top-4 left-4 z-30 bg-black bg-opacity-50 backdrop-blur-md hover:bg-opacity-70 text-yellow-400 rounded-full w-12 h-12 flex items-center justify-center text-2xl"
                onClick={() => setShowCollectPopup(true)}
              >
                🥚
              </Button>
              
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
                <Battery level={batteryLevel} onDrain={handleBatteryDrain} />
              </div>
              
              <Button
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 py-3 px-5 text-base font-bold transition-all duration-300 ease-in-out hover:scale-105 border-0 rounded-xl shadow-lg backdrop-blur-md bg-yellow-400 bg-opacity-80 hover:bg-yellow-500 text-purple-900`}
                onClick={(e) => {
                  playClickSound()
                  handleButtonClick(e)
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : null}
                {buttonState === 'collect' && (nfts.length === 0 ? "Mint NFTs" : "Collect NFTs")}
                {buttonState === 'mint' && "Mint NFTs"}
                {buttonState === 'burn' && "Burn NFTs"}
              </Button>
              {/* Display base name if available */}
              {baseName && (
                <div className="mt-4 text-white">
                  Base Name: {baseName}
                </div>
              )}

              <CollectPopup 
                showCollectPopup={showCollectPopup}
                setShowCollectPopup={setShowCollectPopup}
                mintCount={mintCount}
                setMintCount={setMintCount}
                handleMint={handleMint}
                isProcessing={isProcessing}
                playClickSound={playClickSound}
              />

              <MarketplacePopup 
                showMarketplace={showMarketplace}
                setShowMarketplace={setShowMarketplace}
              />

              <MoonstonePopup 
                show={showMoonstonePopup}
                onClose={() => setShowMoonstonePopup(false)}
                moonstoneBalance={moonstoneBalance}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const MoonstonePopup = ({ show, onClose, moonstoneBalance }: { show: boolean; onClose: () => void; moonstoneBalance: number }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Moonstone Details</h2>
        <p>Your moonstone balance: {moonstoneBalance}</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    </div>
  );
};
