import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <Logo />
        <div className="auth-intro">
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist or has moved.</p>
        </div>
        <Link to="/" className="btn btn-primary btn-lg">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
