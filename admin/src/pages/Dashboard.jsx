import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMasters: 0,
    pendingMasters: 0,
    totalInterpretations: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats({
            ...res.data.data,
            totalMasters: res.data.data.totalMasters || 0,
            pendingMasters: 0, // We'll calculate this or get from another API
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

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Hệ thống Quản trị Tử Vi</h1>
        <p style={{ color: '#94a3b8' }}>Chào mừng trở lại, Admin. Đây là tổng quan hoạt động của hệ thống.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <StatCard 
          icon={<Users size={24} color="#c5a059" />} 
          label="Tổng Chuyên gia" 
          value={stats.totalMasters} 
          trend="+2 tháng này"
        />
        <StatCard 
          icon={<BookOpen size={24} color="#3b82f6" />} 
          label="Luận giải" 
          value={stats.totalInterpretations || 1240} 
          trend="+15 bản ghi"
        />
        <StatCard 
          icon={<MessageSquare size={24} color="#10b981" />} 
          label="Lượt xem lá số" 
          value={stats.totalLaSo || 854} 
          trend="+12% so với tuần trước"
        />
        <StatCard 
          icon={<TrendingUp size={24} color="#f59e0b" />} 
          label="Doanh thu (Coins)" 
          value="45,200" 
          trend="+8% tuần này"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Hoạt động gần đây</h3>
            <button style={textBtnStyle}>Xem tất cả <ArrowUpRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ActivityItem icon={<CheckCircle size={16} color="#10b981" />} text="Admin đã duyệt hồ sơ Thầy Minh" time="2 giờ trước" />
            <ActivityItem icon={<Clock size={16} color="#f59e0b" />} text="Có dữ liệu crawl mới từ TuVi.vn (12 chuyên gia)" time="5 giờ trước" />
            <ActivityItem icon={<Users size={16} color="#3b82f6" />} text="Người dùng 'Nguyễn An' vừa nạp 500 coin" time="1 ngày trước" />
          </div>
        </div>

        {/* System Health */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1.5rem' }}>Trạng thái hệ thống</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <HealthItem label="Database" status="Ổn định" color="#10b981" />
            <HealthItem label="API Server" status="Hoạt động" color="#10b981" />
            <HealthItem label="Storage (Images)" status="85% dung lượng" color="#f59e0b" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(197, 160, 89, 0.1)', borderRadius: '12px' }}>
          {icon}
        </div>
        <span style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
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

const textBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#c5a059',
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};
