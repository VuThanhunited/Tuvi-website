import bannerImg from '../../data/banner.jpg';
import './HomeBanner.css';

export default function HomeBanner() {
  return (
    <section className="home-banner" id="home-banner">
      <div className="home-banner-bg" style={{ backgroundImage: `url(${bannerImg})` }} />
      
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
    </section>
  );
}
