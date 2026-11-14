import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Facebook, Clock, Send, Trash2, CheckCircle, XCircle, AlertCircle, Settings, Eye, Zap } from 'lucide-react';
import './FacebookImportCMS.css';
import SchedulePostTab from './SchedulePostTab.jsx';
import './SchedulePostTab.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: 'Bearer ' + getToken() });

const emptyForm = { title: '', content: '', author: '', imageUrl: '', originalUrl: '', likesCount: 0, commentsCount: 0 };
const emptyScheduleForm = { content: '', imageUrl: '', scheduledDate: '', scheduledTime: '08:00', sourceType: 'custom' };

// ── Helpers ──
const statusLabel = (s) => ({ pending: 'Chờ đăng', posted: 'Đã đăng', failed: 'Thất bại', cancelled: 'Đã hủy' }[s] || s);
const statusClass = (s) => ({ pending: 'badge--pending', posted: 'badge--posted', failed: 'badge--failed', cancelled: 'badge--cancelled' }[s] || '');

const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const TABS = [
  { key: 'manual', label: 'Nhập Thủ Công' },
  { key: 'api', label: 'Kéo Từ Page' },
  { key: 'list', label: '' }, // label set dynamically
  { key: 'schedule', label: '📅 Lên Lịch' },
  { key: 'scheduled-list', label: '' }, // label set dynamically
  { key: 'settings', label: '⚙️ Cài Đặt' },
];

export default function FacebookImportCMS() {
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [fetchingList, setFetchingList] = useState(false);
  const [manualForm, setManualForm] = useState(emptyForm);
  const [apiForm, setApiForm] = useState({ pageId: '', accessToken: '', limit: 10 });

  // Edit modal state
  const [editPost, setEditPost] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Scheduled posts state
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [scheduledPagination, setScheduledPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [fetchingScheduled, setFetchingScheduled] = useState(false);
  const [scheduledFilter, setScheduledFilter] = useState('');
  const [postingNow, setPostingNow] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // FB Settings state
  const [fbSettings, setFbSettings] = useState(null);
  const [fbLoading, setFbLoading] = useState(false);
  // User Token → Pages helper
  const [userToken, setUserToken] = useState('');
  const [fbPages, setFbPages] = useState([]);
  const [fetchingPages, setFetchingPages] = useState(false);
  const [copiedId, setCopiedId] = useState('');  // id page vừa copy token

  // ── Interpretation source picker ──
  const [interpretations, setInterpretations] = useState([]);
  const [interpSearch, setInterpSearch] = useState('');
  const [interpLoading, setInterpLoading] = useState(false);

  useEffect(() => { if (activeTab === 'list') fetchPosts(1); }, [activeTab]);
  useEffect(() => { if (activeTab === 'scheduled-list') fetchScheduledPosts(1); }, [activeTab]);
  useEffect(() => { if (activeTab === 'settings') loadFBSettings(); }, [activeTab]);

  const showStatus = (success, message) => {
    setStatus({ success, message });
    setTimeout(() => setStatus(null), 5000);
  };

  // ── Fetch imported FB posts ──
  const fetchPosts = async (page = 1) => {
    setFetchingList(true);
    try {
      const res = await axios.get(`${API_URL}/admin/facebook-posts?page=${page}&limit=15`, { headers: authHeader() });
      if (res.data.success) { setPosts(res.data.data); setPagination(res.data.pagination); }
    } catch (err) { console.error(err); }
    finally { setFetchingList(false); }
  };

  // ── Fetch scheduled posts ──
  const fetchScheduledPosts = useCallback(async (page = 1) => {
    setFetchingScheduled(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (scheduledFilter) params.set('status', scheduledFilter);
      const res = await axios.get(`${API_URL}/admin/scheduled-posts?${params}`, { headers: authHeader() });
      if (res.data.success) {
        setScheduledPosts(res.data.data);
        setScheduledPagination(res.data.pagination);
      }
    } catch (err) { console.error(err); }
    finally { setFetchingScheduled(false); }
  }, [scheduledFilter]);

  useEffect(() => { if (activeTab === 'scheduled-list') fetchScheduledPosts(1); }, [scheduledFilter]);

  // ── Load FB settings ──
  const loadFBSettings = async () => {
    setFbLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/fb-settings`, { headers: authHeader() });
      if (res.data.success) setFbSettings(res.data.data);
    } catch (err) { console.error(err); }
    finally { setFbLoading(false); }
  };

  // ── Manual submit ──
  const handleManualSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      const res = await axios.post(`${API_URL}/admin/import-facebook-post`, manualForm, { headers: authHeader() });
      showStatus(res.data.success, res.data.message);
      if (res.data.success) setManualForm(emptyForm);
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi kết nối!');
    } finally { setLoading(false); }
  };

  // ── API submit ──
  const handleApiSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      const res = await axios.post(`${API_URL}/admin/fetch-facebook-page`, apiForm, { headers: authHeader() });
      showStatus(res.data.success, res.data.message);
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi kết nối!');
    } finally { setLoading(false); }
  };

  // ── Delete imported post ──
  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/facebook-posts/${id}`, { headers: authHeader() });
      fetchPosts(pagination.page);
    } catch (err) { alert('Lỗi xóa bài viết'); }
  };

  // ── Edit handlers ──
  const openEdit = (post) => setEditPost({
    _id: post._id, title: post.title || '', content: post.content || '',
    author: post.author || '', imageUrl: post.imageUrl || '',
    originalUrl: post.originalUrl || '', likesCount: post.likesCount || 0, commentsCount: post.commentsCount || 0,
  });

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const res = await axios.put(`${API_URL}/admin/facebook-posts/${editPost._id}`, editPost, { headers: authHeader() });
      if (res.data.success) {
        showStatus(true, 'Đã cập nhật bài viết thành công!');
        setPosts(prev => prev.map(p => p._id === editPost._id ? res.data.data : p));
        setEditPost(null);
      } else { showStatus(false, res.data.message); }
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi cập nhật!');
    } finally { setEditLoading(false); }
  };

  // ── Schedule post ──
  const handleScheduleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      const scheduledAt = new Date(`${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}:00`).toISOString();
      const payload = {
        content: scheduleForm.content,
        imageUrl: scheduleForm.imageUrl,
        scheduledAt,
        sourceType: scheduleForm.sourceType,
      };
      const res = await axios.post(`${API_URL}/admin/scheduled-posts`, payload, { headers: authHeader() });
      showStatus(res.data.success, res.data.message);
      if (res.data.success) {
        setScheduleForm(emptyScheduleForm);
        setPreviewMode(false);
      }
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi lên lịch!');
    } finally { setLoading(false); }
  };

  // ── Delete scheduled post ──
  const handleDeleteScheduled = async (id) => {
    if (!window.confirm('Hủy lịch đăng bài này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/scheduled-posts/${id}`, { headers: authHeader() });
      fetchScheduledPosts(scheduledPagination.page);
      showStatus(true, 'Đã hủy lịch đăng bài.');
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi hủy lịch!');
    }
  };

  // ── Post now ──
  const handlePostNow = async (id) => {
    if (!window.confirm('Đăng ngay lập tức bài này lên Facebook?')) return;
    setPostingNow(id);
    try {
      const res = await axios.post(`${API_URL}/admin/scheduled-posts/${id}/post-now`, {}, { headers: authHeader() });
      showStatus(res.data.success, res.data.message);
      fetchScheduledPosts(scheduledPagination.page);
    } catch (err) {
      showStatus(false, err.response?.data?.message || 'Lỗi đăng bài!');
    } finally { setPostingNow(null); }
  };

  // ── Load interpretations for picker ──
  const searchInterpretations = async () => {
    setInterpLoading(true);
    try {
      const res = await axios.get(`${API_URL}/interpretations?search=${interpSearch}&limit=10`, { headers: authHeader() });
      if (res.data.success) setInterpretations(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setInterpLoading(false); }
  };

  const selectInterpretation = (interp) => {
    const hashtags = '\n\n#tửvi #tuvivi #luậngiải #phongthủy #tuviviet';
    setScheduleForm(prev => ({
      ...prev,
      content: `${interp.sao ? `✨ ${interp.sao}${interp.cung ? ` tại cung ${interp.cung}` : ''}\n\n` : ''}${interp.content}${hashtags}`,
      sourceType: 'interpretation',
    }));
    setInterpretations([]);
    setInterpSearch('');
  };

  // Dynamic tab labels
  const getTabLabel = (key) => {
    if (key === 'list') return `Đã Nhập (${pagination.total})`;
    if (key === 'scheduled-list') return `📋 Lịch Đăng (${scheduledPagination.total})`;
    return TABS.find(t => t.key === key)?.label || key;
  };

  return (
    <div className="fb-cms">
      <header className="fb-cms__header">
        <div className="fb-cms__header-icon">
          <Facebook size={26} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="fb-cms__title">Facebook Auto-Post</h1>
          <p className="fb-cms__subtitle">Quản lý bài viết và lên lịch đăng tự động lên Facebook Page</p>
        </div>
      </header>

      <div className="fb-cms__tabs">
        {TABS.map(t => (
          <button key={t.key} className={'fb-cms__tab' + (activeTab === t.key ? ' active' : '')} onClick={() => setActiveTab(t.key)}>
            {getTabLabel(t.key)}
          </button>
        ))}
      </div>

      {status && (
        <div className={'fb-cms__status ' + (status.success ? 'success' : 'error')}>
          {status.success ? '✅ ' : '❌ '}{status.message}
        </div>
      )}

      {/* ── Tab: Nhập thủ công ── */}
      {activeTab === 'manual' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>Nhập Bài Viết Thủ Công</h2>
            <p>Copy nội dung từ Facebook và điền vào form bên dưới</p>
          </div>
          <form onSubmit={handleManualSubmit} className="fb-cms__form">
            <div className="fb-cms__form-group full">
              <label>Nội dung bài viết *</label>
              <textarea rows={5} placeholder="Dán nội dung bài viết Facebook vào đây..."
                value={manualForm.content} onChange={e => setManualForm(p => ({ ...p, content: e.target.value }))} required />
            </div>
            <div className="fb-cms__form-row">
              <div className="fb-cms__form-group">
                <label>Tiêu đề (tùy chọn)</label>
                <input type="text" placeholder="Hệ thống tự tạo nếu để trống"
                  value={manualForm.title} onChange={e => setManualForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="fb-cms__form-group">
                <label>Tác giả</label>
                <input type="text" placeholder="Tên người đăng (có thể ẩn danh)"
                  value={manualForm.author} onChange={e => setManualForm(p => ({ ...p, author: e.target.value }))} />
              </div>
            </div>
            <div className="fb-cms__form-group full">
              <label>Link bài viết gốc (URL Facebook)</label>
              <input type="url" placeholder="https://www.facebook.com/..."
                value={manualForm.originalUrl} onChange={e => setManualForm(p => ({ ...p, originalUrl: e.target.value }))} />
            </div>
            <div className="fb-cms__form-group full">
              <label>URL ảnh đính kèm (nếu có)</label>
              <input type="url" placeholder="https://..."
                value={manualForm.imageUrl} onChange={e => setManualForm(p => ({ ...p, imageUrl: e.target.value }))} />
            </div>
            <div className="fb-cms__form-row">
              <div className="fb-cms__form-group">
                <label>Số lượt thích</label>
                <input type="number" min={0} value={manualForm.likesCount}
                  onChange={e => setManualForm(p => ({ ...p, likesCount: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="fb-cms__form-group">
                <label>Số bình luận</label>
                <input type="number" min={0} value={manualForm.commentsCount}
                  onChange={e => setManualForm(p => ({ ...p, commentsCount: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <button type="submit" className="fb-cms__btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu Bài Viết Vào Cộng Đồng'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Kéo từ Page ── */}
      {activeTab === 'api' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>Kéo Tự Động Từ Facebook Page</h2>
            <p>Sử dụng Facebook Graph API để lấy bài viết tự động. Cần có Page Access Token.</p>
          </div>
          <div className="fb-cms__info-box">
            <strong>Cách lấy Access Token:</strong>
            <ol>
              <li>Vào <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer">Graph API Explorer</a></li>
              <li>Chọn App và trang Facebook của bạn</li>
              <li>Chọn quyền: pages_read_engagement, pages_show_list</li>
              <li>Generate Access Token và dán vào ô bên dưới</li>
            </ol>
          </div>
          <form onSubmit={handleApiSubmit} className="fb-cms__form">
            <div className="fb-cms__form-row">
              <div className="fb-cms__form-group">
                <label>Page ID hoặc Username *</label>
                <input type="text" placeholder="Ví dụ: TuViVietNam hoặc 123456789"
                  value={apiForm.pageId} onChange={e => setApiForm(p => ({ ...p, pageId: e.target.value }))} required />
              </div>
              <div className="fb-cms__form-group">
                <label>Số bài cần kéo (tối đa 50)</label>
                <input type="number" min={1} max={50} value={apiForm.limit}
                  onChange={e => setApiForm(p => ({ ...p, limit: parseInt(e.target.value) || 10 }))} />
              </div>
            </div>
            <div className="fb-cms__form-group full">
              <label>Page Access Token *</label>
              <input type="password" placeholder="EAAxxxxxxxxx..."
                value={apiForm.accessToken} onChange={e => setApiForm(p => ({ ...p, accessToken: e.target.value }))} required />
            </div>
            <button type="submit" className="fb-cms__btn-primary" disabled={loading}>
              {loading ? 'Đang kéo bài từ Facebook...' : 'Kéo Bài Về Ngay'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Danh sách đã nhập ── */}
      {activeTab === 'list' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>Danh Sách Bài Viết Đã Nhập</h2>
            <p>Tổng cộng <strong>{pagination.total}</strong> bài viết từ Facebook</p>
          </div>
          {fetchingList ? (
            <div className="fb-cms__loading">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="fb-cms__empty"><p>Chưa có bài viết Facebook nào.</p></div>
          ) : (
            <>
              <div className="fb-cms__post-list">
                {posts.map(post => (
                  <div key={post._id} className="fb-cms__post-item">
                    {post.imageUrl && <img src={post.imageUrl} alt="" className="fb-cms__post-thumb" onError={e => { e.target.style.display = 'none'; }} />}
                    <div className="fb-cms__post-body">
                      <div className="fb-cms__post-meta">
                        <span className="fb-cms__badge">Facebook</span>
                        <span>{post.author}</span>
                        <span>{post.time}</span>
                        <span>Thích: {post.likesCount} · Bình luận: {post.commentsCount}</span>
                      </div>
                      <h3 className="fb-cms__post-title">{post.title}</h3>
                      <p className="fb-cms__post-content">{(post.content || '').substring(0, 200)}{(post.content || '').length > 200 ? '...' : ''}</p>
                      {post.originalUrl && (
                        <a href={post.originalUrl} target="_blank" rel="noreferrer" className="fb-cms__post-link">Xem bài gốc</a>
                      )}
                    </div>
                    <div className="fb-cms__post-actions">
                      <button className="fb-cms__btn-edit" onClick={() => openEdit(post)}>✏️ Sửa</button>
                      <button className="fb-cms__btn-delete" onClick={() => handleDelete(post._id)}>🗑️ Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="fb-cms__pagination">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={'fb-cms__page-btn' + (p === pagination.page ? ' active' : '')} onClick={() => fetchPosts(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Tab: Lên Lịch ── */}
      {activeTab === 'schedule' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>📅 Lên Lịch Đăng Bài</h2>
            <p>Chọn nội dung từ website và đặt giờ — hệ thống tự động đăng lên Facebook Page</p>
          </div>
          <SchedulePostTab onShowStatus={showStatus} />
        </div>
      )}

      {/* ── Tab: Lịch đăng ── */}
      {activeTab === 'scheduled-list' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>📋 Lịch Đăng Đã Tạo</h2>
            <p>Tổng <strong>{scheduledPagination.total}</strong> bài · cron job chạy mỗi 5 phút</p>
          </div>

          {/* Filter bar */}
          <div className="sched__filter-bar">
            {[{ v: '', l: 'Tất cả' }, { v: 'pending', l: '⏳ Chờ đăng' }, { v: 'posted', l: '✅ Đã đăng' }, { v: 'failed', l: '❌ Thất bại' }].map(({ v, l }) => (
              <button key={v} className={'sched__filter-btn' + (scheduledFilter === v ? ' active' : '')}
                onClick={() => setScheduledFilter(v)}>{l}</button>
            ))}
            <button className="sched__refresh-btn" onClick={() => fetchScheduledPosts(1)}>🔄 Làm mới</button>
          </div>

          {fetchingScheduled ? (
            <div className="fb-cms__loading">Đang tải...</div>
          ) : scheduledPosts.length === 0 ? (
            <div className="fb-cms__empty">
              <p>Chưa có bài viết nào được lên lịch.</p>
              <button className="fb-cms__btn-primary" onClick={() => setActiveTab('schedule')}>
                + Lên lịch bài đầu tiên
              </button>
            </div>
          ) : (
            <>
              <div className="sched__post-list">
                {scheduledPosts.map(post => (
                  <div key={post._id} className={`sched__post-item sched__post-item--${post.status}`}>
                    <div className="sched__post-time">
                      <Clock size={14} />
                      <span>{fmtDate(post.scheduledAt)}</span>
                      <span className={`sched__badge ${statusClass(post.status)}`}>{statusLabel(post.status)}</span>
                    </div>
                    <p className="sched__post-content">{(post.content || '').substring(0, 200)}{post.content?.length > 200 ? '...' : ''}</p>
                    {post.imageUrl && <div className="sched__post-img-hint">📷 Có ảnh đính kèm</div>}
                    {post.fbPostUrl && (
                      <a href={post.fbPostUrl} target="_blank" rel="noreferrer" className="sched__fb-link">
                        Xem trên Facebook →
                      </a>
                    )}
                    {post.error && <div className="sched__post-error">⚠️ {post.error}</div>}
                    <div className="sched__post-actions">
                      {post.status !== 'posted' && (
                        <>
                          <button className="sched__btn-postnow"
                            onClick={() => handlePostNow(post._id)}
                            disabled={postingNow === post._id}>
                            <Zap size={13} />
                            {postingNow === post._id ? 'Đang đăng...' : 'Đăng ngay'}
                          </button>
                          <button className="sched__btn-delete" onClick={() => handleDeleteScheduled(post._id)}>
                            <Trash2 size={13} /> Hủy
                          </button>
                        </>
                      )}
                      {post.postedAt && <span className="sched__posted-at">Đã đăng: {fmtDate(post.postedAt)}</span>}
                    </div>
                  </div>
                ))}
              </div>
              {scheduledPagination.totalPages > 1 && (
                <div className="fb-cms__pagination">
                  {Array.from({ length: scheduledPagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={'fb-cms__page-btn' + (p === scheduledPagination.page ? ' active' : '')}
                      onClick={() => fetchScheduledPosts(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Tab: Cài đặt ── */}
      {activeTab === 'settings' && (
        <div className="fb-cms__card">
          <div className="fb-cms__card-header">
            <h2>⚙️ Cài Đặt Facebook</h2>
            <p>Kết nối tài khoản Facebook Page để hệ thống tự động đăng bài</p>
          </div>

          {/* ── NOTICE: Giải thích rõ cần Page, không thể dùng tài khoản cá nhân ── */}
          <div className="settings__notice">
            <div className="settings__notice-icon">⚠️</div>
            <div>
              <strong>Facebook chỉ cho phép đăng bài qua API lên Facebook PAGE</strong>
              <p>Không thể đăng lên timeline cá nhân (Facebook đã xóa tính năng này từ 2018).
              Bạn cần có <strong>Facebook Page / Fanpage</strong> và cấp quyền cho ứng dụng.</p>
            </div>
          </div>

          {/* ── Bước 1: Dùng User Token lấy danh sách Pages ── */}
          <div className="settings__section">
            <h3 className="settings__section-title">📋 Bước 1 — Lấy danh sách Pages bạn quản lý</h3>
            <p className="settings__section-desc">
              Nhập <strong>User Access Token</strong> (lấy từ <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer">Graph API Explorer</a> → chọn quyền <code>pages_manage_posts</code>) → hệ thống tự tìm Page Token.
            </p>
            <div className="settings__token-row">
              <input
                type="password"
                placeholder="EAAxxxxxxxx... (User Access Token)"
                value={userToken}
                onChange={e => setUserToken(e.target.value)}
                className="settings__token-input"
              />
              <button
                className="settings__btn-fetch"
                disabled={fetchingPages || !userToken.trim()}
                onClick={async () => {
                  setFetchingPages(true); setFbPages([]);
                  try {
                    const res = await axios.post(API_URL + '/admin/fb-get-pages', { userToken }, { headers: authHeader() });
                    if (res.data.success) { setFbPages(res.data.data); showStatus(true, res.data.message); }
                    else showStatus(false, res.data.message);
                  } catch (err) { showStatus(false, err.response?.data?.message || 'Lỗi kết nối!'); }
                  finally { setFetchingPages(false); }
                }}
              >
                {fetchingPages ? '⏳ Đang tìm...' : '🔍 Tìm Pages của tôi'}
              </button>
            </div>

            {/* Danh sách Pages tìm được */}
            {fbPages.length > 0 && (
              <div className="settings__pages-list">
                <p className="settings__pages-hint">Nhấn <strong>Copy Page Token</strong> → dán vào file <code>.env</code> của server</p>
                {fbPages.map(page => (
                  <div key={page.id} className="settings__page-card">
                    {page.picture && <img src={page.picture} alt="" className="settings__page-avatar" />}
                    <div className="settings__page-info-col">
                      <strong>{page.name}</strong>
                      <span>ID: {page.id}</span>
                      {page.fanCount > 0 && <span>👥 {page.fanCount.toLocaleString('vi-VN')} người theo dõi</span>}
                    </div>
                    <div className="settings__page-actions">
                      <button
                        className="settings__btn-copy-id"
                        onClick={() => { navigator.clipboard.writeText(page.id); setCopiedId('id-' + page.id); setTimeout(() => setCopiedId(''), 2000); }}
                      >
                        {copiedId === 'id-' + page.id ? '✅ Đã copy ID' : '📋 Copy Page ID'}
                      </button>
                      <button
                        className="settings__btn-copy-token"
                        onClick={() => { navigator.clipboard.writeText(page.pageToken); setCopiedId('tok-' + page.id); setTimeout(() => setCopiedId(''), 2000); }}
                      >
                        {copiedId === 'tok-' + page.id ? '✅ Đã copy Token' : '🔑 Copy Page Token'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Bước 2: Dán vào .env ── */}
          <div className="settings__section">
            <h3 className="settings__section-title">⚙️ Bước 2 — Cấu hình file .env server</h3>
            <div className="settings__env-guide">
              <AlertCircle size={16} />
              <div>
                <strong>Dán vào file <code>.env</code> của server:</strong>
                <pre>{`FB_PAGE_ID=<Page ID vừa copy bên trên>\nFB_PAGE_TOKEN=<Page Token vừa copy bên trên>`}</pre>
                <p>⚠️ Page Token hết hạn sau <strong>60 ngày</strong>. Sau khi hết hạn, lấy lại bằng cách lấy User Token mới → làm lại bước 1.</p>
              </div>
            </div>
          </div>

          {/* ── Bước 3: Kiểm tra kết nối ── */}
          <div className="settings__section">
            <h3 className="settings__section-title">✅ Bước 3 — Kiểm tra kết nối hiện tại</h3>
            {fbLoading ? (
              <div className="fb-cms__loading">Đang kiểm tra...</div>
            ) : fbSettings ? (
              <div>
                <div className={`settings__status-card ${fbSettings.valid ? 'valid' : 'invalid'}`}>
                  {fbSettings.valid ? <CheckCircle size={28} /> : <XCircle size={28} />}
                  <div>
                    <h3>{fbSettings.valid ? '✅ Kết nối thành công!' : '❌ Chưa kết nối'}</h3>
                    <p>{fbSettings.valid ? `Page: ${fbSettings.page?.name || fbSettings.pageId}` : fbSettings.message}</p>
                  </div>
                </div>
                {fbSettings.valid && fbSettings.page && (
                  <div className="settings__page-info" style={{marginTop:'0.8rem'}}>
                    <div className="settings__info-row"><span>Page ID:</span><strong>{fbSettings.page.id}</strong></div>
                    <div className="settings__info-row"><span>Tên Page:</span><strong>{fbSettings.page.name}</strong></div>
                    {fbSettings.page.fan_count !== undefined && (
                      <div className="settings__info-row"><span>Người theo dõi:</span><strong>{fbSettings.page.fan_count?.toLocaleString('vi-VN')}</strong></div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            <button className="fb-cms__btn-primary" style={{marginTop:'0.8rem'}} onClick={loadFBSettings}>
              🔄 Kiểm tra kết nối
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editPost && (
        <div className="fb-cms__modal-overlay" onClick={() => setEditPost(null)}>
          <div className="fb-cms__modal" onClick={e => e.stopPropagation()}>
            <div className="fb-cms__modal-header">
              <h3>✏️ Chỉnh Sửa Bài Viết</h3>
              <button className="fb-cms__modal-close" onClick={() => setEditPost(null)}>✕</button>
            </div>
            <div className="fb-cms__modal-body">
              <div className="fb-cms__form-group full">
                <label>Nội dung bài viết *</label>
                <textarea rows={6} value={editPost.content}
                  onChange={e => setEditPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Nội dung bài viết..." />
              </div>
              <div className="fb-cms__form-row">
                <div className="fb-cms__form-group">
                  <label>Tiêu đề</label>
                  <input type="text" value={editPost.title}
                    onChange={e => setEditPost(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="fb-cms__form-group">
                  <label>Tác giả</label>
                  <input type="text" value={editPost.author}
                    onChange={e => setEditPost(p => ({ ...p, author: e.target.value }))} />
                </div>
              </div>
              <div className="fb-cms__form-group full">
                <label>URL ảnh đính kèm</label>
                <input type="url" value={editPost.imageUrl}
                  onChange={e => setEditPost(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://..." />
              </div>
              <div className="fb-cms__form-group full">
                <label>Link bài viết gốc (Facebook)</label>
                <input type="url" value={editPost.originalUrl}
                  onChange={e => setEditPost(p => ({ ...p, originalUrl: e.target.value }))}
                  placeholder="https://www.facebook.com/..." />
              </div>
              <div className="fb-cms__form-row">
                <div className="fb-cms__form-group">
                  <label>Số lượt thích</label>
                  <input type="number" min={0} value={editPost.likesCount}
                    onChange={e => setEditPost(p => ({ ...p, likesCount: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="fb-cms__form-group">
                  <label>Số bình luận</label>
                  <input type="number" min={0} value={editPost.commentsCount}
                    onChange={e => setEditPost(p => ({ ...p, commentsCount: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
            </div>
            <div className="fb-cms__modal-footer">
              <button className="fb-cms__btn-cancel" onClick={() => setEditPost(null)}>Hủy</button>
              <button className="fb-cms__btn-save" onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? 'Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}