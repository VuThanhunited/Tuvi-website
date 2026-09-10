import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Users, BookOpen, TrendingUp, Clock,
  MessageSquare, Star, Activity, UserCheck,
  FileText, Zap, RefreshCw, Database,
  Server, Eye, BarChart2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

/* ── Animated counter hook ── */
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Mini Bar Chart (CSS only) ── */
function MiniBarChart({ data, color = '#c5a059' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.label}: ${d.value}`}
          style={{
            flex: 1,
            background: color,
            borderRadius: '3px 3px 0 0',
            height: `${(d.value / max) * 100}%`,
            minHeight: '3px',
            opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.4,
            transition: 'height 0.6s ease',
          }}
        />
      ))}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, trend, trendColor, chartData, chartColor, delay = 0 }) {
  const animated = useCounter(typeof value === 'number' ? value : 0, 1200 + delay);
  return (
    <div style={{
      ...cardStyle,
      animation: `dashCardIn 0.5s ease ${delay}ms both`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          padding: '0.7rem',
          background: 'rgba(197, 160, 89, 0.1)',
          border: '1px solid rgba(197, 160, 89, 0.15)',
          borderRadius: '12px',
        }}>
          {icon}
        </div>
        <span style={{
          color: trendColor || '#10b981',
          fontSize: '0.75rem',
          fontWeight: 600,
          textAlign: 'right',
          maxWidth: '100px',
          lineHeight: 1.3,
        }}>
          {trend}
        </span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.8rem' }}>
        {typeof value === 'number' ? animated.toLocaleString('vi-VN') : value}
      </div>
      {chartData && (
        <MiniBarChart data={chartData} color={chartColor || '#c5a059'} />
      )}
    </div>
  );
}

/* ── Activity Item ── */
function ActivityItem({ icon, text, time }) {
  return (
    <div style={{
      display: 'flex', gap: '0.8rem', alignItems: 'center',
      padding: '0.7rem 0.9rem', borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.03)',
      transition: 'background 0.2s',
    }}>
      <div style={{ padding: '0.4rem', background: 'rgba(197,160,89,0.08)', borderRadius: '8px', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{time}</div>
      </div>
    </div>
  );
}

/* ── Health Item ── */
function HealthItem({ label, status, color, pulse = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0' }}>
      <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{label}</span>
      <span style={{ color, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color,
          boxShadow: pulse ? `0 0 6px ${color}` : 'none',
          animation: pulse ? 'hPulse 2s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />
        {status}
      </span>
    </div>
  );
}

/* ── Quick Action ── */
function QuickAction({ icon, label, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}22`,
        borderRadius: '12px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        width: '100%',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}10`;
        e.currentTarget.style.borderColor = `${color}44`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        e.currentTarget.style.borderColor = `${color}22`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{icon}</div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</div>
    </button>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMasters: 0, totalUsers: 0, totalLaSo: 0, totalDiscussions: 0,
    totalInterpretations: 0, activeUsers: 0, newUsersThisMonth: 0,
    newLaSoThisMonth: 0, recentLaSo: [], recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [crawlStatus, setCrawlStatus] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fake sparkline data
  const mockSparkline = (peak, len = 7) =>
    Array.from({ length: len }, (_, i) => ({
      label: `T${i + 1}`,
      value: Math.floor(peak * (0.4 + Math.random() * 0.6)),
    }));

  const handleCrawl = async () => {
    setCrawling(true);
    setCrawlStatus(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/admin/crawl-forum`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrawlStatus({ success: res.data.success, message: res.data.message, data: res.data.data });
    } catch (error) {
      setCrawlStatus({ success: false, message: 'Lỗi kết nối API Server!' });
    } finally {
      setCrawling(false);
    }
  };

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
        setLastRefresh(new Date());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        {/* Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ height: '32px', width: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.5rem', animation: 'skelPulse 1.5s ease infinite' }} />
          <div style={{ height: '16px', width: '200px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', animation: 'skelPulse 1.5s ease infinite 0.15s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '1.5rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ ...cardStyle, height: '130px', animation: 'skelPulse 1.5s ease infinite' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ ...cardStyle, height: '130px', animation: `skelPulse 1.5s ease ${i * 0.1}s infinite` }} />
          ))}
        </div>
        <style>{`@keyframes skelPulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
      </div>
    );
  }

  const activeRate = stats.totalUsers > 0
    ? Math.round(stats.activeUsers / stats.totalUsers * 100)
    : 0;

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @keyframes dashCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hPulse {
          0%,100% { box-shadow: 0 0 0 0 currentColor; }
          50%      { box-shadow: 0 0 6px 2px currentColor; }
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', color: '#fff', fontWeight: 800 }}>
            🔮 Tổng Quan Hệ Thống
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Cập nhật lúc {lastRefresh.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            background: 'rgba(197,160,89,0.08)',
            border: '1px solid rgba(197,160,89,0.2)',
            borderRadius: '10px',
            color: '#c5a059', fontSize: '0.85rem', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RefreshCw size={15} /> Làm mới
        </button>
      </header>

      {/* ── Stats Row 1 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <StatCard
          icon={<Users size={22} color="#c5a059" />}
          label="Tổng Người Dùng"
          value={stats.totalUsers}
          trend={`+${stats.newUsersThisMonth} tháng này`}
          trendColor="#10b981"
          chartData={mockSparkline(stats.newUsersThisMonth + 5)}
          chartColor="#c5a059"
          delay={0}
        />
        <StatCard
          icon={<UserCheck size={22} color="#10b981" />}
          label="Đang Hoạt Động"
          value={stats.activeUsers}
          trend={`${activeRate}% tổng số`}
          trendColor="#10b981"
          chartData={mockSparkline(stats.activeUsers + 3)}
          chartColor="#10b981"
          delay={80}
        />
        <StatCard
          icon={<Star size={22} color="#f59e0b" />}
          label="Lá Số Đã Lập"
          value={stats.totalLaSo}
          trend={`+${stats.newLaSoThisMonth} tháng này`}
          trendColor="#f59e0b"
          chartData={mockSparkline(stats.newLaSoThisMonth + 3)}
          chartColor="#f59e0b"
          delay={160}
        />
        <StatCard
          icon={<MessageSquare size={22} color="#8b5cf6" />}
          label="Bài Thảo Luận"
          value={stats.totalDiscussions}
          trend="Cộng đồng"
          trendColor="#8b5cf6"
          chartData={mockSparkline(10)}
          chartColor="#8b5cf6"
          delay={240}
        />
      </div>

      {/* ── Stats Row 2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          icon={<UserCheck size={22} color="#3b82f6" />}
          label="Chuyên Gia Tử Vi"
          value={stats.totalMasters}
          trend="Thầy luận giải"
          trendColor="#3b82f6"
          delay={0}
        />
        <StatCard
          icon={<BookOpen size={22} color="#ec4899" />}
          label="Luận Giải"
          value={stats.totalInterpretations}
          trend="Kho tri thức"
          trendColor="#ec4899"
          delay={80}
        />
        <StatCard
          icon={<FileText size={22} color="#14b8a6" />}
          label="Users Mới Tháng Này"
          value={stats.newUsersThisMonth}
          trend="↑ vs tháng trước"
          trendColor="#14b8a6"
          delay={160}
        />
        <StatCard
          icon={<TrendingUp size={22} color="#c5a059" />}
          label="Lá Số Mới Tháng Này"
          value={stats.newLaSoThisMonth}
          trend="Tháng này"
          trendColor="#c5a059"
          delay={240}
        />
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent LaSo */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} color="#f59e0b" /> Lá Số Mới Nhất
              </h3>
              <span style={{ color: '#475569', fontSize: '0.78rem', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: '6px' }}>
                5 gần nhất
              </span>
            </div>
            {stats.recentLaSo.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                <p style={{ fontSize: '0.85rem' }}>Chưa có lá số nào được lập</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {stats.recentLaSo.map((ls, i) => (
                  <ActivityItem
                    key={i}
                    icon={<Star size={15} color="#f59e0b" />}
                    text={`${ls.hoTen} (${ls.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}) đã lập lá số`}
                    time={timeAgo(ls.createdAt)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#3b82f6" /> Người Dùng Mới Nhất
              </h3>
              <span style={{ color: '#475569', fontSize: '0.78rem', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: '6px' }}>
                5 gần nhất
              </span>
            </div>
            {stats.recentUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                <p style={{ fontSize: '0.85rem' }}>Chưa có người dùng nào</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {stats.recentUsers.map((u, i) => (
                  <ActivityItem
                    key={i}
                    icon={<Users size={15} color="#3b82f6" />}
                    text={`${u.hoTen} (${u.email}) — ${roleBadge(u.role)}`}
                    time={timeAgo(u.createdAt)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: System + Crawler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* System Health */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} color="#10b981" /> Trạng Thái Hệ Thống
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <HealthItem label="Database" status="Ổn định" color="#10b981" pulse />
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '0.4rem 0' }} />
              <HealthItem label="API Server" status="Hoạt động" color="#10b981" pulse />
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '0.4rem 0' }} />
              <HealthItem label="Users Active" status={`${stats.activeUsers} users`} color="#3b82f6" />
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '0.4rem 0' }} />
              <HealthItem label="Lá số tháng này" status={`+${stats.newLaSoThisMonth}`} color="#f59e0b" />
            </div>
          </div>

          {/* Quick Actions */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#c5a059" /> Thao Tác Nhanh
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <QuickAction icon="👥" label="Users" desc="Quản lý người dùng" color="#3b82f6" onClick={() => window.location.href = '/users'} />
              <QuickAction icon="🔮" label="Lập Lá Số" desc="Lập lá số mới" color="#f59e0b" onClick={() => window.location.href = '/lap-la-so'} />
              <QuickAction icon="📚" label="Luận Giải" desc="Quản lý luận giải" color="#ec4899" onClick={() => window.location.href = '/interpretations'} />
              <QuickAction icon="🧙" label="Chuyên Gia" desc="Quản lý thầy" color="#8b5cf6" onClick={() => window.location.href = '/masters'} />
            </div>
          </div>

          {/* Forum Crawler */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🤖 Cào Dữ Liệu Diễn Đàn
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              Thu thập bài đăng từ <strong style={{ color: '#94a3b8' }}>tuvivietnam.vn</strong> và <strong style={{ color: '#94a3b8' }}>lyso.vn</strong>.
            </p>
            {crawlStatus && (
              <div style={{
                padding: '0.7rem', borderRadius: '8px', marginBottom: '0.8rem',
                background: crawlStatus.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                color: crawlStatus.success ? '#10b981' : '#ef4444',
                fontSize: '0.8rem',
                border: `1px solid ${crawlStatus.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {crawlStatus.message}
                {crawlStatus.data && (
                  <div style={{ fontSize: '0.72rem', marginTop: '4px', color: '#94a3b8' }}>
                    Cào: {crawlStatus.data.totalCrawled} | Lưu mới: {crawlStatus.data.savedToDb}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleCrawl}
              disabled={crawling}
              style={{
                width: '100%',
                background: crawling ? '#334155' : 'linear-gradient(135deg, #c5a059, #e2b04a)',
                color: crawling ? '#94a3b8' : '#1a1a2e',
                border: 'none',
                padding: '0.7rem',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: crawling ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              {crawling ? (
                <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Đang cào...</>
              ) : (
                <>📥 Cào Dữ Liệu Ngay</>
              )}
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

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.7)',
  padding: '1.4rem',
  borderRadius: '16px',
  border: '1px solid rgba(197, 160, 89, 0.12)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
};
