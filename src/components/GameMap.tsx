import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '../components/ui/button'
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Camera, Mic, MonitorUp, Send, Sparkles, Lock, Unlock, ZoomIn, ZoomOut, Pickaxe, Eye, EyeOff, Flame, MessageSquare, PinIcon, Shuffle } from "lucide-react"

const GRID_SIZE = 20;
const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const MAX_POWER = 100;
const POWER_DRAIN_RATE = 2;
const MOVE_COOLDOWN = 200;
const MINING_DURATION = 3000;
const DICE_ROLL_DURATION = 2000;
const LIGHT_RADIUS = 3;

const shipImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20-%202023-08-08T023108.208-fGxDWHxwCdRzaG2wCXi2oAPka3664k.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20-%202024-01-29T032654.542-i4IYXyxszSNiLFO6wNd0REcoEMSf4C.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20-%202024-01-30T011316.580-QVJhVhU5sJNdwIWfFEBuyjvpEw0o57.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/moonstone_maverick.Token784hpIN6ob3eKB1O%20(2)-XS8bRHHEnkv7KQF2w56oSMFgybqWEK.webp"
]

const shipNames = [
  "McPlatypus",
  "Detective Duck",
  "Burger Beaver",
  "Sherlock Quack"
]

const thrusterColors = [
  "from-red-500 to-yellow-500",
  "from-brown-500 to-yellow-500",
  "from-red-500 to-yellow-500",
  "from-brown-500 to-yellow-500"
]

const npcImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-nvcKGdWB7l4MqF2rFNL3r2oDoHI0I2.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-S9c8FDwKjfesguFltd87kb7MgCBmJT.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20-%202023-08-08T023108.208-fGxDWHxwCdRzaG2wCXi2oAPka3664k.png"
]

interface InteractiveNodeProps {
  node: {
    id: number;
    x: number;
    y: number;
    requiredStake: number;
    stakedSandDollars: number;
    image: string;
  };
  onInteract: (node: {
    id: number;
    x: number;
    y: number;
    requiredStake: number;
    stakedSandDollars: number;
    image: string;
  }) => void;
  stakedSandDollars: number;
}

function InteractiveNode({ node, onInteract, stakedSandDollars }: InteractiveNodeProps) {
  return (
    <div 
      className="absolute w-6 h-6 bg-blue-500 rounded-full animate-pulse cursor-pointer"
      style={{ left: `${node.x * GRID_SIZE}px`, top: `${node.y * GRID_SIZE}px` }}
      onClick={() => onInteract(node)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-xs">{stakedSandDollars}/{node.requiredStake}</span>
      </div>
    </div>
  );
}

interface MapShroudProps {
  revealedAreas: Array<{ x: number; y: number; width: number; height: number }>;
  isGameMaster: boolean;
}

function MapShroud({ revealedAreas, isGameMaster }: MapShroudProps) {
  if (isGameMaster) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: MAP_HEIGHT }).map((_, y) => (
        Array.from({ length: MAP_WIDTH }).map((_, x) => {
          const isRevealed = revealedAreas.some(area => 
            x >= area.x && x < area.x + area.width && y >= area.y && y < area.y + area.height
          );
          return (
            <div
              key={`${x}-${y}`}
              className={`absolute ${isRevealed ? 'bg-transparent' : 'bg-black'}`}
              style={{
                left: `${x * GRID_SIZE}px`,
                top: `${y * GRID_SIZE}px`,
                width: `${GRID_SIZE}px`,
                height: `${GRID_SIZE}px`,
                transition: 'background-color 0.5s ease',
              }}
            />
          );
        })
      ))}
    </div>
  );
}

interface MovablePanelProps {
  children: React.ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number | string; height: number | string };
  minWidth: number;
  minHeight: number;
  isPinned: boolean;
  onPin: () => void;
}

function MovablePanel({ children, defaultPosition, defaultSize, minWidth, minHeight, isPinned, onPin }: MovablePanelProps) {
  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      disableDragging={isPinned}
      dragHandleClassName="drag-handle"
    >
      <div className="bg-gray-800 bg-opacity-80 rounded-lg p-2 h-full flex flex-col relative">
        <div className="drag-handle absolute top-0 left-0 right-0 h-6 cursor-move bg-gray-700 rounded-t-lg" />
        <Button
          className="absolute top-1 right-1 p-1"
          onClick={onPin}
        >
          <PinIcon className={`h-4 w-4 ${isPinned ? 'text-yellow-400' : 'text-gray-400'}`} />
        </Button>
        {children}
      </div>
    </Rnd>
  );
}

interface Team {
  id: number;
  x: number;
  y: number;
  canMove: boolean;
  size: number;
  power: number;
  moonstones: number;
  sandDollars: number;
  currentMessage: string;
  players: Array<{ id: number; name: string; nfts: NFT[] }>;
}

interface NFT {
  id: number;
  name: string;
  image: string;
  count: number;
  // Add any other properties that an NFT might have
}

export default function GameMap() {
  const [chatMessages, setChatMessages] = useState([
    { user: 'Alice', message: 'Love the new NFT design!' },
    { user: 'Bob', message: 'How much for this one?' },
    { user: 'Charlie', message: 'Can\'t wait to see it minted!' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: 1, 
      x: 0, 
      y: 0, 
      canMove: true, 
      size: 1, 
      power: MAX_POWER, 
      moonstones: 100, 
      sandDollars: 50, 
      currentMessage: '',
      players: [
        { id: 1, name: 'Player 1', nfts: [] },
        { id: 2, name: 'Player 2', nfts: [] },
      ]
    },
    { 
      id: 2, 
      x: MAP_WIDTH - 1, 
      y: 0, 
      canMove: true, 
      size: 1, 
      power: MAX_POWER, 
      moonstones: 75, 
      sandDollars: 30, 
      currentMessage: '',
      players: [
        { id: 3, name: 'Player 3', nfts: [] },
        { id: 4, name: 'Player 4', nfts: [] },
      ]
    },
  ])
  const [isGameMaster, setIsGameMaster] = useState(true)
  const [isDiceRolling, setIsDiceRolling] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [isMining, setIsMining] = useState(false)
  const [interactiveNodes, setInteractiveNodes] = useState([
    { id: 1, x: 10, y: 15, requiredStake: 100, stakedSandDollars: 0, image: npcImages[0] },
    { id: 2, x: 25, y: 7, requiredStake: 200, stakedSandDollars: 0, image: npcImages[1] },
    { id: 3, x: 40, y: 22, requiredStake: 300, stakedSandDollars: 0, image: npcImages[2] },
  ])
  const [revealedAreas, setRevealedAreas] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [isPanelsPinned, setIsPanelsPinned] = useState({
    chat: false,
    adminControls: false,
    teams: Array(2).fill(false),
    npc: false,
    gameMaster: false,
    mapControls: false,
  })

  const [currentNPC, setCurrentNPC] = useState(npcImages[0])
  const [isGameMasterView, setIsGameMasterView] = useState(false)
  const lastMoveTimeRef = useRef(0)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedTeams = teams.map(team => 
        team.id === selectedTeam ? { ...team, currentMessage: newMessage } : team
      )
      setTeams(updatedTeams)
      setChatMessages([...chatMessages, { user: `Team ${selectedTeam}`, message: newMessage }])
      setNewMessage('')

      // Clear the message after 5 seconds
      setTimeout(() => {
        setTeams(teams => teams.map(team => 
          team.id === selectedTeam ? { ...team, currentMessage: '' } : team
        ))
      }, 5000)
    }
  }

  const moveTeam = useCallback((teamId: number, dx: number, dy: number) => {
    const currentTime = Date.now()
    if (currentTime - lastMoveTimeRef.current < MOVE_COOLDOWN) {
      return // Ignore move if cooldown hasn't elapsed
    }
    lastMoveTimeRef.current = currentTime

    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === teamId && team.canMove && team.power > 0) {
        const newX = Math.max(0, Math.min(MAP_WIDTH - 1, team.x + dx))
        const newY = Math.max(0, Math.min(MAP_HEIGHT - 1, team.y + dy))
        
        const hasMoved = newX !== team.x || newY !== team.y
        
        const powerDrain = hasMoved ? (Math.abs(dx) + Math.abs(dy)) * POWER_DRAIN_RATE : 0
        const newPower = Math.max(0, team.power - powerDrain)
        
        // Reveal area around the team
        if (hasMoved) {
          setRevealedAreas(prev => [
            ...prev,
            {
              x: Math.max(0, newX - LIGHT_RADIUS),
              y: Math.max(0, newY - LIGHT_RADIUS),
              width: LIGHT_RADIUS * 2 + 1,
              height: LIGHT_RADIUS * 2 + 1
            }
          ])
        }
        
        return {
          ...team,
          x: newX,
          y: newY,
          power: newPower,
          canMove: newPower > 0
        }
      }
      return team
    }))
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedTeam(null);
      return;
    }
    if (!selectedTeam) return;
    switch (e.key.toLowerCase()) {
      case 'w': moveTeam(selectedTeam, 0, -1); break;
      case 'a': moveTeam(selectedTeam, -1, 0); break;
      case 's': moveTeam(selectedTeam, 0, 1); break;
      case 'd': moveTeam(selectedTeam, 1, 0); break;
    }
  }, [moveTeam, selectedTeam])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const toggleTeamMovement = (teamId: number) => {
    setTeams(prevTeams => prevTeams.map(team => 
      team.id === teamId ? { ...team, canMove: !team.canMove && team.power > 0 } : team
    ))
  }

  const rollDice = (teamId: number) => {
    if (isDiceRolling) return;
    setIsDiceRolling(true);
    const audio = new Audio('/dice-roll.mp3');
    audio.play();
    
    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setDiceResult(result);
      setChatMessages(prev => [...prev, { user: 'System', message: `Team ${teamId} rolled a ${result}` }]);
      setIsDiceRolling(false);
    }, DICE_ROLL_DURATION);
  };

  const finishMove = (teamId: number) => {
    setIsMining(true);
    const audio = new Audio('/mining-sound.mp3');
    audio.play();

    setTimeout(() => {
      setTeams(prevTeams => prevTeams.map(team => 
        team.id === teamId ? { ...team, moonstones: team.moonstones + 50, power: MAX_POWER, canMove: true } : team
      ));
      setIsMining(false);
      setChatMessages(prev => [...prev, { user: 'System', message: `Team ${teamId} mined 50 Moonstones and recharged!` }]);
    }, MINING_DURATION);
  };

  const togglePanelPin = (panelName: keyof typeof isPanelsPinned, index: number | null = null) => {
    setIsPanelsPinned(prev => ({
      ...prev,
      [panelName]: index !== null && Array.isArray(prev[panelName])
        ? prev[panelName].map((pin: boolean, i: number) => i === index ? !pin : pin)
        : !prev[panelName]
    }));
  };

  const shuffleNPC = () => {
    const randomIndex = Math.floor(Math.random() * npcImages.length);
    setCurrentNPC(npcImages[randomIndex]);
  };

  const toggleGameMasterView = () => {
    setIsGameMasterView(!isGameMasterView);
  };

  const activateStoryNode = (node: { id: number; x: number; y: number; requiredStake: number; stakedSandDollars: number; image: string }) => {
    const teamIndex = teams.findIndex(team => team.id === selectedTeam);
    if (teamIndex === -1) return;

    const team = teams[teamIndex];
    if (team.sandDollars < node.requiredStake - node.stakedSandDollars) {
      alert("Not enough Sand Dollars to activate this node!");
      return;
    }

    const stakeAmount = node.requiredStake - node.stakedSandDollars;
    const updatedTeams = [...teams];
    updatedTeams[teamIndex] = {
      ...team,
      sandDollars: team.sandDollars - stakeAmount
    };

    const updatedNodes = interactiveNodes.map(n => 
      n.id === node.id ? { ...n, stakedSandDollars: n.requiredStake } : n
    );

    setTeams(updatedTeams);
    setInteractiveNodes(updatedNodes);

    // Show NPC image overlay
    // This is a placeholder for the actual implementation
    alert(`NPC image overlay: ${node.image}`);
  };
  
  const getMostHeldNFT = (): NFT => {
    const allNFTs = teams.flatMap(team => team.players.flatMap(player => player.nfts));
    if (allNFTs.length === 0) {
      return { id: 0, name: '', image: '', count: 0 };
    }
    return allNFTs.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main map area */}
      <div className="absolute inset-0">
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.5}
          maxScale={4}
          wheel={{ step: 0.05 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <MovablePanel
                defaultPosition={{ x: 10, y: 10 }}
                defaultSize={{ width: 'auto', height: 'auto' }}
                minWidth={200}
                minHeight={50}
                isPinned={isPanelsPinned.mapControls}
                onPin={() => togglePanelPin('mapControls')}
              >
                <div className="flex gap-2">
                  <Button className="border" onClick={() => zoomIn()}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button className="border" onClick={() => zoomOut()}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => resetTransform()}>
                    Reset
                  </Button>
                </div>
              </MovablePanel>
              <TransformComponent wrapperClass="w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AquaPrime%20Map-TsRb2rTMoSKnfUupE96Lq9FDNglpwU.png" 
                    alt="AquaPrime Map" 
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                  />
                  <MapShroud revealedAreas={revealedAreas} isGameMaster={isGameMaster} />
                  {interactiveNodes.map(node => (
                    <InteractiveNode 
                      key={node.id} 
                      node={node} 
                      onInteract={(node) => activateStoryNode(node as { id: number; x: number; y: number; requiredStake: number; stakedSandDollars: number; image: string })}
                      stakedSandDollars={node.stakedSandDollars}
                    />
                  ))}
                  {teams.map((team, index) => (
                    <div 
                      key={team.id}
                      className={`absolute transition-all duration-300 ${selectedTeam === team.id ? 'ring-2 ring-yellow-400' : ''}`}
                      style={{
                        left: `${team.x * GRID_SIZE}px`,
                        top: `${team.y * GRID_SIZE}px`,
                        width: `${GRID_SIZE * 2}px`,
                        height: `${GRID_SIZE * 2}px`,
                      }}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <div className="relative w-full h-full">
                        <Image 
                          src={shipImages[index]} 
                          alt={`Team ${team.id}`}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                        {team.canMove && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/6">
                            <div className={`w-full h-full bg-gradient-to-b ${thrusterColors[index]} clip-thruster relative overflow-hidden opacity-70`}>
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-black opacity-30"></div>
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute top-0 left-1/2 w-0.5 bg-white rounded-full"
                                  style={{
                                    height: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.5 + 0.2,
                                    animationDuration: `${Math.random() * 1 + 0.5}s`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {isMining && selectedTeam === team.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full animate-pulse">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute bg-blue-500"
                                  style={{
                                    width: '2px',
                                    height: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    top: '100%',
                                    transform: 'translateY(-100%)',
                                    opacity: Math.random() * 0.7 + 0.3,
                                    animationDuration: `${Math.random() * 0.5 + 0.2}s`,
                                    animationDelay: `${Math.random() * 0.2}s`,
                                    animationIterationCount: 'infinite',
                                    animationName: 'lightning',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {team.currentMessage && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded-lg text-sm">
                            {team.currentMessage}
                          </div>
                        )}
                        <div className="absolute top-0 right-0 w-1/4 h-1/4">
                          {getMostHeldNFT().image && (
                            <Image 
                              src={getMostHeldNFT().image} 
                              alt="Team NFT" 
                              layout="fill"
                              objectFit="contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Movable admin controls */}
      <MovablePanel
        defaultPosition={{ x: 10, y: 10 }}
        defaultSize={{ width: 'auto', height: 'auto' }}
        minWidth={300}
        minHeight={50}
        isPinned={isPanelsPinned.adminControls}
        onPin={() => togglePanelPin('adminControls')}
      >
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            <Button className="bg-white/10 hover:bg-white/20">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
            <Button className="bg-white/10 hover:bg-white/20">
              <Mic className="h-4 w-4 mr-2" />
              Mic
            </Button>
            <Button className="bg-white/10 hover:bg-white/20">
              <MonitorUp className="h-4 w-4 mr-2" />
              Screen
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Go Live
          </Button>
          <Button 
            className={`bg-white/10 hover:bg-white/20 ${isGameMaster ? 'bg-green-500' : ''}`}
            onClick={() => setIsGameMaster(!isGameMaster)}
          >
            {isGameMaster ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {isGameMaster ? 'Game Master' : 'Player View'}
          </Button>
        </div>
      </MovablePanel>

      {/* Movable team panels */}
      {teams.map((team, index) => (
        <MovablePanel
          key={team.id}
          defaultPosition={{ x: 10 + index * 160, y: window.innerHeight - 210 }}
          defaultSize={{ width: 150, height: 150 }}
          minWidth={150}
          minHeight={150}
          isPinned={isPanelsPinned.teams[index]}
          onPin={() => togglePanelPin('teams', index)}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
              <Image 
                src={shipImages[index]} 
                alt={`Team ${team.id}`}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                <div className="text-xs font-medium text-center">{shipNames[index]}</div>
              </div>
              <div className="absolute top-1 right-1 flex flex-col items-end">
                <div className="flex items-center bg-black bg-opacity-50 rounded px-1 py-0.5 text-xs">
                  <span className="text-yellow-400 mr-1">💎</span>
                  {team.moonstones}
                </div>
                <div className="flex items-center bg-black bg-opacity-50 rounded px-1 py-0.5 text-xs mt-1">
                  <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/112-riiwGHGIB8lGuWLazysny9Akijd0W9.png" alt="Sand Dollar" width={12} height={12} className="mr-1" />
                  {team.sandDollars}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between p-1 bg-black bg-opacity-50">
              <Button 
                className="bg-white/20 p-1 h-6 w-6"
                onClick={() => finishMove(team.id)}
                disabled={isMining}
              >
                <Pickaxe className="h-3 w-3" />
              </Button>
              <Button
                className="bg-white/20 p-1 h-6 w-6"
              >
                <Flame className="h-3 w-3" />
              </Button>
              <Button
                className="bg-white/20 p-1 h-6 w-6"
                onClick={() => rollDice(team.id)}
              >
                🎲
              </Button>
              <Button 
                className="bg-white/20 p-1 h-6 w-6"
              >
                <Mic className="h-3 w-3" />
              </Button>
              <Button
                className="bg-white/20 p-1 h-6 w-6"
                onClick={() => toggleTeamMovement(team.id)}
                disabled={team.power === 0}
              >
                {team.canMove ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </MovablePanel>
      ))}

      {/* Movable chat panel */}
      {isChatVisible && (
        <MovablePanel
          defaultPosition={{ x: window.innerWidth - 300, y: window.innerHeight - 400 }}
          defaultSize={{ width: 250, height: 300 }}
          minWidth={200}
          minHeight={200}
          isPinned={isPanelsPinned.chat}
          onPin={() => togglePanelPin('chat')}
        >
          <ScrollArea className="flex-1 mb-2 h-[calc(100%-40px)]">
            {chatMessages.map((msg, i) => (
              <div key={i} className="mb-1">
                <span className="font-bold text-cyan-300">{msg.user}: </span>
                <span className="text-sm">{msg.message}</span>
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-1">
            <Input 
              placeholder="Type a message..." 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-white/20 border-none placeholder-white/50 text-sm"
            />
            <Button onClick={handleSendMessage} className="bg-cyan-500 hover:bg-cyan-600 p-1">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </MovablePanel>
      )}

      {/* NPC Panel */}
      <MovablePanel
        defaultPosition={{ x: window.innerWidth - 200, y: 50 }}
        defaultSize={{ width: 180, height: 240 }}
        minWidth={180}
        minHeight={240}
        isPinned={isPanelsPinned.npc}
        onPin={() => togglePanelPin('npc')}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Image src={currentNPC} alt="NPC" width={128} height={128} className="w-32 h-32 object-cover rounded-full mb-4" />
          <Button onClick={shuffleNPC} className="mt-2">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle NPC
          </Button>
        </div>
      </MovablePanel>

      {/* Game Master Panel */}
      <MovablePanel
        defaultPosition={{ x: window.innerWidth - 200, y: 300 }}
        defaultSize={{ width: 180, height: 100 }}
        minWidth={180}
        minHeight={100}
        isPinned={isPanelsPinned.gameMaster}
        onPin={() => togglePanelPin('gameMaster')}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/memecat-Ue5Hy5Ue5Hy5Ue5Hy5.gif" alt="Game Master" width={64} height={64} className="w-16 h-16 object-cover rounded-full mb-2" />
          <Button onClick={toggleGameMasterView} className="mt-2">
            {isGameMasterView ? 'Exit GM View' : 'Enter GM View'}
          </Button>
        </div>
      </MovablePanel>

      {/* Chat toggle button */}
      <Button
        className="fixed bottom-4 right-4 z-20"
        onClick={() => setIsChatVisible(!isChatVisible)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {isChatVisible ? 'Hide Chat' : 'Show Chat'}
      </Button>

      {/* 3D Dice */}
      {isDiceRolling && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-6xl font-bold animate-bounce">
            🎲
          </div>
        </div>
      )}
      {diceResult && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold z-50">
          {diceResult}
        </div>
      )}

      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { opacity: 0.2; }
        }
        .clip-thruster {
          clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);
        }
        @keyframes lightning {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}