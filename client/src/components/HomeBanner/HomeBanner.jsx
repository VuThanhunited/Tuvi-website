import './HomeBanner.css';

export default function HomeBanner() {
  return (
    <section className="home-banner" id="home-banner">
      <div className="home-banner-bg" />
      <div className="home-banner-overlay" />
      
      {/* Floating particles */}
      <div className="banner-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="banner-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      <div className="home-banner-content">
        <h1 className="banner-title">TỬ VI - DẪN LỐI</h1>
        <p className="banner-subtitle-italic">Hiểu mình - Đổi vận - An nhiên</p>
        <p className="banner-desc">
          Khám phá vận mệnh &bull; Giải mã tương lai &bull; Sống an nhiên mỗi ngày
        </p>
      </div>

      {/* Astrological Zodiac Wheel matching mockup */}
      <div className="banner-zodiac-wheel-wrapper">
        <svg className="banner-zodiac-wheel" width="230" height="230" viewBox="0 0 200 200" fill="none" stroke="#ffd700" strokeWidth="1.5">
          {/* Outer circles */}
          <circle cx="100" cy="100" r="90" strokeDasharray="3,3" />
          <circle cx="100" cy="100" r="82" />
          
          {/* Inner circles */}
          <circle cx="100" cy="100" r="45" />
          <circle cx="100" cy="100" r="38" strokeDasharray="2,2" />
          
          {/* 12 House Spokes */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 45 * Math.cos(angle);
            const y1 = 100 + 45 * Math.sin(angle);
            const x2 = 100 + 82 * Math.cos(angle);
            const y2 = 100 + 82 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.5" stroke="#ffd700" />;
          })}
          
          {/* Center Glowing Sun with face and rays */}
          <circle cx="100" cy="100" r="18" fill="#ffd700" fillOpacity="0.1" />
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const length = i % 2 === 0 ? 9 : 5;
            const x1 = 100 + 18 * Math.cos(angle);
            const y1 = 100 + 18 * Math.sin(angle);
            const x2 = 100 + (18 + length) * Math.cos(angle);
            const y2 = 100 + (18 + length) * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.8" stroke="#ffd700" />;
          })}
          {/* Sun face detailing */}
          <circle cx="95" cy="97" r="1.2" fill="#ffd700" />
          <circle cx="105" cy="97" r="1.2" fill="#ffd700" />
          <path d="M96 103 Q100 106 104 103" strokeWidth="1.5" strokeLinecap="round" stroke="#ffd700" />
          
          {/* 12 Zodiac Constellation Symbols */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 + 15) * Math.PI) / 180;
            const r = 63;
            const cx = 100 + r * Math.cos(angle);
            const cy = 100 + r * Math.sin(angle);
            return (
              <g key={i} transform={`translate(${cx - 5}, ${cy - 5})`}>
                {i % 3 === 0 ? (
                  <path d="M5 0 L7 3 L10 5 L7 7 L5 10 L3 7 L0 5 L3 3 Z" fill="#ffd700" />
                ) : i % 3 === 1 ? (
                  <circle cx="5" cy="5" r="2.5" fill="none" stroke="#ffd700" strokeWidth="1.2" />
                ) : (
                  <polygon points="5,1 7,7 2,3 8,3 3,7" fill="#ffd700" />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
