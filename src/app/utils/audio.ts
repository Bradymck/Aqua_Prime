export const playClickSound = () => {
  const audio = new Audio('/audio/click.wav')
  audio.volume = 0.1
  audio.play()
}

export const playFireSound = () => {
  // Implement fire sound playing logic here
  console.log('Playing fire sound');
}

export const stopFireSound = () => {
  // Implement fire sound stopping logic here
  console.log('Stopping fire sound');
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