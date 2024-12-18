import React, { useEffect, useRef, useState } from 'react'

interface CartoonFightCloudProps {
  width?: number
  height?: number
  onFadeOutStart?: () => void
  onComplete?: () => void
  startFadeOut: boolean
  isInteractionEnabled: boolean
}

interface Circle {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity?: number
  fadeSpeed?: number
}

interface Particle {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  life: number
}

interface Flash {
  x: number
  y: number
  radius: number
  life: number
}

interface TextBubble {
  x: number
  y: number
  text: string
  life: number
}

export default function CartoonFightCloud({
  width = 300,
  height = 300,
  onFadeOutStart,
  onComplete,
  startFadeOut,
  isInteractionEnabled,
}: CartoonFightCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const circlesRef = useRef<Circle[]>([])
  const dustCirclesRef = useRef<Circle[]>([])
  const particlesRef = useRef<Particle[]>([])
  const flashesRef = useRef<Flash[]>([])
  const textBubblesRef = useRef<TextBubble[]>([])
  const shakeRef = useRef({ x: 0, y: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainNodeRef = useRef<GainNode | null>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const fadeInDuration = 100
    const holdDuration = 1500
    const fadeOutDuration = 500
    let animationFrame: number

    const startTime = Date.now()

    const animate = () => {
      const elapsedTime = Date.now() - startTime

      if (elapsedTime < fadeInDuration) {
        setOpacity(elapsedTime / fadeInDuration)
      } else if (elapsedTime < fadeInDuration + holdDuration) {
        setOpacity(1)
      } else if (startFadeOut) {
        const fadeOutTime = elapsedTime - fadeInDuration - holdDuration
        if (fadeOutTime < fadeOutDuration) {
          setOpacity(1 - fadeOutTime / fadeOutDuration)
          if (fadeOutTime === 0 && onFadeOutStart) {
            onFadeOutStart()
          }
        } else {
          setOpacity(0)
          if (onComplete) {
            onComplete()
          }
          return
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [startFadeOut, onFadeOutStart, onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up high DPI canvas
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Initialize main circles
    circlesRef.current = Array(20).fill(0).map(() => ({
      x: Math.random() * (width * 0.8) + (width * 0.1),
      y: Math.random() * (height * 0.8) + (height * 0.1),
      radius: Math.random() * 40 + 20,
      speedX: (Math.random() - 0.5) * 4,
      speedY: (Math.random() - 0.5) * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    }))

    // Initialize dust circles
    dustCirclesRef.current = Array(25).fill(0).map(() => ({
      x: Math.random() * (width * 0.8) + (width * 0.1),
      y: Math.random() * (height * 0.8) + (height * 0.1),
      radius: Math.random() * 50 + 30,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.4 + 0.2,
      fadeSpeed: (Math.random() - 0.5) * 0.015
    }))

    // Animation loop
    let animationFrameId: number
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      // Apply shake and pulsate effect
      ctx.save()
      shakeRef.current = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
      }
      const pulsate = Math.sin(time / 200) * 0.05 + 1
      ctx.translate(width / 2 + shakeRef.current.x, height / 2 + shakeRef.current.y)
      ctx.scale(pulsate, pulsate)
      ctx.translate(-width / 2, -height / 2)

      // Draw and update dust circles
      dustCirclesRef.current.forEach((circle) => {
        updateCircle(circle, width, height)
        
        if (circle.opacity !== undefined && circle.fadeSpeed !== undefined) {
          circle.opacity += circle.fadeSpeed
          if (circle.opacity > 0.6 || circle.opacity < 0.2) {
            circle.fadeSpeed = -circle.fadeSpeed
          }
        }

        ctx.save()
        ctx.translate(circle.x, circle.y)
        ctx.rotate(circle.rotation)
        
        ctx.beginPath()
        ctx.arc(0, 0, circle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${circle.opacity})`
        ctx.fill()
        
        ctx.restore()
      })

      // Draw and update main circles
      circlesRef.current.forEach((circle) => {
        updateCircle(circle, width, height)

        ctx.save()
        ctx.translate(circle.x, circle.y)
        ctx.rotate(circle.rotation)
        
        // Fill
        ctx.beginPath()
        ctx.arc(0, 0, circle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        
        // Outline
        ctx.beginPath()
        ctx.arc(0, 0, circle.radius, 0, Math.PI * 2)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()

        // Add some "scribbles" for cartoon effect
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(Math.random() * circle.radius, Math.random() * circle.radius)
          ctx.lineTo(Math.random() * circle.radius, Math.random() * circle.radius)
          ctx.strokeStyle = 'black'
          ctx.lineWidth = 1
          ctx.stroke()
        }
        
        ctx.restore()
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life -= 16 // Assuming 60fps

        if (particle.life > 0) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = 'black'
          ctx.globalAlpha = particle.life / 1000
          ctx.fill()
          return true
        }
        return false
      })

      // Update and draw flashes
      flashesRef.current = flashesRef.current.filter((flash) => {
        flash.life -= 16 // Assuming 60fps
        if (flash.life > 0) {
          ctx.beginPath()
          ctx.arc(flash.x, flash.y, flash.radius * (1 - flash.life / 500), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${flash.life / 500})`
          ctx.fill()
          return true
        }
        return false
      })

      // Update and draw text bubbles
      textBubblesRef.current = textBubblesRef.current.filter((bubble) => {
        bubble.life -= 16 // Assuming 60fps
        if (bubble.life > 0) {
          ctx.font = '24px Arial'
          ctx.fillStyle = 'black'
          ctx.textAlign = 'center'
          ctx.fillText(bubble.text, bubble.x, bubble.y)
          return true
        }
        return false
      })

      // Occasionally add new particles, flashes, and text bubbles
      if (Math.random() < 0.1) {
        const x = Math.random() * (width * 0.8) + (width * 0.1)
        const y = Math.random() * (height * 0.8) + (height * 0.1)
        for (let i = 0; i < 5; i++) {
          particlesRef.current.push({
            x,
            y,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 10,
            speedY: (Math.random() - 0.5) * 10,
            life: Math.random() * 500 + 500
          })
        }
        flashesRef.current.push({
          x: Math.random() * (width * 0.8) + (width * 0.1),
          y: Math.random() * (height * 0.8) + (height * 0.1),
          radius: Math.random() * 20 + 10,
          life: 500
        })
        playSound('soft_impact')
      }

      const emojis = ['🐱', '🐸', '🐶', '🦍', '🔥', '🧊', '🍦', '🔫', '💣', '🚀', '👽', '🤡', '💩', '🍆', '🥔', '🗿', '👁️👄👁️', '🤔', '😂', '🥳', '🤯', '😱', '🙃', '🤪', '😎', '🦄', '🌈', '🍕', '🎉', '💯']
      if (Math.random() < 0.02) {
        textBubblesRef.current.push({
          x: Math.random() * (width * 0.8) + (width * 0.1),
          y: Math.random() * (height * 0.8) + (height * 0.1),
          text: emojis[Math.floor(Math.random() * emojis.length)],
          life: 1000
        })
        playSound('gentle_whoosh')
      }

      ctx.restore()

      animationFrameId = requestAnimationFrame(animate)
    }

    const updateCircle = (circle: Circle, width: number, height: number) => {
      circle.x += circle.speedX
      circle.y += circle.speedY
      circle.rotation += circle.rotationSpeed

      if (circle.x - circle.radius < 0 || circle.x + circle.radius > width) {
        circle.speedX *= -1
        circle.x = Math.max(circle.radius, Math.min(width - circle.radius, circle.x))
      }
      if (circle.y - circle.radius < 0 || circle.y + circle.radius > height) {
        circle.speedY *= -1
        circle.y = Math.max(circle.radius, Math.min(height - circle.radius, circle.y))
      }
    }

    const playSound = (type: 'soft_impact' | 'gentle_whoosh') => {
      if (!isInteractionEnabled || !audioContextRef.current || !masterGainNodeRef.current) return

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }

      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filterNode = audioContext.createBiquadFilter()

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(masterGainNodeRef.current)

      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(1500, audioContext.currentTime)

      oscillator.type = 'sine'
      
      if (type === 'soft_impact') {
        // Balanced bubble wrap pop sound
        oscillator.frequency.setValueAtTime(180, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.05)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.005)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08)
      } else {
        // Balanced, flatter bottle-like sound
        oscillator.frequency.setValueAtTime(160, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.01)
        
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15)
      }

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }

    const currentAudioContext = audioContextRef.current;
    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (currentAudioContext) {
        currentAudioContext.close();
      }
    };
  }, [width, height, isInteractionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
        opacity,
        transition: 'opacity 0.05s ease-in, opacity 0.5s ease-out', // Fast fade-in, normal fade-out
      }}
      className="cartoon-fight-cloud"
    />
  )
}
