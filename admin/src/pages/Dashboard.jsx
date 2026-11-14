import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, BookOpen, TrendingUp, Clock,
  MessageSquare, Star, Activity, UserCheck,
  FileText, Zap, RefreshCw, Database,
  Server, Eye, BarChart2, ArrowUpRight,
  Sparkles, Shield, Globe, ChevronRight,
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

/* ── Mini Sparkline (CSS) ── */
function MiniSparkline({ data, color }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px' }}>
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.label}: ${d.value}`}
          style={{
            flex: 1,
            background: color,
            borderRadius: '3px 3px 0 0',
            height: `${Math.max((d.value / max) * 100, 8)}%`,
            opacity: 0.35 + (i / data.length) * 0.65,
            transition: 'height 0.6s ease',
          }}
        />
      ))}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, trend, trendUp = true, bgColor, iconBg, iconColor, chartData, chartColor, delay = 0 }) {
  const animated = useCounter(typeof value === 'number' ? value : 0, 1200 + delay);
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '1.4rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      animation: `cardSlideIn 0.5s ease ${delay}ms both`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
      }}
    >
      {/* Accent bar top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: bgColor || 'linear-gradient(90deg, #c5a059, #e2b04a)',
        borderRadius: '16px 16px 0 0',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', marginTop: '0.3rem' }}>
        <div style={{
          width: '44px', height: '44px',
          background: iconBg || 'rgba(197,160,89,0.1)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { size: 20, color: iconColor || '#c5a059' })}
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          color: trendUp ? '#059669' : '#dc2626',
          fontSize: '0.75rem', fontWeight: 700,
          background: trendUp ? '#f0fdf4' : '#fef2f2',
          padding: '3px 8px', borderRadius: '99px',
          maxWidth: '120px', textAlign: 'right',
        }}>
          <ArrowUpRight size={12} style={{ transform: trendUp ? 'none' : 'rotate(90deg)' }} />
          {trend}
        </span>
      </div>

      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', lineHeight: 1, marginBottom: '0.9rem' }}>
        {typeof value === 'number' ? animated.toLocaleString('vi-VN') : value}
      </div>

      {chartData && (
        <MiniSparkline data={chartData} color={chartColor || '#c5a059'} />
      )}
    </div>
  );
}

/* ── Activity Item ── */
function ActivityItem({ icon, text, time, color }) {
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'center',
      padding: '0.7rem 0.9rem',
      borderRadius: '10px',
      background: '#fafafa',
      border: '1px solid #f1f5f9',
      transition: 'background 0.18s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
    >
      <div style={{
        width: '32px', height: '32px',
        background: color ? `${color}15` : 'rgba(197,160,89,0.1)',
        borderRadius: '8px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { size: 14, color: color || '#c5a059' })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.855rem', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
          {text}
        </div>
        <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '1px' }}>{time}</div>
      </div>
    </div>
  );
}

/* ── Health Item ── */
function HealthItem({ label, status, color, pulse = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0' }}>
      <span style={{ color: '#64748b', fontSize: '0.855rem' }}>{label}</span>
      <span style={{ color, fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color,
          boxShadow: pulse ? `0 0 0 0 ${color}` : 'none',
          animation: pulse ? 'hPulse 2s ease-in-out infinite' : 'none',
          flexShrink: 0,
          display: 'inline-block',
        }} />
        {status}
      </span>
    </div>
  );
}

/* ── Quick Action ── */
function QuickAction({ icon, label, desc, color, iconBg, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fafafa',
        border: '1.5px solid #e2e8f0',
        borderRadius: '14px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        width: '100%',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 16px ${color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#fafafa';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: '36px', height: '36px',
        background: iconBg || `${color}15`,
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '0.6rem',
      }}>
        {React.cloneElement(icon, { size: 18, color })}
      </div>
      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{desc}</div>
    </button>
  );
}

/* ── Section Card ── */
function SectionCard({ title, icon, iconColor, badge, children }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.1rem 1.4rem',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
          {React.cloneElement(icon, { size: 17, color: iconColor })}
          {title}
        </h3>
        {badge && (
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', background: '#f8fafc', padding: '3px 10px', borderRadius: '99px', border: '1px solid #e2e8f0' }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: '1.1rem 1.4rem' }}>
        {children}
      </div>
    </div>
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
        <style>{`@keyframes skelPulse { 0%,100%{opacity:.5} 50%{opacity:.9} }`}</style>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ height: '28px', width: '280px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '0.5rem', animation: 'skelPulse 1.5s ease infinite' }} />
          <div style={{ height: '14px', width: '180px', background: '#f1f5f9', borderRadius: '6px', animation: 'skelPulse 1.5s ease infinite 0.15s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '140px', background: '#e2e8f0', borderRadius: '16px', animation: `skelPulse 1.5s ease ${i * 0.1}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  const activeRate = stats.totalUsers > 0
    ? Math.round(stats.activeUsers / stats.totalUsers * 100)
    : 0;

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.4); }
          70%      { box-shadow: 0 0 0 5px rgba(5,150,105,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c5a059, #e2b04a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(197,160,89,0.3)' }}>
              <BarChart2 size={18} color="#fff" />
            </div>
            Tổng Quan Hệ Thống
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} />
            Cập nhật lúc {lastRefresh.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            color: '#64748b', fontSize: '0.84rem', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c5a059'; e.currentTarget.style.color = '#c5a059'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* ── Stats Row 1 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <StatCard
          icon={<Users />}
          label="Tổng Người Dùng"
          value={stats.totalUsers}
          trend={`+${stats.newUsersThisMonth} tháng này`}
          trendUp={true}
          bgColor="linear-gradient(90deg, #c5a059, #e2b04a)"
          iconBg="rgba(197,160,89,0.1)"
          iconColor="#c5a059"
          chartData={mockSparkline(stats.newUsersThisMonth + 5)}
          chartColor="#c5a059"
          delay={0}
        />
        <StatCard
          icon={<UserCheck />}
          label="Đang Hoạt Động"
          value={stats.activeUsers}
          trend={`${activeRate}% tổng số`}
          trendUp={true}
          bgColor="linear-gradient(90deg, #059669, #10b981)"
          iconBg="rgba(5,150,105,0.1)"
          iconColor="#059669"
          chartData={mockSparkline(stats.activeUsers + 3)}
          chartColor="#059669"
          delay={80}
        />
        <StatCard
          icon={<Sparkles />}
          label="Lá Số Đã Lập"
          value={stats.totalLaSo}
          trend={`+${stats.newLaSoThisMonth} tháng này`}
          trendUp={true}
          bgColor="linear-gradient(90deg, #d97706, #f59e0b)"
          iconBg="rgba(217,119,6,0.1)"
          iconColor="#d97706"
          chartData={mockSparkline(stats.newLaSoThisMonth + 3)}
          chartColor="#d97706"
          delay={160}
        />
        <StatCard
          icon={<MessageSquare />}
          label="Bài Thảo Luận"
          value={stats.totalDiscussions}
          trend="Cộng đồng"
          trendUp={true}
          bgColor="linear-gradient(90deg, #7c3aed, #8b5cf6)"
          iconBg="rgba(124,58,237,0.1)"
          iconColor="#7c3aed"
          chartData={mockSparkline(10)}
          chartColor="#7c3aed"
          delay={240}
        />
      </div>

      {/* ── Stats Row 2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          icon={<Shield />}
          label="Chuyên Gia Tử Vi"
          value={stats.totalMasters}
          trend="Thầy luận giải"
          trendUp={true}
          bgColor="linear-gradient(90deg, #2563eb, #3b82f6)"
          iconBg="rgba(37,99,235,0.1)"
          iconColor="#2563eb"
          delay={0}
        />
        <StatCard
          icon={<BookOpen />}
          label="Luận Giải"
          value={stats.totalInterpretations}
          trend="Kho tri thức"
          trendUp={true}
          bgColor="linear-gradient(90deg, #db2777, #ec4899)"
          iconBg="rgba(219,39,119,0.1)"
          iconColor="#db2777"
          delay={80}
        />
        <StatCard
          icon={<TrendingUp />}
          label="Users Mới Tháng Này"
          value={stats.newUsersThisMonth}
          trend="↑ vs tháng trước"
          trendUp={true}
          bgColor="linear-gradient(90deg, #0d9488, #14b8a6)"
          iconBg="rgba(13,148,136,0.1)"
          iconColor="#0d9488"
          delay={160}
        />
        <StatCard
          icon={<Activity />}
          label="Lá Số Mới Tháng Này"
          value={stats.newLaSoThisMonth}
          trend="Tháng này"
          trendUp={true}
          bgColor="linear-gradient(90deg, #ea580c, #f97316)"
          iconBg="rgba(234,88,12,0.1)"
          iconColor="#ea580c"
          delay={240}
        />
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Left: Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Recent LaSo */}
          <SectionCard
            title="Lá Số Mới Nhất"
            icon={<Sparkles />}
            iconColor="#d97706"
            badge="5 gần nhất"
          >
            {stats.recentLaSo.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔮</div>
                <p style={{ fontSize: '0.85rem' }}>Chưa có lá số nào được lập</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stats.recentLaSo.map((ls, i) => (
                  <ActivityItem
                    key={i}
                    icon={<Sparkles />}
                    text={`${ls.hoTen} (${ls.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}) đã lập lá số`}
                    time={timeAgo(ls.createdAt)}
                    color="#d97706"
                  />
                ))}
              </div>
            )}
          </SectionCard>

          {/* Recent Users */}
          <SectionCard
            title="Người Dùng Mới Nhất"
            icon={<Users />}
            iconColor="#2563eb"
            badge="5 gần nhất"
          >
            {stats.recentUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
                <p style={{ fontSize: '0.85rem' }}>Chưa có người dùng nào</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stats.recentUsers.map((u, i) => (
                  <ActivityItem
                    key={i}
                    icon={<Users />}
                    text={`${u.hoTen} (${u.email}) — ${roleBadge(u.role)}`}
                    time={timeAgo(u.createdAt)}
                    color="#2563eb"
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: System + Actions + Crawler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* System Health */}
          <SectionCard title="Trạng Thái Hệ Thống" icon={<Server />} iconColor="#059669">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <HealthItem label="Database" status="Ổn định" color="#059669" pulse />
              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.2rem 0' }} />
              <HealthItem label="API Server" status="Hoạt động" color="#059669" pulse />
              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.2rem 0' }} />
              <HealthItem label="Users Online" status={`${stats.activeUsers} users`} color="#2563eb" />
              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.2rem 0' }} />
              <HealthItem label="Lá số tháng này" status={`+${stats.newLaSoThisMonth}`} color="#d97706" />
            </div>
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Thao Tác Nhanh" icon={<Zap />} iconColor="#c5a059">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <QuickAction
                icon={<Users />}
                label="Users"
                desc="Quản lý người dùng"
                color="#2563eb"
                iconBg="rgba(37,99,235,0.1)"
                onClick={() => window.location.href = '/users'}
              />
              <QuickAction
                icon={<Sparkles />}
                label="Lập Lá Số"
                desc="Lập lá số mới"
                color="#d97706"
                iconBg="rgba(217,119,6,0.1)"
                onClick={() => window.location.href = '/lap-la-so'}
              />
              <QuickAction
                icon={<BookOpen />}
                label="Luận Giải"
                desc="Quản lý luận giải"
                color="#db2777"
                iconBg="rgba(219,39,119,0.1)"
                onClick={() => window.location.href = '/interpretations'}
              />
              <QuickAction
                icon={<Shield />}
                label="Chuyên Gia"
                desc="Quản lý thầy"
                color="#7c3aed"
                iconBg="rgba(124,58,237,0.1)"
                onClick={() => window.location.href = '/masters'}
              />
            </div>
          </SectionCard>

          {/* Forum Crawler */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(124,58,237,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={15} color="#7c3aed" />
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>Cào Dữ Liệu Diễn Đàn</h3>
            </div>
            <div style={{ padding: '1.1rem 1.4rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Thu thập bài đăng từ <strong style={{ color: '#334155' }}>tuvivietnam.vn</strong> và <strong style={{ color: '#334155' }}>lyso.vn</strong>.
              </p>
              {crawlStatus && (
                <div style={{
                  padding: '0.7rem 0.9rem', borderRadius: '10px', marginBottom: '0.9rem',
                  background: crawlStatus.success ? '#f0fdf4' : '#fef2f2',
                  color: crawlStatus.success ? '#059669' : '#dc2626',
                  fontSize: '0.82rem',
                  border: `1px solid ${crawlStatus.success ? '#bbf7d0' : '#fecaca'}`,
                }}>
                  {crawlStatus.message}
                  {crawlStatus.data && (
                    <div style={{ fontSize: '0.73rem', marginTop: '4px', color: '#64748b' }}>
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
                  background: crawling ? '#f1f5f9' : 'linear-gradient(135deg, #c5a059, #e2b04a)',
                  color: crawling ? '#94a3b8' : '#fff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: crawling ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: crawling ? 'none' : '0 4px 12px rgba(197,160,89,0.35)',
                }}
              >
                {crawling ? (
                  <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Đang cào...</>
                ) : (
                  <><Globe size={15} /> Cào Dữ Liệu Ngay</>
                )}
              </button>
            </div>
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
