import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceSurvey from './pages/VoiceSurvey'
import MedicalScribe from './pages/MedicalScribe'
import AdminQuestions from './pages/AdminQuestions'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/survey/voice" element={<VoiceSurvey />} />
        <Route path="/scribe" element={<MedicalScribe />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
      </Routes>
    </BrowserRouter>
  )
}
