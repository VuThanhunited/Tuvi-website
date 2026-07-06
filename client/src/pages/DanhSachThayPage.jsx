import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RatingStarIcon, LocationPinIcon, PointsDiamondIcon, ProfileButtonIcon, MasterIcon } from '../components/Icons.jsx';
import './StaticPages.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

const fallbackMasters = [
  { _id: 'f1', fullName: 'Thầy Thiên Lạc', rank: 'Tinh Thông', trustScore: 98, reviewCount: 128, location: 'Hà Nội', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', points: '9.850', bio: 'Hơn 15 năm kinh nghiệm luận giải lá số tử vi trọn đời, định hướng sự nghiệp và tình duyên.' },
  { _id: 'f2', fullName: 'Thầy Minh Khang', rank: 'Tinh Thông', trustScore: 96, reviewCount: 105, location: 'TP. Hồ Chí Minh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', points: '8.730', bio: 'Chuyên gia phong thủy và tử vi nam phái. Luận đoán chính xác vận hạn, gia đạo.' },
  { _id: 'f3', fullName: 'Thầy An Nhiên', rank: 'Tinh Thông', trustScore: 94, reviewCount: 98, location: 'Đà Nẵng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', points: '7.580', bio: 'Tư vấn tử vi kết hợp nhân tướng học. Giúp thấu hiểu bản thân, sống an nhiên tự tại.' },
];

export default function DanhSachThayPage() {
  const [masters, setMasters] = useState(fallbackMasters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMasters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/masters`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setMasters(data.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách thầy:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>🔮 Danh Sách Thầy Tử Vi Tinh Thông</h1>
          <p>Gặp gỡ và nhận tư vấn trực tiếp từ các chuyên gia tử vi, phong thủy uy tín hàng đầu</p>
        </div>

        {loading ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#888' }}>Đang tải danh sách thầy tử vi...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {masters.map((master, index) => (
              <div key={master._id} className="content-card" style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: '1.5rem',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--color-gold)',
                  }}>
                    {master.avatar ? (
                      <img src={master.avatar} alt={master.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#24164b', color: '#fff' }}>
                        <MasterIcon size={36} />
                      </div>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-5px',
                    right: '-5px',
                    background: 'var(--color-gold)',
                    color: '#1a0a2e',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: '2px solid #0f0a1e',
                  }}>
                    {index + 1}
                  </div>
                </div>

                {/* Info details */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>{master.fullName}</h2>
                    <span className="master-badge" style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      color: 'var(--color-gold)',
                      border: '1px solid var(--color-gold)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {master.rank || 'Tinh Thông'}
                    </span>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>
                    {master.bio || 'Chuyên gia luận giải lá số tử vi và tư vấn các vấn đề vận hạn trong cuộc sống.'}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <RatingStarIcon size={16} style={{ marginRight: '4px' }} />
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>{(master.trustScore / 20).toFixed(1)}/5</span>
                      <span style={{ marginLeft: '4px' }}>({master.reviewCount || 0} đánh giá)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <LocationPinIcon size={16} style={{ marginRight: '4px' }} />
                      {master.location || 'Việt Nam'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PointsDiamondIcon size={16} style={{ marginRight: '4px' }} />
                      Uy tín: <strong style={{ color: 'var(--color-gold)', marginLeft: '4px' }}>{master.points || Math.floor(master.trustScore * 100).toLocaleString('vi-VN')} điểm</strong>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div style={{ minWidth: '150px' }}>
                  <Link to={`/thay/${master._id}`} className="btn btn-primary" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '0.7rem 1.2rem',
                    textDecoration: 'none',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    <ProfileButtonIcon size={16} />
                    Xem Hồ Sơ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
