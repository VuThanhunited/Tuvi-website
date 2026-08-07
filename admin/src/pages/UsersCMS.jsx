import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './UsersCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');

export default function UsersCMS() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // userId đang xử lý
  const [creditModal, setCreditModal] = useState(null); // { userId, hoTen, credits: '' }

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const res = await axios.get(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) {
        setUsers(res.data.data.users || []);
        setPagination(res.data.data.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch (err) {
      showStatus(false, 'Lỗi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const showStatus = (success, message) => {
    setStatusMsg({ success, message });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleToggleActive = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await axios.put(`${API_URL}/admin/users/${userId}/toggle-active`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) {
        showStatus(true, res.data.message);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
      }
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi thao tác');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    setActionLoading(userId + '_role');
    try {
      const res = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) {
        showStatus(true, res.data.message);
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi đổi role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddCredits = async () => {
    if (!creditModal || !creditModal.credits || parseInt(creditModal.credits) <= 0) {
      showStatus(false, 'Số credits phải lớn hơn 0');
      return;
    }
    setActionLoading(creditModal.userId + '_credits');
    try {
      const res = await axios.put(`${API_URL}/admin/users/${creditModal.userId}/credits`,
        { credits: parseInt(creditModal.credits) },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.success) {
        showStatus(true, res.data.message);
        setUsers(prev => prev.map(u =>
          u._id === creditModal.userId ? { ...u, credits: res.data.data.user.credits } : u
        ));
        setCreditModal(null);
      }
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi cấp credits');
    } finally {
      setActionLoading(null);
    }
  };

  const ROLE_OPTIONS = ['user', 'master', 'admin'];
  const roleLabel = (role) => ({ admin: '👑 Admin', master: '🔮 Chuyên gia', user: '👤 User' }[role] || role);
  const roleClass = (role) => ({ admin: 'badge-admin', master: 'badge-master', user: 'badge-user' }[role] || '');

  return (
    <div className="ucms">
      <header className="ucms__header">
        <div>
          <h1 className="ucms__title">👥 Quản Lý Người Dùng</h1>
          <p className="ucms__subtitle">Xem, phân quyền, khóa/mở khóa tài khoản và cấp Credits</p>
        </div>
        <div className="ucms__total-badge">
          Tổng: <strong>{pagination.total.toLocaleString('vi-VN')}</strong> người dùng
        </div>
      </header>

      {/* Status message */}
      {statusMsg && (
        <div className={`ucms__status ${statusMsg.success ? 'success' : 'error'}`}>
          {statusMsg.success ? '✅' : '❌'} {statusMsg.message}
        </div>
      )}

      {/* Filter bar */}
      <div className="ucms__filter-bar">
        <input
          className="ucms__search"
          type="text"
          placeholder="🔍 Tìm theo tên, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchUsers(1)}
        />
        <select
          className="ucms__select"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả Role</option>
          <option value="user">👤 User</option>
          <option value="master">🔮 Chuyên gia</option>
          <option value="admin">👑 Admin</option>
        </select>
        <button className="ucms__btn-search" onClick={() => fetchUsers(1)}>Tìm kiếm</button>
        <button className="ucms__btn-reset" onClick={() => { setSearch(''); setRoleFilter(''); }}>Đặt lại</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="ucms__loading">⏳ Đang tải danh sách người dùng...</div>
      ) : users.length === 0 ? (
        <div className="ucms__empty">Không tìm thấy người dùng nào.</div>
      ) : (
        <div className="ucms__table-wrapper">
          <table className="ucms__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Credits</th>
                <th>Trạng Thái</th>
                <th>Ngày Đăng Ký</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className={!u.isActive ? 'row-inactive' : ''}>
                  <td className="ucms__td-num">{(pagination.page - 1) * 15 + i + 1}</td>
                  <td className="ucms__td-name">{u.hoTen || '—'}</td>
                  <td className="ucms__td-email">{u.email}</td>
                  <td>
                    <select
                      className={`ucms__role-select ${roleClass(u.role)}`}
                      value={u.role}
                      onChange={e => handleChangeRole(u._id, e.target.value)}
                      disabled={actionLoading === u._id + '_role'}
                    >
                      {ROLE_OPTIONS.map(r => (
                        <option key={r} value={r}>{roleLabel(r)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="ucms__td-credits">
                    <span className="ucms__credits-value">{(u.credits || 0).toLocaleString('vi-VN')}</span>
                    <button
                      className="ucms__btn-credits-sm"
                      onClick={() => setCreditModal({ userId: u._id, hoTen: u.hoTen, credits: '' })}
                      title="Cấp credits"
                    >+</button>
                  </td>
                  <td>
                    <span className={`ucms__status-badge ${u.isActive ? 'active' : 'locked'}`}>
                      {u.isActive ? '🟢 Hoạt động' : '🔴 Đã khóa'}
                    </span>
                  </td>
                  <td className="ucms__td-date">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <button
                      className={`ucms__btn-toggle ${u.isActive ? 'btn-lock' : 'btn-unlock'}`}
                      onClick={() => handleToggleActive(u._id)}
                      disabled={actionLoading === u._id}
                    >
                      {actionLoading === u._id ? '...' : (u.isActive ? '🔒 Khóa' : '🔓 Mở')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="ucms__pagination">
          <button
            className="ucms__page-btn"
            disabled={pagination.page <= 1}
            onClick={() => fetchUsers(pagination.page - 1)}
          >← Trước</button>
          {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`ucms__page-btn ${p === pagination.page ? 'active' : ''}`}
              onClick={() => fetchUsers(p)}
            >{p}</button>
          ))}
          <button
            className="ucms__page-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchUsers(pagination.page + 1)}
          >Sau →</button>
          <span className="ucms__page-info">
            Trang {pagination.page}/{pagination.pages} — Tổng {pagination.total} users
          </span>
        </div>
      )}

      {/* Credit Modal */}
      {creditModal && (
        <div className="ucms__modal-overlay" onClick={() => setCreditModal(null)}>
          <div className="ucms__modal" onClick={e => e.stopPropagation()}>
            <h3 className="ucms__modal-title">💰 Cấp Credits</h3>
            <p className="ucms__modal-subtitle">Cấp thêm credits cho <strong>{creditModal.hoTen}</strong></p>
            <div className="ucms__modal-field">
              <label>Số Credits cần cấp</label>
              <input
                type="number"
                min={1}
                placeholder="Ví dụ: 100"
                value={creditModal.credits}
                onChange={e => setCreditModal(prev => ({ ...prev, credits: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAddCredits()}
                autoFocus
              />
            </div>
            <div className="ucms__modal-actions">
              <button className="ucms__btn-cancel" onClick={() => setCreditModal(null)}>Hủy</button>
              <button
                className="ucms__btn-confirm"
                onClick={handleAddCredits}
                disabled={!!actionLoading}
              >
                {actionLoading ? 'Đang xử lý...' : '✅ Xác nhận cấp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
