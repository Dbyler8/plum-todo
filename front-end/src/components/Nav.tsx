import './Nav.css'

type TPage = 'board' | 'profile'

type TNavProps = {
  currentPage: TPage
  onNavigate: (page: TPage) => void
}

function Nav({ currentPage, onNavigate }: TNavProps) {
  return (
    <header className="top-nav">
      <button
        type="button"
        className={`nav-button btn btn--secondary home-button ${currentPage === 'board' ? 'is-active' : ''}`}
        aria-label="Home"
        onClick={() => onNavigate('board')}
      >
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`nav-button accent-control interactive-control user-button ${currentPage === 'profile' ? 'is-active' : ''}`}
        aria-label="User profile"
        onClick={() => onNavigate('profile')}
      >
        <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          <path d="M4.5 19.25a7.5 7.5 0 0 1 15 0" />
        </svg>
      </button>
    </header>
  )
}

export default Nav