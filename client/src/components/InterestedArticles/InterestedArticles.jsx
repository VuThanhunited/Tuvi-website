import { Link } from 'react-router-dom';
import './InterestedArticles.css';

export default function InterestedArticles() {
  const col1Animals = [
    { name: 'Tý', path: 'rat' },
    { name: 'Sửu', path: 'ox' },
    { name: 'Dần', path: 'tiger' },
    { name: 'Mão', path: 'rabbit' },
    { name: 'Thìn', path: 'dragon' },
    { name: 'Tỵ', path: 'snake' }
  ];

  const col2Animals = [
    { name: 'Ngọ', path: 'horse' },
    { name: 'Mùi', path: 'goat' },
    { name: 'Thân', path: 'monkey' },
    { name: 'Dậu', path: 'rooster' },
    { name: 'Tuất', path: 'dog' },
    { name: 'Hợi', path: 'pig' }
  ];

  return (
    <section className="interested-articles-section">
      <div className="container">
        <h3 className="interested-articles-title">BÀI VIẾT BẠN QUAN TÂM</h3>
        <div className="interested-articles-grid">
          <div className="interested-articles-col">
            <ul className="interested-articles-list">
              {col1Animals.map((item, idx) => (
                <li key={idx} className="interested-article-item">
                  <Link to={`/horoscope/${item.path}`} className="interested-article-link">
                    <span className="interested-article-bullet">✦</span>
                    Tử vi tuổi {item.name} 2026
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="interested-articles-col">
            <ul className="interested-articles-list">
              {col2Animals.map((item, idx) => (
                <li key={idx} className="interested-article-item">
                  <Link to={`/horoscope/${item.path}`} className="interested-article-link">
                    <span className="interested-article-bullet">✦</span>
                    Tử vi tuổi {item.name} 2026
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
