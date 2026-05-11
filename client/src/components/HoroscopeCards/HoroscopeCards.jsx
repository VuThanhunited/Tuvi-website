import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HoroscopeCards.css';

const zodiacSigns = [
  { emoji: '🐀', name: 'Tý', years: '2008, 1996, 1984', rating: 4, summary: 'Tuyệt vời', level: 'excellent' },
  { emoji: '🐂', name: 'Sửu', years: '2009, 1997, 1985', rating: 3, summary: 'Khá tốt', level: 'good' },
  { emoji: '🐯', name: 'Dần', years: '2010, 1998, 1986', rating: 2, summary: 'Cẩn thận', level: 'caution' },
  { emoji: '🐰', name: 'Mão', years: '2011, 1999, 1987', rating: 5, summary: 'Xuất sắc', level: 'excellent' },
  { emoji: '🐲', name: 'Thìn', years: '2012, 2000, 1988', rating: 4, summary: 'May mắn', level: 'good' },
  { emoji: '🐍', name: 'Tỵ', years: '2013, 2001, 1989', rating: 3, summary: 'Bình thường', level: 'average' },
  { emoji: '🐴', name: 'Ngọ', years: '2014, 2002, 1990', rating: 4, summary: 'Tốt lành', level: 'good' },
  { emoji: '🐐', name: 'Mùi', years: '2015, 2003, 1991', rating: 3, summary: 'Ổn định', level: 'average' },
  { emoji: '🐒', name: 'Thân', years: '2016, 2004, 1992', rating: 5, summary: 'Rực rỡ', level: 'excellent' },
  { emoji: '🐓', name: 'Dậu', years: '2017, 2005, 1993', rating: 2, summary: 'Chú ý', level: 'caution' },
  { emoji: '🐕', name: 'Tuất', years: '2018, 2006, 1994', rating: 4, summary: 'Hanh thông', level: 'good' },
  { emoji: '🐷', name: 'Hợi', years: '2019, 2007, 1995', rating: 3, summary: 'Khá tốt', level: 'good' },
];

function StarRating({ rating }) {
  return (
    <div className="horoscope-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

export default function HoroscopeCards() {
  const [currentDate] = useState(new Date());
  const formatDate = (d) => d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="horoscope-section section" id="horoscope">
      <div className="container">
        <h2 className="section-title">🌟 Dự Báo 12 Con Giáp</h2>
        <p className="section-subtitle">Xem vận trình hàng ngày cho từng con giáp</p>

        <div className="horoscope-date-nav">
          <button className="horoscope-date-btn">⬅️ Hôm qua</button>
          <span className="horoscope-current-date">📅 {formatDate(currentDate)}</span>
          <button className="horoscope-date-btn">Ngày mai ➡️</button>
        </div>

        <div className="horoscope-grid">
          {zodiacSigns.map((z, i) => (
            <Link key={i} to={`/horoscope/${z.name.toLowerCase()}`} className="horoscope-card" style={{ textDecoration: 'none' }}>
              <div className="horoscope-emoji">{z.emoji}</div>
              <h3 className="horoscope-name">{z.name}</h3>
              <p className="horoscope-years">{z.years}</p>
              <StarRating rating={z.rating} />
              <span className={`horoscope-summary ${z.level}`}>{z.summary}</span>
              <span className="horoscope-detail-link">Xem chi tiết →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
