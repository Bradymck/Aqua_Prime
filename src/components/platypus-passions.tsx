"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Heart, X, MessageCircle, Gift, Zap, Package, Search, Phone, ArrowLeft, Send, MoreHorizontal, Image as ImageIcon, Flame, DollarSign } from "lucide-react"
import Image from "next/image"
import { createGlobalStyle } from 'styled-components'
import { usePrivy } from '@privy-io/react-auth'

interface ChatMessage {
  sender: "user" | "platypus";
  content: string;
}

interface Gift {
  emoji: string;
  name: string;
  price: number;
}

interface PlatypusProfile {
  name: string;
  age: string;
  bio: string;
  compatibility: string;
  traits: string[];
  image: {
    [key: string]: {
      image: string;
    };
  };
  alignment: string;
}

const GlobalStyle = createGlobalStyle`
  * {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

export default function PlatypusPassions() {
  const { login, authenticated } = usePrivy();
  const [step, setStep] = useState("app-check")
  const [platypusType, setPlatypusType] = useState("")
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentProfile, setCurrentProfile] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [currentPage, setCurrentPage] = useState("main")
  const [selectedPlatypus, setSelectedPlatypus] = useState<PlatypusProfile | null>(null)
  const [message, setMessage] = useState("")
  const [moonstones, setMoonstones] = useState(100)
  const [sandDollars, setSandDollars] = useState(500)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const disclaimerItems = [
    { emoji: "🎮", text: "Entertainment purposes only, Open source UGC, provided 'as is'" },
    { emoji: "⚠️", text: "No warranties on quality, functionality, or availability" },
    { emoji: "💰", text: "Inherent risks with play-to-earn, blockchain, crypto, and NFTs" },
    { emoji: "👤", text: "Players solely responsible for their actions" },
    { emoji: "💸", text: "No guaranteed gains or losses" },
    { emoji: "🚫", text: "Developers not liable for damages" },
    { emoji: "✅", text: "Using the game means accepting these terms" },
    { emoji: "🤖", text: "AI-generated content may be untrue or misleading" },
    { emoji: "🔒", text: "Users responsible for wallet and asset security" },
  ]

  const profiles: PlatypusProfile[] = [
    {
      name: "Alex",
      age: "28",
      bio: "Looking for someone to share my DNA with. Literally.",
      compatibility: "99.9%",
      traits: ["Gene-edited", "Telepathic", "Immortal-ready"],
      image: {
        'Background': { image: '/assets/backgrounds/lab.png' },
        'Skin': { image: '/assets/skins/default.png' },
        'Outlines & Templates': { image: '/assets/outlines_templates/master_outline.png' }
      },
      alignment: "🌟"
    },
    {
      name: "Sam",
      age: "??",
      bio: "I can predict your future. Swipe right to see yours.",
      compatibility: "100%",
      traits: ["Time-traveler", "Mind-reader", "Quantum-entangled"],
      image: {
        'Background': { image: '/assets/backgrounds/sam.png' },
        'Skin': { image: '/assets/skins/sam.png' },
        'Outlines & Templates': { image: '/assets/outlines_templates/sam_outline.png' }
      },
      alignment: "🌟"
    },
    {
      name: "Jamie",
      age: "All of them",
      bio: "I exist in multiple dimensions. Date them all!",
      compatibility: "∞",
      traits: ["Multi-dimensional", "Omnipresent", "Reality-bender"],
      image: {
        'Background': { image: '/assets/backgrounds/jamie.png' },
        'Skin': { image: '/assets/skins/jamie.png' },
        'Outlines & Templates': { image: '/assets/outlines_templates/jamie_outline.png' }
      },
      alignment: "🌟"
    },
  ]

  const gifts = [
    { emoji: "🎩", name: "Top Hat", price: 50 },
    { emoji: "🕶️", name: "Sunglasses", price: 30 },
    { emoji: "🦄", name: "Unicorn Horn", price: 100 },
  ]

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsFullscreen(isStandalone)
    if (isStandalone) {
      setStep("age-check")
    }
  }, [])

  useEffect(() => {
    if (step === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setStep("dating-app")
            return 100
          }
          return prev + 10
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleInstallApp = () => {
    alert("To install the app:\n1. Open this website in your mobile browser\n2. Tap the menu icon (usually three dots)\n3. Select 'Add to Home Screen'\n4. Confirm and name the shortcut\n5. Open the app from your home screen")
    setStep("age-check")
  }

  const handleAgeVerification = () => {
    setIsAgeVerified(true)
    setStep("wallet-creation")
  }

  const handleDisclaimerAcceptance = () => {
    if (isDisclaimerAccepted) {
      setStep("welcome")
    }
  }

  const handleNext = () => {
    if (step === "welcome") {
      setStep("choose-type")
    } else if (step === "choose-type") {
      setStep("loading")
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      alert(`Congratulations! You've been genetically paired with ${profiles[currentProfile].name}. Your offspring's traits are now being calculated.`)
    }
    setCurrentProfile((prev) => (prev + 1) % profiles.length)
  }

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setChatMessages([...chatMessages, { sender: "user", content: message }])
      setMessage("")
      // Mock response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: "platypus", content: "That's fascinating! Tell me more about your genetic modifications." }])
      }, 1000)
    }
  }

  const handleGiftSend = (gift: Gift) => {
    if (sandDollars >= gift.price) {
      setSandDollars(prev => prev - gift.price)
      setChatMessages([...chatMessages, { sender: "user", content: `Sent a gift: ${gift.emoji} ${gift.name}` }])
      // Mock response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: "platypus", content: `Thanks for the ${gift.name}! It's egg-cellent!` }])
      }, 1000)
    } else {
      alert("Not enough sand dollars!")
    }
  }

  const handleGifSearch = () => {
    // Mock GIF search
    setChatMessages([...chatMessages, { sender: "user", content: "🖼️ [Animated GIF]" }])
  }

  const handleBurn = () => {
    setMoonstones(prev => prev + 10)
    setSelectedPlatypus(null)
    setCurrentPage("main")
    alert(`You burned ${selectedPlatypus?.name} and received 10 moonstones!`)
  }

  const handleWalletCreation = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!authenticated) {
        await login();
      }
      setWalletCreated(true);
      setStep("disclaimer");
    } catch (error) {
      setError("Failed to connect wallet. Please try again.");
      console.error('Wallet creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "app-check":
        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">Install Platypus Passions™</h2>
              <p className="mb-6 text-pink-200">For the full Web3 experience, install our app on your home screen!</p>
              <Button onClick={handleInstallApp} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                Install App
              </Button>
            </CardContent>
          </Card>
        )
      case "age-check":
        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">Age Verification</h2>
              <p className="mb-6 text-pink-200">You must be 18 or older to enter Platypus Passions™.</p>
              <p className="mb-6 text-pink-200">If you can't handle a game of Cards Against Humanity, Secret Hitler, or an episode of South Park, then please turn around.</p>
              <Button onClick={handleAgeVerification} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                I am 18 or older
              </Button>
            </CardContent>
          </Card>
        )
      case "wallet-creation":
        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">Web3 Wallet Creation</h2>
              <p className="mb-6 text-pink-200">
                Brace yourself for the thrilling adventure of Web3 wallet creation! It's like solving a Rubik's cube blindfolded while riding a unicycle. But don't worry, it's totally worth it for the chance to date a digital platypus!
              </p>
              <Button 
                onClick={handleWalletCreation} 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {authenticated ? "Continue to Disclaimer" : "I'm Ready for the Web3 Rollercoaster!"}
              </Button>
            </CardContent>
          </Card>
        );
      case "disclaimer":
        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">Warning</h2>
              <ul className="mb-6 space-y-2">
                {disclaimerItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-xl">{item.emoji}</span>
                    <span className="text-pink-200 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="accept" 
                  checked={isDisclaimerAccepted} 
                  onCheckedChange={(checked: boolean) => setIsDisclaimerAccepted(checked)} 
                />
                <Label htmlFor="accept" className="text-pink-200">I accept these terms and conditions</Label>
              </div>
              <Button onClick={handleDisclaimerAcceptance} disabled={!isDisclaimerAccepted} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                Enter Platypus Passions™
              </Button>
            </CardContent>
          </Card>
        )
      case "welcome":
      case "choose-type":
        const steps = [
          {
            title: "Welcome to Platypus Passions™",
            content: "Where bills meet thrills in the digital stream of love!",
          },
          {
            title: "Pick Your Platypus Persona",
            content: "Which egg-laying, milk-sweating heartthrob are you after?",
          },
        ]
        const currentStep = step === "welcome" ? 0 : 1

        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">{steps[currentStep].title}</h2>
              <p className="mb-6 text-pink-200">{steps[currentStep].content}</p>
              {currentStep === 1 && (
                <RadioGroup value={platypusType} onValueChange={setPlatypusType} className="mb-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="zen" id="zen" className="sr-only" />
                    <Label htmlFor="zen" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-900/50 hover:bg-purple-800/50 transition-colors">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pope-zVFQucYzC10WS7cj8zAqfhO7E5Bj7F.png"
                          alt="Zen Platypus"
                          width={80}
                          height={80}
                          className="rounded-full border-2 border-pink-400"
                        />
                        <div>
                          <p className="font-semibold text-pink-300">Zen Platypus</p>
                          <p className="text-sm text-pink-200">Mindful bill, playful tail. Seeking a partner for tantric egg-laying.</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="rebel" id="rebel" className="sr-only" />
                    <Label htmlFor="rebel" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-4 p-4 rounded-lg bg-purple-900/50 hover:bg-purple-800/50 transition-colors">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/think-NKsVlrIyiQDzgcnf47emCuPKbQTzfX.png"
                          alt="Rebel Platypus"
                          width={80}
                          height={80}
                          className="rounded-full border-2 border-pink-400"
                        />
                        <div>
                          <p className="font-semibold text-pink-300">Rebel Platypus</p>
                          <p className="text-sm text-pink-200">Bad bill energy. Looking for a partner to break all the laws of nature with.</p>
                        </div>
                
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              )}
              <Button 
                onClick={handleNext} 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                disabled={currentStep === 1 && !platypusType}
              >
                {currentStep === 0 ? "Dive Deeper" : "Find My Platypus Paramour"}
              </Button>
            </CardContent>
          </Card>
        )
      case "loading":
        return (
          <Card className="bg-black/30 backdrop-blur-md border-none text-pink-100">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-400">Finding Your Perfect Match</h2>
              <p className="mb-6 text-pink-200">
                Hang tight, you saucy {platypusType} seeker! We're diving deep into the gene pool to find your perfect platypus match.
              </p>
              <div className="w-full h-4 bg-purple-900/50 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-pink-300">{loadingProgress}% Complete</p>
            </CardContent>
          </Card>
        )
      case "dating-app":
        return (
          <>
            {currentPage === "main" && (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProfile}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 mb-6"
                  >
                    <div className="h-64 bg-gray-700 flex items-center justify-center">
                      <Image
                        src={`/api/render-platypus?traits=${encodeURIComponent(
                          JSON.stringify({
                            skin: profiles[currentProfile].image.Skin.image.split('/').pop()?.replace('.png', ''),
                            background: profiles[currentProfile].image.Background.image.split('/').pop()?.replace('.png', '')
                          })
                        )}`}
                        alt={profiles[currentProfile].name}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-white">{profiles[currentProfile].name}, {profiles[currentProfile].age}</h2>
                        <Badge variant="destructive" className="animate-pulse">{profiles[currentProfile].compatibility}</Badge>
                      </div>
                      <p className="text-gray-400 mb-4">{profiles[currentProfile].bio}</p>
                      <p className="text-gray-400 mb-4">Alignment: {profiles[currentProfile].alignment}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profiles[currentProfile].traits.map((trait, index) => (
                          <Badge key={index} variant="outline" className="text-green-400 border-green-400">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button size="lg" variant="outline" className="rounded-full bg-red-600 hover:bg-red-700 text-white" onClick={() => handleSwipe("left")}>
                    <X className="w-6 h-6" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleSwipe("right")}>
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
              </>
            )}
            {currentPage === "chat" && (
              <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 p-4 h-[calc(100%-4rem)]">
                {selectedPlatypus ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" onClick={() => setSelectedPlatypus(null)}>
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Image
                          src={`https://picsum.photos/seed/${selectedPlatypus.name}/50/50`}
                          alt={selectedPlatypus.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <h3 className="font-semibold text-white">{selectedPlatypus.name}</h3>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                          <Button variant="ghost" className="w-full justify-start" onClick={handleBurn}>
                            <Flame className="w-4 h-4 mr-2" /> Burn Contact
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="relative h-[calc(100%-8rem)]">
                      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-800 to-transparent z-10"></div>
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-800 to-transparent z-10"></div>
                      <ScrollArea className="h-full pr-4" style={{ overflow: 'overlay' }}>
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                              {msg.content}
                            </span>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Gift className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                          {gifts.map((gift) => (
                            <Button key={gift.name} variant="ghost" className="w-full justify-start" onClick={() => handleGiftSend(gift)}>
                              <span className="mr-2">{gift.emoji}</span> {gift.name} ({gift.price} 🐚)
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                      <Button variant="ghost" size="sm" onClick={handleGifSearch}>
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                      <Input 
                        placeholder="Type a message..." 
                        className="flex-grow" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="relative h-full">
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-800 to-transparent z-10"></div>
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-800 to-transparent z-10"></div>
                    <ScrollArea className="h-full pr-4" style={{ overflow: 'overlay' }}>
                      <h2 className="text-2xl font-semibold mb-4 text-pink-400">Chats</h2>
                      {profiles.map((profile, index) => (
                        <div key={index} className="flex items-center space-x-4 p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedPlatypus(profile)}>
                          <Image
                            src={`https://picsum.photos/seed/${profile.name}/50/50`}
                            alt={profile.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-white">{profile.name}</p>
                            <p className="text-sm text-gray-400">{profile.traits[0]}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
            {currentPage === "inventory" && (
              <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 p-4 h-[calc(100%-4rem)]">
                <h2 className="text-2xl font-semibold mb-4 text-pink-400">Your Inventory</h2>
                <p className="text-gray-400 mb-4">Manage your collected items</p>
                <div className="relative h-full">
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-800 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-800 to-transparent z-10"></div>
                  <ScrollArea className="h-full pr-4" style={{ overflow: 'overlay' }}>
                    {gifts.map((gift, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{gift.emoji}</span>
                          <span className="text-white">{gift.name}</span>
                        </div>
                        <Badge>x1</Badge>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            )}
            {currentPage === "marketplace" && (
              <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 p-4 h-[calc(100%-4rem)]">
                <h2 className="text-2xl font-semibold mb-4 text-pink-400">Marketplace</h2>
                <p className="text-gray-400 mb-4">Buy and sell items for sand dollars</p>
                <div className="relative h-full">
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-800 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-800 to-transparent z-10"></div>
                  <ScrollArea className="h-full pr-4" style={{ overflow: 'overlay' }}>
                    {gifts.map((gift, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{gift.emoji}</span>
                          <span className="text-white">{gift.name}</span>
                        </div>
                        <Button size="sm">Buy for {gift.price * 2} 🐚</Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            )}
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <GlobalStyle />
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-[375px] h-[812px] bg-black rounded-[55px] overflow-hidden shadow-xl border-[14px] border-purple-800 relative">
          <div className="w-full h-full bg-gradient-to-b from-purple-900 via-pink-800 to-purple-900 pt-6 px-4 pb-4 flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <h1 className="text-3xl font-bold text-center text-pink-300 mb-6 animate-pulse">Platypus Passions™</h1>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step + currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
            {step === "dating-app" && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300" onClick={() => setCurrentPage("marketplace")}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    {sandDollars} 🐚
                  </Button>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300" onClick={() => setCurrentPage("marketplace")}>
                    <Zap className="w-4 h-4 mr-1" />
                    {moonstones} 🌙
                  </Button>
                </div>
                <div className="flex justify-between mt-4 bg-gray-800 p-2 rounded-t-xl">
                  <Button variant="ghost" className={`text-purple-400 hover:text-purple-300 ${currentPage === "chat" ? "bg-purple-900/50" : ""}`} onClick={() => setCurrentPage("chat")}>
                    <MessageCircle className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" className={`text-blue-400 hover:text-blue-300 ${currentPage === "main" ? "bg-blue-900/50" : ""}`} onClick={() => setCurrentPage("main")}>
                    <Search className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" className={`text-green-400 hover:text-green-300 ${currentPage === "inventory" ? "bg-green-900/50" : ""}`} onClick={() => setCurrentPage("inventory")}>
                    <Package className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" className={`text-red-400 hover:text-red-300 ${currentPage === "marketplace" ? "bg-red-900/50" : ""}`} onClick={() => setCurrentPage("marketplace")}>
                    <Zap className="w-6 h-6" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}