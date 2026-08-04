import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacebookImportCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');

export default function FacebookImportCMS() {
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [fetchingList, setFetchingList] = useState(false);
  const [manualForm, setManualForm] = useState({ title:'',content:'',author:'',imageUrl:'',originalUrl:'',likesCount:0,commentsCount:0 });
  const [apiForm, setApiForm] = useState({ pageId: '', accessToken: '', limit: 10 });

  useEffect(() => { if (activeTab === 'list') fetchPosts(1); }, [activeTab]);

  const fetchPosts = async (page = 1) => {
    setFetchingList(true);
    try {
      const url = API_URL + '/admin/facebook-posts?page=' + page + '&limit=15';
      const res = await axios.get(url, { headers: { Authorization: 'Bearer ' + getToken() } });
      if (res.data.success) { setPosts(res.data.data); setPagination(res.data.pagination); }
    } catch (err) { console.error(err); }
    finally { setFetchingList(false); }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      const res = await axios.post(API_URL + '/admin/import-facebook-post', manualForm, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      setStatus({ success: res.data.success, message: res.data.message });
      if (res.data.success) setManualForm({ title:'',content:'',author:'',imageUrl:'',originalUrl:'',likesCount:0,commentsCount:0 });
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Loi ket noi!' });
    } finally { setLoading(false); }
  };

  const handleApiSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      const res = await axios.post(API_URL + '/admin/fetch-facebook-page', apiForm, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      setStatus({ success: res.data.success, message: res.data.message });
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Loi ket noi!' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoa bai viet nay?')) return;
    try {
      await axios.delete(API_URL + '/admin/facebook-posts/' + id, { headers: { Authorization: 'Bearer ' + getToken() } });
      fetchPosts(pagination.page);
    } catch (err) { alert('Loi xoa bai viet'); }
  };

  return (
    <div className="fb-cms">
      <header className="fb-cms__header">
        <div className="fb-cms__header-icon">📘</div>
        <div>
          <h1 className="fb-cms__title">Kéo Bài Viết Facebook</h1>
          <p className="fb-cms__subtitle">Nhập thủ công hoặc kéo tự động bài từ trang Facebook</p>
        </div>
      </header>
      <div className="fb-cms__tabs">
        {[
          { key: 'manual', label: 'Nhập Thủ Công' },
          { key: 'api', label: 'Kéo Từ Page (Graph API)' },
          { key: 'list', label: 'Đã Nhập (' + pagination.total + ')' },
        ].map(t => (
          <button key={t.key} className={'fb-cms__tab' + (activeTab === t.key ? ' active' : '')} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {status && (
        <div className={'fb-cms__status ' + (status.success ? 'success' : 'error')}>
          {status.success ? 'OK: ' : 'Loi: '}{status.message}
        </div>
      )}
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
                    {post.imageUrl && <img src={post.imageUrl} alt="" className="fb-cms__post-thumb" onError={e => { e.target.style.display='none'; }} />}
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
                    <button className="fb-cms__btn-delete" onClick={() => handleDelete(post._id)}>Xóa</button>
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
    </div>
  );
}