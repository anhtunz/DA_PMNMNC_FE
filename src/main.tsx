import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { store } from './stores/index.ts'
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
)
