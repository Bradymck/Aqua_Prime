import { playThunkSound } from './audio'

export const emitEmojis = (event: React.MouseEvent, phase: string) => {
  const emojis = {
    connect: ['🛸', '🌕', '📡', '🔗', '💫', '✨', '🚀'],
    collect: ['🛸', '💧', '🎮', '💎', '🦆', '🎲', '🔋'],  
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
      if (emoji.parentNode === document.body) {
        document.body.removeChild(emoji);
      }
    };
  }
}