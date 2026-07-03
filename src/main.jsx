import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MouseFollower } from 'react-mouse-follower'
import ShopContextProvider from './context/ShopContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import MouseFollowerSetup from './components/MouseFollowerSetup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ShopContextProvider>
    <MouseFollower />
    <MouseFollowerSetup />
    <App />
    </ShopContextProvider>
    </AuthProvider>
  </StrictMode>,
)
