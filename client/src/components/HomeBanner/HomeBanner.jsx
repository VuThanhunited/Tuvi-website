import './HomeBanner.css';

export default function HomeBanner() {
  return (
    <section className="qtv-hero-banner" id="home-banner" aria-label="Quán Tử Vi Banner">
      <div className="qtv-hero-banner-inner">
        <img
          src="/images/quan-tu-vi-banner.jpg"
          alt="Quán Tử Vi - Luận giải Tử Vi – Định hướng Vận Mệnh"
          className="qtv-hero-banner-img"
        />
      </div>
    </section>
  );
}
