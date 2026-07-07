import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import HomeBanner from '../components/HomeBanner/HomeBanner.jsx';
import { HandshakeIcon, CalendarIcon, HeartsIcon, DiamondIcon, GoldMedalIcon, SilverMedalIcon, FilterIcon, VerifiedIcon, FacebookIcon, SunStarIcon, TempleIcon, TarotIcon, SearchIcon, EyeIcon, CommentIcon, ShareIcon, BookmarkIcon, MasterIcon, ArticleIcon, LikeIcon, StarChartIcon, RatingStarIcon, LocationPinIcon, PointsDiamondIcon, ProfileButtonIcon } from '../components/Icons.jsx';
import teaCornerImg from '../data/tea_corner.png';
import meditationCornerImg from '../data/meditation_corner.png';
import './Home.css';

// Sample articles data with thumbnail URLs matching the mockup
const sampleArticles = [
  {
    id: 1,
    author: 'Tử Vi & Cuộc Sống',
    authorVerified: true,
    time: '2 giờ trước',
    title: 'Tử vi ngày 16/05/2024 của 12 cung hoàng đạo',
    excerpt: 'Hôm nay là ngày Thiên Ấn chiếu mệnh, mang đến nhiều may mắn trong công việc và tài lộc. Cùng xem chi tiết vận trình của bạn nhé!',
    views: '1.2K',
    comments: 312,
    shares: 128,
    thumbnail: 'https://images.unsplash.com/photo-1515942400720-f19ff239014b?auto=format&fit=crop&q=80&w=200',
    category: 'Tử Vi & Cuộc Sống'
  },
  {
    id: 2,
    author: 'Phong Thủy Ứng Dụng',
    authorVerified: true,
    time: '5 giờ trước',
    title: '5 mẹo phong thủy giúp thu hút tài lộc và may mắn',
    excerpt: 'Áp dụng những mẹo nhỏ dưới đây để cân bằng năng lượng, hút tài lộc và mang lại bình an cho gia đình bạn.',
    views: '856',
    comments: 112,
    shares: 67,
    thumbnail: 'https://images.unsplash.com/photo-1609137144813-7d722d3b2024?auto=format&fit=crop&q=80&w=200',
    category: 'Phong Thủy Ứng Dụng'
  },
  {
    id: 3,
    author: 'Tarot Thông Điệp',
    authorVerified: true,
    time: '1 ngày trước',
    title: 'Ý nghĩa các lá bài trong bộ Tarot Rider Waite',
    excerpt: 'Giải mã chi tiết ý nghĩa 78 lá bài Tarot Rider Waite và cách ứng dụng trong cuộc sống hằng ngày.',
    views: '742',
    comments: 93,
    shares: 451,
    thumbnail: 'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=200',
    category: 'Tarot Thông Điệp'
  },
  {
    id: 4,
    author: 'Tử Vi & Cuộc Sống',
    authorVerified: true,
    time: '2 ngày trước',
    title: 'Sao Thái Dương trong lá số tử vi nói lên điều gì?',
    excerpt: 'Sao Thái Dương đại diện cho danh vọng, sự nghiệp và phẩm chất lãnh đạo trong lá số tử vi.',
    views: '1.1K',
    comments: 205,
    shares: 98,
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=200',
    category: 'Tử Vi & Cuộc Sống'
  },
  {
    id: 5,
    author: 'Tử Vi & Cuộc Sống',
    authorVerified: true,
    time: '3 ngày trước',
    title: 'Cách xem hạn năm 2024 chính xác nhất',
    excerpt: 'Hướng dẫn cách xem hạn năm 2024 cho 12 con giáp chi tiết và dễ hiểu nhất dành cho bạn.',
    views: '980',
    comments: 168,
    shares: 76,
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=200',
    category: 'Tử Vi & Cuộc Sống'
  }
];

// Sample activities with user avatars matching the mockup
const sampleActivities = [
  { 
    id: 1, 
    text: 'Nguyễn Văn A vừa tham gia Tử Vi Quán', 
    time: '2 phút trước', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
  },
  { 
    id: 2, 
    text: 'Nguyễn Văn B vừa đánh giá thầy Nguyễn Văn C 5 ★', 
    time: '10 phút trước', 
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100'
  },
  { 
    id: 3, 
    text: 'Lê Thị D vừa lập lá số tử vi', 
    time: '20 phút trước', 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100'
  },
  { 
    id: 4, 
    text: 'Trần Minh E vừa bình luận bài viết "Tử vi ngày 16/05/2024"', 
    time: '35 phút trước', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  { 
    id: 5, 
    text: 'Phạm Hoàng F vừa chia sẻ bài viết "Sao Thái Dương trong lá số tử vi nói lên điều gì?"', 
    time: '1 giờ trước', 
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=100'
  },
];

const fallbackMasters = [
  { _id: 'f1', fullName: 'Thầy Thiên Lạc', rank: 'Tinh Thông', trustScore: 98, reviewCount: 128, location: 'Hà Nội', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', points: '9.850' },
  { _id: 'f2', fullName: 'Thầy Minh Khang', rank: 'Tinh Thông', trustScore: 96, reviewCount: 105, location: 'TP. Hồ Chí Minh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', points: '8.730' },
  { _id: 'f3', fullName: 'Thầy An Nhiên', rank: 'Tinh Thông', trustScore: 94, reviewCount: 98, location: 'Đà Nẵng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', points: '7.580' },
];

export default function Home() {
  const { user, isAuthenticated, credits } = useAuth();
  const [masters, setMasters] = useState(fallbackMasters);
  const [loadingMasters, setLoadingMasters] = useState(false);
  const [activeTab, setActiveTab] = useState('newest');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
        const res = await fetch(`${API_URL}/masters`);
        const result = await res.json();
        if (result.success) {
          setMasters(result.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách thầy:', error);
      } finally {
        setLoadingMasters(false);
      }
    };
    fetchMasters();
  }, []);

  const topMasters = masters.slice(0, 3);

  const [articles, setArticles] = useState(sampleArticles);
  const handleLoadMore = () => {
    const extraArticles = [
      {
        id: articles.length + 1,
        author: 'Phong Thủy Cát Tường',
        authorVerified: true,
        time: '3 ngày trước',
        title: 'Bí quyết chọn hướng nhà chung cư hợp tuổi gia chủ',
        excerpt: 'Chọn căn hộ chung cư đúng hướng sinh khí giúp gia đạo bình an, công việc hanh thông, thu hút tài lộc.',
        views: '640',
        comments: 42,
        shares: 31,
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200',
        category: 'Phong Thủy'
      },
      {
        id: articles.length + 2,
        author: 'Tử Vi Đại Việt',
        authorVerified: false,
        time: '5 ngày trước',
        title: 'Luận giải chi tiết hạn Tam Tai tuổi Thân, Tý, Thìn năm 2026',
        excerpt: 'Cách phòng tránh và hóa giải hạn Tam Tai hiệu quả nhất trong năm Bính Ngọ cho ba con giáp Thân - Tý - Thìn.',
        views: '1.5K',
        comments: 512,
        shares: 289,
        thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=200',
        category: 'Tử Vi & Cuộc Sống'
      }
    ];
    setArticles(prev => [...prev, ...extraArticles]);
  };

  return (
    <div className="home-wrapper">
      {/* Hero Banner */}
      {isHomePage && <HomeBanner />}

      {/* Main 3-column layout */}
      <div className="home-container">
        
        {/* ========== CỘT TRÁI - SPONSORS & FANPAGE ========== */}
        <aside className="home-left-col">
          {/* Quick Action Cards matching mockup */}
          <div className="left-quick-actions">
            <Link to="/la-so" className="left-action-card">
              <span className="left-action-icon"><HandshakeIcon size={24} stroke="#a855f7" /></span>
              <span className="left-action-title">XEM HỢP TÁC</span>
              <span className="left-action-desc">Xem độ hợp, đối tác hợp mệnh</span>
            </Link>
            
            <Link to="/la-so" className="left-action-card">
              <span className="left-action-icon"><CalendarIcon size={24} stroke="#00d2ff" /></span>
              <span className="left-action-title">XEM NGÀY SINH</span>
              <span className="left-action-desc">Xem vận mệnh theo ngày sinh</span>
            </Link>

            <Link to="/la-so" className="left-action-card">
              <span className="left-action-icon"><HeartsIcon size={24} stroke="#ec4899" /></span>
              <span className="left-action-title">XEM TÌNH DUYÊN</span>
              <span className="left-action-desc">Xem duyên phận, tình yêu</span>
            </Link>
          </div>

          {/* Sponsor Kim Cương */}
          <div className="supporter-block diamond">
            <div className="supporter-label">
              ĐƠN VỊ TÀI TRỢ KIM CƯƠNG
            </div>
            <div className="supporter-card">
              <span className="supporter-diamond-icon"><DiamondIcon size={36} /></span>
              <div className="supporter-logo-placeholder">
                <span>YOUR LOGO</span>
                <small>DIAMOND SPONSOR</small>
              </div>
              <Link to="/lien-he" className="supporter-cta">
                Xem chi tiết →
              </Link>
            </div>
          </div>

          {/* Sponsor Vàng */}
          <div className="supporter-block gold">
            <div className="supporter-label">
              ĐƠN VỊ TÀI TRỢ VÀNG
            </div>
            <div className="supporter-card">
              <span className="supporter-gold-icon"><GoldMedalIcon size={36} /></span>
              <div className="supporter-logo-placeholder gold-bg">
                <span>YOUR LOGO</span>
                <small>GOLD SPONSOR</small>
              </div>
              <Link to="/lien-he" className="supporter-cta gold-cta">
                Xem chi tiết →
              </Link>
            </div>
          </div>

          {/* Sponsor Bạc */}
          <div className="supporter-block silver">
            <div className="supporter-label">
              ĐƠN VỊ TÀI TRỢ BẠC
            </div>
            <div className="supporter-card">
              <span className="supporter-silver-icon"><SilverMedalIcon size={36} /></span>
              <div className="supporter-logo-placeholder silver-bg">
                <span>YOUR LOGO</span>
                <small>SILVER SPONSOR</small>
              </div>
              <Link to="/lien-he" className="supporter-cta silver-cta">
                Xem chi tiết →
              </Link>
            </div>
          </div>

          {/* Fanpage Box */}
          <div className="fanpage-block">
            <div className="fanpage-label">FANPAGE BOX</div>
            <div className="fanpage-box">
              <div className="fanpage-content">
                <div className="fanpage-info">
                  <span className="fanpage-icon"><StarChartIcon size={24} stroke="#ffd700" /></span>
                  <div>
                    <strong>Tử Vi & Cuộc Sống</strong> <VerifiedIcon />
                    <p>128K người theo dõi</p>
                    <p className="fanpage-desc">Cộng đồng yêu thích tử vi</p>
                  </div>
                </div>
                <a 
                  href="https://www.facebook.com/groups/1353837944687586/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="fanpage-follow-btn"
                >
                  <span style={{ marginRight: '6px' }}><FacebookIcon size={14} stroke="#fff" /></span> Theo dõi trang
                </a>
              </div>
            </div>
          </div>

          {/* Góc Trà Widget */}
          <div className="sidebar-widget-card tea-corner-widget">
            <div className="widget-header-accent">GÓC TRÀ</div>
            <div className="widget-body-new">
              <div className="widget-img-wrapper">
                <img src={teaCornerImg} alt="Góc Trà" />
              </div>
              <p className="widget-desc-new">
                Nơi đàm đạo, thưởng trà và chiêm nghiệm về triết lý nhân sinh cuộc sống.
              </p>
              <Link to="/kien-thuc" className="widget-btn-new">
                Ghé thăm Góc Trà
              </Link>
            </div>
          </div>
        </aside>

        {/* ========== CỘT GIỮA - BÀI VIẾT FEED ========== */}
        <main className="home-center-col">
          {/* Search bar */}
          <div className="feed-search-bar">
            <span className="search-icon"><SearchIcon color="#94a3b8" /></span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết, chủ đề, thầy tử vi..." 
              className="feed-search-input"
            />
          </div>

          {/* Tabs */}
          <div className="feed-tabs-container">
            <div className="feed-tabs">
              <button 
                className={`feed-tab ${activeTab === 'newest' ? 'active' : ''}`}
                onClick={() => setActiveTab('newest')}
              >
                Mới nhất
              </button>
              <button 
                className={`feed-tab ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => setActiveTab('featured')}
              >
                Nổi bật
              </button>
              <button 
                className={`feed-tab ${activeTab === 'trending' ? 'active' : ''}`}
                onClick={() => setActiveTab('trending')}
              >
                Được quan tâm
              </button>
            </div>
            <button className="feed-filter-btn" aria-label="Filter">
              <span className="filter-icon"><FilterIcon /></span>
            </button>
          </div>

          {/* Articles Feed */}
          <div className="articles-feed">
            {articles.map((article) => (
              <article className="article-card" key={article.id}>
                <div className="article-body">
                  {article.thumbnail && (
                    <div className="article-thumbnail">
                      <img src={article.thumbnail} alt={article.title} />
                    </div>
                  )}
                  <div className="article-content-col">
                    <div className="article-header">
                      <div className="article-author-info">
                        <div className="article-author-avatar">
                          {article.category && article.category.includes('Tử Vi') 
                            ? <SunStarIcon size={16} /> 
                            : article.category && article.category.includes('Phong Thủy') 
                            ? <TempleIcon size={16} /> 
                            : <TarotIcon size={16} />
                          }
                        </div>
                        <div>
                          <span className="article-author-name">
                            {article.author} 
                            {article.authorVerified && <VerifiedIcon />}
                          </span>
                          <span className="article-time">• {article.time}</span>
                        </div>
                      </div>
                      <button className="article-more-options">⋯</button>
                    </div>

                    <div className="article-text">
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt}</p>
                    </div>

                    <div className="article-stats">
                      <span className="stat-item">
                        <span className="stat-icon"><LikeIcon size={13} /></span> {article.views}
                      </span>
                      <span className="stat-item">
                        <span className="stat-icon"><CommentIcon size={13} /></span> Bình luận {article.comments}
                      </span>
                      <span className="stat-item">
                        <span className="stat-icon"><ShareIcon size={13} /></span> Chia sẻ {article.shares}
                      </span>
                      <button className="article-save-btn">
                        <span className="stat-icon"><BookmarkIcon size={13} /></span> Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Load More Button */}
            <div className="feed-load-more-container">
              <button 
                className="feed-load-more-btn"
                onClick={handleLoadMore}
              >
                Xem thêm bài viết
              </button>
            </div>
          </div>
        </main>

        {/* ========== CỘT PHẢI - THẦY & HOẠT ĐỘNG ========== */}
        <aside className="home-right-col">
          {/* Ranking Thầy */}
          <div className="masters-ranking-box">
            <div className="ranking-header">
              <h3 className="ranking-title">THẦY TỬ VI TINH THÔNG</h3>
              <Link to="/danh-sach-thay" className="view-all-link">Xem tất cả →</Link>
            </div>

            <div className="masters-ranking-list">
              {loadingMasters ? (
                <div className="loading-text">Đang tải...</div>
              ) : topMasters.length === 0 ? (
                // Fallback static data matching mockup
                [
                  { _id: 'f1', fullName: 'Thầy Thiên Lạc', rank: 'Tinh Thông', trustScore: 98, reviewCount: 128, location: 'Hà Nội', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', points: '9.850' },
                  { _id: 'f2', fullName: 'Thầy Minh Khang', rank: 'Tinh Thông', trustScore: 96, reviewCount: 105, location: 'TP. Hồ Chí Minh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', points: '8.730' },
                  { _id: 'f3', fullName: 'Thầy An Nhiên', rank: 'Tinh Thông', trustScore: 94, reviewCount: 98, location: 'Đà Nẵng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', points: '7.580' },
                ].map((master, index) => (
                  <div className="master-rank-card" key={master._id}>
                    <div className="master-rank-main-row">
                      <div className="master-rank-image-wrapper">
                        <div className="master-rank-number">{index + 1}</div>
                        <div className="master-rank-avatar">
                          <img src={master.avatar} alt={master.fullName} />
                        </div>
                      </div>
                      <div className="master-rank-details">
                        <div className="master-rank-info">
                          <div className="master-rank-name">
                            {master.fullName}
                            <span className="master-badge">{master.rank}</span>
                          </div>
                          <div className="master-rank-rating">
                            <RatingStarIcon size={14} style={{ marginRight: '4px' }} /> {(master.trustScore / 20).toFixed(1)}/5 
                            <span className="review-count">({master.reviewCount} đánh giá)</span>
                          </div>
                          <div className="master-rank-location">
                            <LocationPinIcon size={12} style={{ marginRight: '4px' }} />
                            {master.location}
                          </div>
                        </div>
                        <div className="master-rank-points">
                          {master.points} <PointsDiamondIcon size={12} style={{ marginLeft: '4px' }} />
                        </div>
                      </div>
                    </div>
                    <div className="master-rank-btn-row">
                      <Link to={`/thay/${master._id}`} className="master-profile-btn">
                        <ProfileButtonIcon size={14} /> Xem hồ sơ
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                topMasters.map((master, index) => (
                  <div className="master-rank-card" key={master._id}>
                    <div className="master-rank-main-row">
                      <div className="master-rank-image-wrapper">
                        <div className="master-rank-number">{index + 1}</div>
                        <div className="master-rank-avatar">
                          {master.avatar 
                            ? <img src={master.avatar} alt={master.fullName} />
                            : <div className="master-avatar-fallback"><MasterIcon size={24} /></div>
                          }
                        </div>
                      </div>
                      <div className="master-rank-details">
                        <div className="master-rank-info">
                          <div className="master-rank-name">
                            {master.fullName}
                            <span className="master-badge">{master.rank || 'Tinh Thông'}</span>
                          </div>
                          <div className="master-rank-rating">
                            <RatingStarIcon size={14} style={{ marginRight: '4px' }} /> {(master.trustScore / 20).toFixed(1)}/5
                            <span className="review-count">({master.reviewCount || 0} đánh giá)</span>
                          </div>
                          <div className="master-rank-location">
                            <LocationPinIcon size={12} style={{ marginRight: '4px' }} />
                            {master.location || 'Việt Nam'}
                          </div>
                        </div>
                        <div className="master-rank-points">
                          {master.points || Math.floor(master.trustScore * 100).toLocaleString('vi-VN')} <PointsDiamondIcon size={12} style={{ marginLeft: '4px' }} />
                        </div>
                      </div>
                    </div>
                    <div className="master-rank-btn-row">
                      <Link to={`/thay/${master._id}`} className="master-profile-btn">
                        <ProfileButtonIcon size={14} /> Xem hồ sơ
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hoạt động mới nhất */}
          <div className="activity-box">
            <div className="activity-header">
              <h3 className="activity-title">HOẠT ĐỘNG MỚI NHẤT</h3>
              <span className="view-all-link">Xem tất cả →</span>
            </div>
            <div className="activity-list">
              {sampleActivities.map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-avatar">
                    {activity.id === 3 ? (
                      <div className="activity-icon-fallback">
                        <ArticleIcon size={16} />
                      </div>
                    ) : (
                      <img src={activity.avatar} alt="User Avatar" />
                    )}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Góc Thiền Widget */}
          <div className="sidebar-widget-card meditation-corner-widget">
            <div className="widget-header-accent">GÓC THIỀN</div>
            <div className="widget-body-new">
              <div className="widget-img-wrapper">
                <img src={meditationCornerImg} alt="Góc Thiền" />
              </div>
              <p className="widget-desc-new">
                Lắng đọng tâm hồn, tìm lại sự bình yên trong chánh niệm và tĩnh lặng.
              </p>
              <Link to="/kien-thuc" className="widget-btn-new">
                Ghé thăm Góc Thiền
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
