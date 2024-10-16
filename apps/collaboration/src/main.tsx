import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Collaboration from '.'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Collaboration />
  </StrictMode>
)
