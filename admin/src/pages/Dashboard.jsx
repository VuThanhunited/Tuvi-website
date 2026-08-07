import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  ArrowUpRight,
  Star,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMasters: 0,
    totalUsers: 0,
    totalLaSo: 0,
    totalDiscussions: 0,
    totalInterpretations: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    newLaSoThisMonth: 0,
    recentLaSo: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [crawlStatus, setCrawlStatus] = useState(null);

  const handleCrawl = async () => {
    setCrawling(true);
    setCrawlStatus(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/admin/crawl-forum`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCrawlStatus({
          success: true,
          message: 'Cào dữ liệu diễn đàn hoàn tất thành công!',
          data: res.data.data
        });
      } else {
        setCrawlStatus({
          success: false,
          message: res.data.message || 'Cào dữ liệu thất bại'
        });
      }
    } catch (error) {
      console.error('Error crawling:', error);
      setCrawlStatus({
        success: false,
        message: 'Lỗi kết nối API Server!'
      });
    } finally {
      setCrawling(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats({
            totalMasters: res.data.data.totalMasters || 0,
            totalUsers: res.data.data.totalUsers || 0,
            totalLaSo: res.data.data.totalLaSo || 0,
            totalDiscussions: res.data.data.totalDiscussions || 0,
            totalInterpretations: res.data.data.totalInterpretations || 0,
            activeUsers: res.data.data.activeUsers || 0,
            newUsersThisMonth: res.data.data.newUsersThisMonth || 0,
            newLaSoThisMonth: res.data.data.newLaSoThisMonth || 0,
            recentLaSo: res.data.data.recentLaSo || [],
            recentUsers: res.data.data.recentUsers || [],
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#94a3b8' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Hệ thống Quản trị Tử Vi</h1>
        <p style={{ color: '#94a3b8' }}>Chào mừng trở lại, Admin. Đây là tổng quan hoạt động của hệ thống.</p>
      </header>

      {/* Stats Cards Row 1 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.2rem',
        marginBottom: '1.5rem'
      }}>
        <StatCard 
          icon={<Users size={24} color="#c5a059" />} 
          label="Tổng Người Dùng" 
          value={stats.totalUsers.toLocaleString('vi-VN')} 
          trend={`+${stats.newUsersThisMonth} tháng này`}
          trendColor="#10b981"
        />
        <StatCard 
          icon={<UserCheck size={24} color="#10b981" />} 
          label="Đang Hoạt Động" 
          value={stats.activeUsers.toLocaleString('vi-VN')} 
          trend={`${stats.totalUsers > 0 ? Math.round(stats.activeUsers / stats.totalUsers * 100) : 0}% tổng số`}
          trendColor="#10b981"
        />
        <StatCard 
          icon={<Star size={24} color="#f59e0b" />} 
          label="Lá Số Đã Lập" 
          value={stats.totalLaSo.toLocaleString('vi-VN')} 
          trend={`+${stats.newLaSoThisMonth} tháng này`}
          trendColor="#f59e0b"
        />
        <StatCard 
          icon={<Activity size={24} color="#8b5cf6" />} 
          label="Bài Thảo Luận" 
          value={stats.totalDiscussions.toLocaleString('vi-VN')} 
          trend="Cộng đồng"
          trendColor="#8b5cf6"
        />
      </div>

      {/* Stats Cards Row 2 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.2rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard 
          icon={<Users size={24} color="#3b82f6" />} 
          label="Chuyên Gia Tử Vi" 
          value={stats.totalMasters.toLocaleString('vi-VN')} 
          trend="Thầy luận giải"
          trendColor="#3b82f6"
        />
        <StatCard 
          icon={<BookOpen size={24} color="#ec4899" />} 
          label="Luận Giải" 
          value={stats.totalInterpretations.toLocaleString('vi-VN')} 
          trend="Kho tri thức"
          trendColor="#ec4899"
        />
        <StatCard 
          icon={<FileText size={24} color="#14b8a6" />} 
          label="Người Dùng Mới" 
          value={stats.newUsersThisMonth.toLocaleString('vi-VN')} 
          trend="Tháng này"
          trendColor="#14b8a6"
        />
        <StatCard 
          icon={<TrendingUp size={24} color="#c5a059" />} 
          label="Lá Số Mới" 
          value={stats.newLaSoThisMonth.toLocaleString('vi-VN')} 
          trend="Tháng này"
          trendColor="#c5a059"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div>
          {/* Recent LaSo */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>🔮 Lá Số Mới Nhất</h3>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>5 gần nhất</span>
            </div>
            {stats.recentLaSo.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Chưa có lá số nào được lập.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {stats.recentLaSo.map((ls, i) => (
                  <ActivityItem 
                    key={i}
                    icon={<Star size={16} color="#c5a059" />} 
                    text={`${ls.hoTen} (${ls.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}) đã lập lá số`} 
                    time={timeAgo(ls.createdAt)} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>👥 Người Dùng Mới Nhất</h3>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>5 gần nhất</span>
            </div>
            {stats.recentUsers.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Chưa có người dùng nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {stats.recentUsers.map((u, i) => (
                  <ActivityItem 
                    key={i}
                    icon={<Users size={16} color="#3b82f6" />} 
                    text={`${u.hoTen} (${u.email}) — ${roleBadge(u.role)}`} 
                    time={timeAgo(u.createdAt)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Health & Scraper */}
        <div>
          {/* System Health */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1.5rem' }}>Trạng thái hệ thống</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <HealthItem label="Database" status="Ổn định" color="#10b981" />
              <HealthItem label="API Server" status="Hoạt động" color="#10b981" />
              <HealthItem label="Người dùng Active" status={`${stats.activeUsers} users`} color="#3b82f6" />
              <HealthItem label="Lá số tháng này" status={`+${stats.newLaSoThisMonth}`} color="#f59e0b" />
            </div>
          </div>

          {/* Forum Crawler Card */}
          <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🤖 Cào dữ liệu Diễn đàn
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
              Thu thập các bài đăng thảo luận lá số từ <strong>tuvivietnam.vn</strong> và <strong>lyso.vn</strong> để đẩy lên tường Cộng đồng của bạn.
            </p>
            {crawlStatus && (
              <div style={{ 
                padding: '0.8rem', 
                borderRadius: '8px', 
                backgroundColor: crawlStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                color: crawlStatus.success ? '#10b981' : '#ef4444',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                border: `1px solid ${crawlStatus.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                {crawlStatus.message}
                {crawlStatus.data && (
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#94a3b8' }}>
                    Đã cào: {crawlStatus.data.totalCrawled} | Lưu mới: {crawlStatus.data.savedToDb} ({crawlStatus.data.source === 'real_forum' ? 'Diễn đàn thực tế' : 'Hạt giống dự phòng'})
                  </div>
                )}
              </div>
            )}
            <button 
              onClick={handleCrawl} 
              disabled={crawling}
              style={{
                width: '100%',
                background: crawling ? '#475569' : 'linear-gradient(135deg, #c5a059, #ab853a)',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: crawling ? 'not-allowed' : 'pointer',
                boxShadow: crawling ? 'none' : '0 4px 12px rgba(197, 160, 89, 0.2)',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {crawling ? '⏳ ĐANG CÀO DỮ LIỆU...' : '📥 CÀO DỮ LIỆU NGAY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

function roleBadge(role) {
  if (role === 'admin') return '👑 Admin';
  if (role === 'master') return '🔮 Chuyên gia';
  return '👤 User';
}

function StatCard({ icon, label, value, trend, trendColor }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(197, 160, 89, 0.1)', borderRadius: '12px' }}>
          {icon}
        </div>
        <span style={{ color: trendColor || '#10b981', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem', textAlign: 'right', maxWidth: '100px' }}>
          {trend}
        </span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{value}</div>
    </div>
  );
}

function ActivityItem({ icon, text, time }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.8rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>{text}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{time}</div>
      </div>
    </div>
  );
}

function HealthItem({ label, status, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color, fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></div>
        {status}
      </span>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  padding: '1.5rem',
  borderRadius: '16px',
  border: '1px solid rgba(197, 160, 89, 0.2)',
  backdropFilter: 'blur(10px)'
};
