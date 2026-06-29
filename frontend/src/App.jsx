import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceSurvey from './pages/VoiceSurvey'
import MedicalScribe from './pages/MedicalScribe'
import AdminQuestions from './pages/AdminQuestions'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/survey/voice" element={<VoiceSurvey />} />
        <Route path="/scribe" element={<MedicalScribe />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
