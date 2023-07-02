import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Navbar from './Navbar/Navbar'
import Router from './Router'
import AuthProvider from '../auth/AuthProvider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer newestOnTop={true} theme="dark" autoClose={4000} closeOnClick={true} position="top-left"/>
    <AuthProvider>
      <Navbar/>
      <BrowserRouter>
        <Router/>      
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
