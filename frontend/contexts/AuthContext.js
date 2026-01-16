'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Verify token is still valid
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`
        }
      })
      setUser(response.data.user)
      setToken(tokenToVerify)
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })
      
      const { user: newUser, token: newToken } = response.data
      
      // Store token and user in localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      setToken(newToken)
      setUser(newUser)
      
      return { user: newUser, token: newToken }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create account')
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      const { user: loggedInUser, token: newToken } = response.data
      
      // Store token and user in localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      
      setToken(newToken)
      setUser(loggedInUser)
      
      return { user: loggedInUser, token: newToken }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to sign in')
    }
  }

  const signOut = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
