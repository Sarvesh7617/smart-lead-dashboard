import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, createRoutesFromElements, Route,RouterProvider } from 'react-router-dom'
import Login from './component/Login.tsx';
import ProtectedRoute from './utils/ProtectRoute.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Register from './component/Register.tsx';



const Router=createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      />
    </>
  )
)




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={Router}/>
    </AuthProvider>
  </StrictMode>,
)
