import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inline">
        <p className="footer-credit">Donovan Byler, 2026</p>
        <span className="footer-separator" aria-hidden="true">
          |
        </span>
        <a
          className="footer-icon-link interactive-control"
          href="https://github.com/dbyler8"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
        >
          <svg className="footer-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#github-icon"></use>
          </svg>
        </a>
        <span className="footer-separator" aria-hidden="true">
          |
        </span>
        <a
          className="footer-icon-link interactive-control"
          href="https://www.linkedin.com/in/donovan-byler/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
        >
          <svg className="footer-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#linkedin-icon"></use>
          </svg>
        </a>
      </div>
    </footer>
  )
}

export default Footer