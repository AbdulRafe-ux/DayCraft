import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Icon from '../components/Icons';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { useAuth } from '../context/AuthContext';

// Illustrative sample content for the preview only. It is clearly labelled as a sample.
const SAMPLE_TASKS = [
  { title: 'Submit the DBMS lab record', priority: 'High', status: 'In Progress' },
  { title: 'Revise unit 3 notes', priority: 'Medium', status: 'Pending' },
  { title: 'Book the library slot', priority: 'Low', status: 'Completed' },
];

const FEATURES = [
  { icon: 'layers', title: 'Organise every task', text: 'Group tasks into categories such as Work, Study, Personal, Health and Finance, and add notes so nothing lives only in your head.' },
  { icon: 'flag', title: 'Set clear priorities', text: 'Mark each task Low, Medium or High and sort your list by priority to see what deserves your attention first.' },
  { icon: 'calendar', title: 'Keep deadlines in sight', text: 'Give tasks a due date. Anything past its date and still open is flagged as overdue so it cannot slip by.' },
  { icon: 'chart', title: 'See your progress', text: 'Your dashboard counts total, pending, in-progress and completed tasks straight from your saved data.' },
];

const STEPS = [
  { title: 'Create your account', text: 'Sign up with your name, email and a password. Your tasks stay private to you.' },
  { title: 'Add your tasks', text: 'Write down what needs doing, then set a category, priority, due date and status.' },
  { title: 'Work through the list', text: 'Search, filter and tick tasks off. Your progress updates as you go.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-nav">
        <div className="container inner">
          <Logo />
          <nav className="nav-links" aria-label="Page sections">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="nav-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">Open dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main">
        <div className="container hero">
          <div>
            <h1>Make Your Days Count.</h1>
            <p className="hero-lede">
              DayCraft is a personal task manager for the work in front of you. Capture what needs doing, rank it by priority, set a due date, and watch your finished work add up.
            </p>
            <div className="hero-actions">
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                {user ? 'Open your dashboard' : 'Create your account'}
              </Link>
              {!user && <Link to="/login" className="btn btn-secondary btn-lg">Log in</Link>}
            </div>
            <p className="hero-note">All you need is a name, an email and a password.</p>
          </div>

          <div>
            <div className="preview" aria-hidden="true">
              <div className="preview-bar"><i /><i /><i /><b>Today</b></div>
              <div className="preview-body">
                <div className="preview-stats">
                  <div className="preview-stat accent"><strong>3</strong><span>Total</span></div>
                  <div className="preview-stat"><strong>1</strong><span>Pending</span></div>
                  <div className="preview-stat"><strong>1</strong><span>Completed</span></div>
                </div>
                <div className="progress"><span style={{ width: '33%' }} /></div>
                {SAMPLE_TASKS.map((t) => (
                  <div className="preview-task" key={t.title}>
                    <span className={`preview-tick ${t.status === 'Completed' ? 'on' : ''}`}>
                      {t.status === 'Completed' && <Icon name="check" size={14} />}
                    </span>
                    <span className={`title ${t.status === 'Completed' ? 'done' : ''}`}>{t.title}</span>
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </div>
            <p className="preview-caption">Sample tasks shown for illustration. Your dashboard shows your own saved tasks.</p>
          </div>
        </div>

        <section className="section container" id="features" aria-labelledby="features-title">
          <div className="section-head">
            <h2 id="features-title">Everything a day needs, and nothing it doesn't.</h2>
            <p>DayCraft keeps to the essentials so adding a task takes seconds and your list stays easy to read.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <article className="feature" key={f.title}>
                <div className="feature-icon"><Icon name={f.icon} size={24} /></div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section band" id="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <div className="section-head">
              <h2 id="how-title">How DayCraft works</h2>
              <p>Three steps from a blank page to a clear plan.</p>
            </div>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.title}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="band-cta">
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                {user ? 'Open your dashboard' : 'Get started'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <Logo size={32} />
              <p>Make Your Days Count.</p>
            </div>
            <div className="footer-links">
              <nav aria-label="Product">
                <h2>Product</h2>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How it works</a></li>
                </ul>
              </nav>
              <nav aria-label="Account">
                <h2>Account</h2>
                <ul>
                  <li><Link to="/login">Log in</Link></li>
                  <li><Link to="/register">Create an account</Link></li>
                </ul>
              </nav>
            </div>
          </div>
          <p className="footer-legal">© {new Date().getFullYear()} DayCraft. A MERN stack micro project.</p>
        </div>
      </footer>
    </>
  );
}
