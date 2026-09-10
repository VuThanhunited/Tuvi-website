import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './UsersCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');

const ROLE_OPTIONS = ['user', 'master', 'admin'];
const ROLE_LABELS = { admin: '👑 Admin', master: '🔮 Chuyên gia', user: '👤 User' };
const ROLE_CLASS  = { admin: 'badge-admin', master: 'badge-master', user: 'badge-user' };

function exportCSV(users) {
  const headers = ['STT', 'Họ Tên', 'Email', 'Role', 'Credits', 'Trạng Thái', 'Ngày Đăng Ký'];
  const rows = users.map((u, i) => [
    i + 1,
    u.hoTen || '',
    u.email,
    u.role,
    u.credits || 0,
    u.isActive ? 'Hoạt động' : 'Đã khóa',
    u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `users_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function UsersCMS() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [creditModal, setCreditModal] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [detailUser, setDetailUser] = useState(null);
  const [sortCol, setSortCol] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)      params.append('search', search);
      if (roleFilter)  params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await axios.get(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) {
        setUsers(res.data.data.users || []);
        setPagination(res.data.data.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch {
      showStatus(false, 'Lỗi tải danh sách người dùng');
    } finally { setLoading(false); }
  }, [search, roleFilter, statusFilter]);

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
        if (detailUser?._id === userId) {
          setDetailUser(prev => ({ ...prev, isActive: !prev.isActive }));
        }
      }
    } catch (err) { showStatus(false, err.response?.data?.message || 'Lỗi thao tác'); }
    finally { setActionLoading(null); }
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
        if (detailUser?._id === userId) setDetailUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) { showStatus(false, err.response?.data?.message || 'Lỗi đổi role'); }
    finally { setActionLoading(null); }
  };

  const handleAddCredits = async () => {
    if (!creditModal || !creditModal.credits || parseInt(creditModal.credits) <= 0) {
      showStatus(false, 'Số credits phải lớn hơn 0'); return;
    }
    setActionLoading(creditModal.userId + '_credits');
    try {
      const res = await axios.put(
        `${API_URL}/admin/users/${creditModal.userId}/credits`,
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
    } catch (err) { showStatus(false, err.response?.data?.message || 'Lỗi cấp credits'); }
    finally { setActionLoading(null); }
  };

  /* ── Bulk Actions ── */
  const allSelected = users.length > 0 && users.every(u => selectedIds.has(u._id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map(u => u._id)));
  };

  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const handleBulkLock = async () => {
    if (!window.confirm(`Khóa ${selectedIds.size} người dùng?`)) return;
    for (const id of selectedIds) {
      const u = users.find(x => x._id === id);
      if (u?.isActive) await handleToggleActive(id);
    }
    setSelectedIds(new Set());
  };

  const handleBulkUnlock = async () => {
    if (!window.confirm(`Mở khóa ${selectedIds.size} người dùng?`)) return;
    for (const id of selectedIds) {
      const u = users.find(x => x._id === id);
      if (!u?.isActive) await handleToggleActive(id);
    }
    setSelectedIds(new Set());
  };

  /* ── Sort ── */
  const sortedUsers = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'createdAt') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, sortCol, sortDir]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const sortIcon = (col) => sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div className="ucms">
      {/* ── Header ── */}
      <header className="ucms__header">
        <div>
          <h1 className="ucms__title">Quản Lý Người Dùng</h1>
          <p className="ucms__subtitle">Xem, phân quyền, khóa/mở khóa tài khoản và cấp Credits</p>
        </div>
        <div className="ucms__header-actions">
          <div className="ucms__total-badge">
            Tổng: <strong>{pagination.total.toLocaleString('vi-VN')}</strong>
          </div>
          <button
            className="ucms__btn-export"
            onClick={() => exportCSV(users)}
            title="Xuất CSV"
          >
            📥 Xuất CSV
          </button>
        </div>
      </header>

      {/* ── Status ── */}
      {statusMsg && (
        <div className={`ucms__status ${statusMsg.success ? 'success' : 'error'}`}>
          {statusMsg.success ? '✅' : '❌'} {statusMsg.message}
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="ucms__filter-bar">
        <div className="ucms__search-wrap">
          <span className="ucms__search-icon">🔍</span>
          <input
            className="ucms__search"
            type="text"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers(1)}
          />
        </div>
        <select className="ucms__select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">Tất cả Role</option>
          <option value="user">👤 User</option>
          <option value="master">🔮 Chuyên gia</option>
          <option value="admin">👑 Admin</option>
        </select>
        <select className="ucms__select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tất cả Trạng Thái</option>
          <option value="active">🟢 Hoạt động</option>
          <option value="locked">🔴 Đã khóa</option>
        </select>
        <button className="ucms__btn-search" onClick={() => fetchUsers(1)}>Tìm</button>
        <button className="ucms__btn-reset" onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}>Reset</button>
      </div>

      {/* ── Bulk Actions Bar ── */}
      {someSelected && (
        <div className="ucms__bulk-bar">
          <span className="ucms__bulk-info">Đã chọn <strong>{selectedIds.size}</strong> người dùng</span>
          <button className="ucms__bulk-btn ucms__bulk-btn--lock" onClick={handleBulkLock}>🔒 Khóa tất cả</button>
          <button className="ucms__bulk-btn ucms__bulk-btn--unlock" onClick={handleBulkUnlock}>🔓 Mở tất cả</button>
          <button className="ucms__bulk-btn ucms__bulk-btn--clear" onClick={() => setSelectedIds(new Set())}>✕ Bỏ chọn</button>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div className="ucms__loading">
          <div className="ucms__spinner" />
          Đang tải danh sách người dùng...
        </div>
      ) : users.length === 0 ? (
        <div className="ucms__empty">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🕵️</div>
          <p>Không tìm thấy người dùng nào.</p>
        </div>
      ) : (
        <div className="ucms__table-wrapper">
          <table className="ucms__table">
            <thead>
              <tr>
                <th className="ucms__th-check">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="ucms__checkbox" />
                </th>
                <th>#</th>
                <th onClick={() => toggleSort('hoTen')} className="ucms__th-sort">
                  Họ Tên{sortIcon('hoTen')}
                </th>
                <th onClick={() => toggleSort('email')} className="ucms__th-sort">
                  Email{sortIcon('email')}
                </th>
                <th>Role</th>
                <th onClick={() => toggleSort('credits')} className="ucms__th-sort">
                  Credits{sortIcon('credits')}
                </th>
                <th>Trạng Thái</th>
                <th onClick={() => toggleSort('createdAt')} className="ucms__th-sort">
                  Ngày ĐK{sortIcon('createdAt')}
                </th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u, i) => (
                <tr
                  key={u._id}
                  className={`${!u.isActive ? 'row-inactive' : ''} ${selectedIds.has(u._id) ? 'row-selected' : ''}`}
                >
                  <td className="ucms__td-check">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(u._id)}
                      onChange={() => toggleOne(u._id)}
                      className="ucms__checkbox"
                    />
                  </td>
                  <td className="ucms__td-num">{(pagination.page - 1) * 15 + i + 1}</td>
                  <td className="ucms__td-name">
                    <button className="ucms__name-link" onClick={() => setDetailUser(u)}>
                      <div className="ucms__avatar">
                        {(u.hoTen || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      {u.hoTen || '—'}
                    </button>
                  </td>
                  <td className="ucms__td-email">{u.email}</td>
                  <td>
                    <select
                      className={`ucms__role-select ${ROLE_CLASS[u.role] || ''}`}
                      value={u.role}
                      onChange={e => handleChangeRole(u._id, e.target.value)}
                      disabled={actionLoading === u._id + '_role'}
                    >
                      {ROLE_OPTIONS.map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="ucms__td-credits">
                    <span className="ucms__credits-value">{(u.credits || 0).toLocaleString('vi-VN')}</span>
                    <button
                      className="ucms__btn-credits-sm"
                      onClick={() => setCreditModal({ userId: u._id, hoTen: u.hoTen, credits: '' })}
                      title="Cấp thêm credits"
                    >+</button>
                  </td>
                  <td>
                    <span className={`ucms__status-badge ${u.isActive ? 'active' : 'locked'}`}>
                      <span className="ucms__status-dot" />
                      {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="ucms__td-date">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <div className="ucms__action-row">
                      <button
                        className="ucms__btn-info"
                        onClick={() => setDetailUser(u)}
                        title="Chi tiết"
                      >👁️</button>
                      <button
                        className={`ucms__btn-toggle ${u.isActive ? 'btn-lock' : 'btn-unlock'}`}
                        onClick={() => handleToggleActive(u._id)}
                        disabled={actionLoading === u._id}
                      >
                        {actionLoading === u._id ? '⏳' : (u.isActive ? '🔒' : '🔓')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
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
            Trang {pagination.page}/{pagination.pages} — {pagination.total} users
          </span>
        </div>
      )}

      {/* ── User Detail Side Panel ── */}
      {detailUser && (
        <div className="ucms__detail-overlay" onClick={() => setDetailUser(null)}>
          <div className="ucms__detail-panel" onClick={e => e.stopPropagation()}>
            <div className="ucms__detail-header">
              <h3>Chi Tiết Người Dùng</h3>
              <button className="ucms__detail-close" onClick={() => setDetailUser(null)}>✕</button>
            </div>
            <div className="ucms__detail-body">
              <div className="ucms__detail-avatar-big">
                {(detailUser.hoTen || detailUser.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="ucms__detail-name">{detailUser.hoTen || 'Chưa đặt tên'}</div>
              <div className="ucms__detail-email">{detailUser.email}</div>
              <div className={`ucms__detail-status ${detailUser.isActive ? 'active' : 'locked'}`}>
                {detailUser.isActive ? '🟢 Đang hoạt động' : '🔴 Đã bị khóa'}
              </div>

              <div className="ucms__detail-grid">
                <div className="ucms__detail-field">
                  <div className="ucms__detail-field-label">Role</div>
                  <div className={`ucms__detail-field-value ${ROLE_CLASS[detailUser.role]}`}>
                    {ROLE_LABELS[detailUser.role] || detailUser.role}
                  </div>
                </div>
                <div className="ucms__detail-field">
                  <div className="ucms__detail-field-label">Credits</div>
                  <div className="ucms__detail-field-value ucms__detail-credits">
                    {(detailUser.credits || 0).toLocaleString('vi-VN')} 💎
                  </div>
                </div>
                <div className="ucms__detail-field">
                  <div className="ucms__detail-field-label">Giới tính</div>
                  <div className="ucms__detail-field-value">{detailUser.gioiTinh === 'nam' ? '♂ Nam' : detailUser.gioiTinh === 'nu' ? '♀ Nữ' : '—'}</div>
                </div>
                <div className="ucms__detail-field">
                  <div className="ucms__detail-field-label">Ngày Đăng Ký</div>
                  <div className="ucms__detail-field-value">
                    {detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                  </div>
                </div>
              </div>

              <div className="ucms__detail-actions">
                <button
                  className={`ucms__detail-btn ${detailUser.isActive ? 'btn-lock' : 'btn-unlock'}`}
                  onClick={() => handleToggleActive(detailUser._id)}
                >
                  {detailUser.isActive ? '🔒 Khóa tài khoản' : '🔓 Mở tài khoản'}
                </button>
                <button
                  className="ucms__detail-btn ucms__detail-btn--credits"
                  onClick={() => {
                    setCreditModal({ userId: detailUser._id, hoTen: detailUser.hoTen, credits: '' });
                    setDetailUser(null);
                  }}
                >
                  💎 Cấp Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Credit Modal ── */}
      {creditModal && (
        <div className="ucms__modal-overlay" onClick={() => setCreditModal(null)}>
          <div className="ucms__modal" onClick={e => e.stopPropagation()}>
            <h3 className="ucms__modal-title">💰 Cấp Credits</h3>
            <p className="ucms__modal-subtitle">
              Cấp thêm credits cho <strong>{creditModal.hoTen}</strong>
            </p>
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
                {actionLoading ? '⏳ Đang xử lý...' : '✅ Xác nhận cấp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
