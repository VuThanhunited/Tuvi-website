import './HomeBanner.css';

export default function HomeBanner() {
  return (
    <section className="qtv-hero-banner" id="home-banner" aria-label="Quán Tử Vi Banner">
      {/* Decorative cloud/mist shapes */}
      <div className="qtv-banner-clouds">
        <span className="qtv-cloud qtv-cloud-left" />
        <span className="qtv-cloud qtv-cloud-right" />
      </div>

      {/* Center content */}
      <div className="qtv-banner-content">
        {/* Left ornament */}
        <div className="qtv-banner-ornament qtv-banner-ornament-left">
          <svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#d5b473" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="40" cy="40" r="26" fill="none" stroke="#d5b473" strokeWidth="1" />
            <text x="40" y="47" textAnchor="middle" fontFamily="serif" fontSize="26" fill="#d5b473">☯</text>
          </svg>
        </div>

        {/* Title */}
        <div className="qtv-banner-title-block">
          <h1 className="qtv-banner-title">Quán Tử Vi</h1>
          <p className="qtv-banner-subtitle">Luận giải Tử Vi – Định hướng Vận Mệnh</p>
        </div>

        {/* Right ornament */}
        <div className="qtv-banner-ornament qtv-banner-ornament-right">
          <svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#d5b473" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="40" cy="40" r="26" fill="none" stroke="#d5b473" strokeWidth="1" />
            <text x="40" y="47" textAnchor="middle" fontFamily="serif" fontSize="26" fill="#d5b473">✦</text>
          </svg>
        </div>
      </div>

      {/* Bottom gold border line */}
      <div className="qtv-banner-bottom-line" />
    </section>
  );
}
