import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Kalau belum login, arahkan ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kalau allowedRoles ada dan role user tidak termasuk, arahkan sesuai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect berdasarkan role yang dimiliki
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'kasir') {
      return <Navigate to="/kasir/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Kalau sudah login dan role sesuai, tampilkan halaman
  return children;
}