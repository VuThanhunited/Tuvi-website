import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import TuViForm from '../components/TuViForm/TuViForm.jsx';
import './Home.css';

export default function Home() {
  const { user, isAuthenticated, credits } = useAuth();
  const [masters, setMasters] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(true);

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

  return (
    <div className="home-wrapper">
      <div className="home-container">
        
        {/* 1. CỘT TRÁI - MAIN CONTENT */}
        <div className="home-left-col">
          {/* Header / User Dashboard */}
          <div className="user-dashboard">
            <div className="user-info">
              <div className="user-greeting">
                Xin chào, <span>{isAuthenticated && user ? user.hoTen || user.username : 'Khách'}</span>
              </div>
              <div className="user-coin">
                💰 Bạn hiện có: {isAuthenticated ? credits : '0'} coin
              </div>
            </div>
            <div className="dashboard-actions">
              <button className="btn-buy-coin">Mua coin</button>
              <Link to={isAuthenticated ? "/tai-khoan" : "/dang-nhap"}>
                <button className="btn-auth">{isAuthenticated ? "Tài khoản" : "Đăng ký/ Nhập"}</button>
              </Link>
            </div>
          </div>

          {/* Form Lập Lá Số Tử Vi */}
          <TuViForm />

          {/* Khung Chatbot AI */}
          <div className="chat-widget-box">
            <div className="chat-header">
              🤖 Chat BOT Tư Vấn
            </div>
            <div className="chat-bubble">
              Chào bạn, tôi là trợ lý tử vi ảo. Bạn có câu hỏi nào cần giải đáp không?
            </div>
            <div className="chat-quick-actions">
              <span className="chat-tag">Cách tính sao?</span>
              <span className="chat-tag">Giải hạn năm nay</span>
              <span className="chat-tag">Xem ngày tốt</span>
              <span className="chat-tag">Hỏi đáp khác</span>
            </div>
          </div>
        </div>

        {/* 2. CỘT GIỮA - SOCIAL & SUPPORT */}
        <div className="home-middle-col">
          {/* Live Activity Feed */}
          <div className="activity-feed">
            <h3 className="section-title">Hoạt Động Mới Nhất</h3>
            <div className="feed-list">
              <div className="feed-item">
                <span className="feed-icon">🔔</span>
                <div className="feed-text"><span>Nguyễn Văn A</span> vừa đăng ký tài khoản</div>
              </div>
              <div className="feed-item">
                <span className="feed-icon">📅</span>
                <div className="feed-text"><span>Trần Văn B</span> vừa đặt lịch với Thầy Minh</div>
              </div>
              <div className="feed-item">
                <span className="feed-icon">✨</span>
                <div className="feed-text"><span>Nguyễn Thị C</span> vừa xem lá số thành công</div>
              </div>
              <div className="feed-item">
                <span className="feed-icon">💎</span>
                <div className="feed-text"><span>Tạ Thị D</span> vừa nạp 500 coin</div>
              </div>
              <div className="feed-item">
                <span className="feed-icon">📅</span>
                <div className="feed-text"><span>Hoàng Văn E</span> vừa đặt lịch với Cô Hương</div>
              </div>
            </div>
          </div>

          {/* CSKH & Social Links */}
          <div className="support-cards">
            <Link to="/lien-he" className="support-card cskh">
              <div className="icon-box">🎧</div>
              <div className="support-info">
                <h4>CSKH - Đặt lịch</h4>
                <p>Tư vấn chọn thầy xem</p>
              </div>
            </Link>
            
            <a href="#" className="support-card fb-page">
              <div className="icon-box">📘</div>
              <div className="support-info">
                <h4>Fanpage</h4>
                <p>Theo dõi tin tức</p>
              </div>
            </a>
            
            <a href="#" className="support-card fb-group">
              <div className="icon-box">👥</div>
              <div className="support-info">
                <h4>Nhóm Facebook</h4>
                <p>Giao lưu & Học hỏi</p>
              </div>
            </a>
          </div>
        </div>

        {/* 3. CỘT PHẢI - RANKING & ADS */}
        <div className="home-right-col">
          {/* Bảng Xếp Hạng Thầy */}
          <div className="ranking-box">
            <h3 className="section-title">BXH Uy Tín Các Thầy</h3>
            <div className="master-list">
              {loadingMasters ? (
                <div style={{padding: '10px', textAlign: 'center', color: '#94a3b8'}}>Đang tải...</div>
              ) : masters.length === 0 ? (
                <div style={{padding: '10px', textAlign: 'center', color: '#94a3b8'}}>Chưa có dữ liệu</div>
              ) : (
                masters.map((m) => (
                  <div className="master-card" key={m._id}>
                    <div className="master-avatar">
                      {m.avatar ? <img src={m.avatar} alt={m.fullName} style={{width: '100%', height: '100%', borderRadius: '50%'}} /> : '🧙‍♂️'}
                    </div>
                    <div className="master-info">
                      <div className="master-name">{m.fullName}</div>
                      <div className="master-rating">
                        {'⭐'.repeat(Math.floor(m.trustScore / 20))} {m.trustScore / 20}
                      </div>
                      <div style={{fontSize: '0.7rem', color: '#c5a059'}}>{m.rank}</div>
                    </div>
                    <button className="btn-detail">Chi Tiết</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ads & Sponsors */}
          <div className="ads-box">
            <h3 className="section-title">Nhà Tài Trợ</h3>
            <div className="ad-banner">
              Banner: Đông Trùng Hạ Thảo
            </div>
            <div className="ad-banner">
              Banner: Vật Phẩm Phong Thuỷ
            </div>
            <div className="ad-banner" style={{ borderStyle: 'dashed' }}>
              + Đăng ký quảng cáo
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
