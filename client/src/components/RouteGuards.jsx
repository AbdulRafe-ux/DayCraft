import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PageLoader() {
  return (
    <div className="page-loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>Loading DayCraft…</p>
    </div>
  );
}

/** Only logged-in users may see the children; everyone else goes to /login. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Login/register pages: logged-in users are sent straight to the dashboard. */
export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
