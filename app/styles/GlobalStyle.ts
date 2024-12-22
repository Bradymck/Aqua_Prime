import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`