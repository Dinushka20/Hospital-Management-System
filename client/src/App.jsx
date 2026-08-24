import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import DoctorDetail from './pages/DoctorDetail';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import Billing from './pages/Billing';
import BillForm from './pages/BillForm';
import BillDetail from './pages/BillDetail';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/edit" element={<PatientForm />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/new" element={<DoctorForm />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/doctors/:id/edit" element={<DoctorForm />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/billing/new" element={<BillForm />} />
            <Route path="/billing/:id" element={<BillDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
