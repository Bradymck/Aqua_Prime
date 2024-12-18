export const playClickSound = () => {
    const audio = new Audio('/audio/click.wav')
    audio.volume = 0.1
    audio.play()
  }
  
  export const playPopSound = () => {
    const audio = new Audio('/audio/pop.wav')
    audio.volume = 0.1
    audio.play()
  }
  
  export const playThunkSound = () => {
    const audio = new Audio('/audio/thunk.wav')
    audio.volume = 0.1
    audio.play()
  }
  
  export const playJewelSound = () => {
    const audio = new Audio('/audio/jewel.wav')
    audio.volume = 0.1
    audio.play()
  }

  // This function is implemented in app/utils/emoji.ts and imported where needed
  export const emitEmojis = () => {
    throw new Error('emitEmojis should be imported from app/utils/emoji.ts');
  }
