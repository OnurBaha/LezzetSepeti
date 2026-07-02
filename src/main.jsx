import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store/index.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#0f172a',
              color: '#34d399',
              border: '1px solid rgba(52,211,153,0.2)',
            },
            iconTheme: { primary: '#34d399', secondary: '#0f172a' },
          },
          error: {
            style: {
              background: '#0f172a',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.2)',
            },
            iconTheme: { primary: '#f87171', secondary: '#0f172a' },
          },
        }}
      />
    </Provider>
  </StrictMode>,
)

