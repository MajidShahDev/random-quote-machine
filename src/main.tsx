import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App/App.tsx'
// import Colors from './Colors.tsx'
// import Loader from './Loader.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Colors /> */}
    {/* <Loader /> */}
  </StrictMode>,
)
