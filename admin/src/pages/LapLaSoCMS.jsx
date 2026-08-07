import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LapLaSoCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');

const GIO_CHI_LIST = ['Ty','Suu','Dan','Mao','Thin','Ti','Ngo','Mui','Than','Dau','Tuat','Hoi'];
const GIO_RANGE = ['23-1','1-3','3-5','5-7','7-9','9-11','11-13','13-15','15-17','17-19','19-21','21-23'];

export default function LapLaSoCMS() {
  const [activeTab, setActiveTab] = useState('form');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [laSoList, setLaSoList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [fetchingList, setFetchingList] = useState(false);
  const [search, setSearch] = useState('');
  const [saveToDb, setSaveToDb] = useState(false);
  // Edit modal state
  const [editLaSo, setEditLaSo] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form, setForm] = useState({
    hoTen: '', gioiTinh: 'nam', ngaySinh: 1, thangSinh: 1,
    namSinh: 1990, gioSinh: 'Ngo', isLunar: false, namXem: new Date().getFullYear(),
  });

  useEffect(() => { if (activeTab === 'list') fetchList(1); }, [activeTab]);

  const fetchList = async (page = 1) => {
    setFetchingList(true);
    try {
      const url = API_URL + '/admin/la-so-list?page=' + page + '&limit=15&search=' + search;
      const res = await axios.get(url, { headers: { Authorization: 'Bearer ' + getToken() } });
      if (res.data.success) { setLaSoList(res.data.data); setPagination(res.data.pagination); }
    } catch (err) { console.error(err); }
    finally { setFetchingList(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null); setResult(null);
    try {
      const payload = { ...form, saveToDb };
      const res = await axios.post(API_URL + '/admin/lap-la-so', payload, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (res.data.success) {
        setResult(res.data.data);
        setStatus({ success: true, message: res.data.message });
        setActiveTab('result');
      } else {
        setStatus({ success: false, message: res.data.message });
      }
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Loi server!' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa lá số này?')) return;
    try {
      await axios.delete(API_URL + '/admin/la-so/' + id, { headers: { Authorization: 'Bearer ' + getToken() } });
      fetchList(pagination.page);
    } catch (err) { alert('Lỗi xóa lá số'); }
  };

  const openEditLaSo = (ls) => {
    setEditLaSo({
      _id: ls._id,
      hoTen: ls.hoTen || '',
      gioiTinh: ls.gioiTinh || 'nam',
      ngaySinh: ls.ngaySinh || 1,
      thangSinh: ls.thangSinh || 1,
      namSinh: ls.namSinh || 1990,
      gioSinh: ls.gioSinh || 'Ngo',
      isLunar: ls.isLunar || false,
    });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const res = await axios.put(API_URL + '/admin/la-so/' + editLaSo._id, editLaSo, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (res.data.success) {
        setStatus({ success: true, message: 'Đã cập nhật lá số thành công!' });
        setLaSoList(prev => prev.map(l => l._id === editLaSo._id ? { ...l, ...editLaSo } : l));
        setEditLaSo(null);
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ success: false, message: res.data.message });
      }
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Lỗi cập nhật!' });
    } finally {
      setEditLoading(false);
    }
  };

  const getRatingStars = (r) => {
    const full = r || 0;
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <div className="laso-cms">
      <header className="laso-cms__header">
        <div className="laso-cms__header-icon">🔮</div>
        <div>
          <h1 className="laso-cms__title">Lập Lá Số Tử Vi</h1>
          <p className="laso-cms__subtitle">Nhập thông tin ngày sinh để lập lá số tử vi tức thì</p>
        </div>
      </header>
      <div className="laso-cms__tabs">
        {[
          { key: 'form', label: 'Lập Lá Số Mới', disabled: false },
          { key: 'result', label: 'Kết Quả', disabled: !result },
          { key: 'list', label: 'Đã Lập (' + pagination.total + ')', disabled: false },
        ].map(t => (
          <button key={t.key} disabled={t.disabled}
            className={'laso-cms__tab' + (activeTab === t.key ? ' active' : '') + (t.disabled ? ' disabled' : '')}
            onClick={() => !t.disabled && setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {status && (
        <div className={'laso-cms__status ' + (status.success ? 'success' : 'error')}>
          {status.success ? 'OK: ' : 'Loi: '}{status.message}
        </div>
      )}
      {activeTab === 'form' && (
        <div className="laso-cms__card">
          <div className="laso-cms__card-header">
            <h2>Nhập Thông Tin Người Cần Xem</h2>
            <p>Điền đầy đủ thông tin để hệ thống tính toán chính xác lá số tử vi</p>
          </div>
          <form onSubmit={handleSubmit} className="laso-cms__form">
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group span2">
                <label>Họ và Tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" required
                  value={form.hoTen} onChange={e => setForm(p => ({ ...p, hoTen: e.target.value }))} />
              </div>
              <div className="laso-cms__form-group">
                <label>Giới Tính *</label>
                <select value={form.gioiTinh} onChange={e => setForm(p => ({ ...p, gioiTinh: e.target.value }))}>
                  <option value="nam">Nam Mạng</option>
                  <option value="nu">Nữ Mạng</option>
                </select>
              </div>
            </div>
            <div className="laso-cms__section-title">Ngày Sinh</div>
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group">
                <label>Ngày *</label>
                <input type="number" min={1} max={31} value={form.ngaySinh}
                  onChange={e => setForm(p => ({ ...p, ngaySinh: parseInt(e.target.value) }))} required />
              </div>
              <div className="laso-cms__form-group">
                <label>Tháng *</label>
                <input type="number" min={1} max={12} value={form.thangSinh}
                  onChange={e => setForm(p => ({ ...p, thangSinh: parseInt(e.target.value) }))} required />
              </div>
              <div className="laso-cms__form-group">
                <label>Năm *</label>
                <input type="number" min={1900} max={2030} value={form.namSinh}
                  onChange={e => setForm(p => ({ ...p, namSinh: parseInt(e.target.value) }))} required />
              </div>
            </div>
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group">
                <label>Giờ Sinh (Địa Chi Giờ) *</label>
                <select value={form.gioSinh} onChange={e => setForm(p => ({ ...p, gioSinh: e.target.value }))}>
                  {GIO_CHI_LIST.map((chi, i) => (
                    <option key={chi} value={chi}>{chi} ({GIO_RANGE[i]}h)</option>
                  ))}
                </select>
              </div>
              <div className="laso-cms__form-group">
                <label>Loại Lịch *</label>
                <select value={form.isLunar ? 'lunar' : 'solar'} onChange={e => setForm(p => ({ ...p, isLunar: e.target.value === 'lunar' }))}>
                  <option value="solar">Dương Lịch (Tây)</option>
                  <option value="lunar">Âm Lịch (Ta)</option>
                </select>
              </div>
              <div className="laso-cms__form-group">
                <label>Năm Xem (Tùy Chọn)</label>
                <input type="number" min={1990} max={2050} value={form.namXem}
                  onChange={e => setForm(p => ({ ...p, namXem: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="laso-cms__save-option">
              <label className="laso-cms__checkbox-label">
                <input type="checkbox" checked={saveToDb} onChange={e => setSaveToDb(e.target.checked)} />
                <span>Lưu lá số này vào cơ sở dữ liệu</span>
              </label>
            </div>
            <button type="submit" className="laso-cms__btn-primary" disabled={loading}>
              {loading ? 'Đang lập lá số...' : 'Lập Lá Số Ngay'}
            </button>
          </form>
        </div>
      )}
      {activeTab === 'result' && result && (
        <div className="laso-cms__card">
          <div className="laso-cms__result-header">
            <div className="laso-cms__result-avatar">{result.gioiTinh === 'nam' ? 'M' : 'F'}</div>
            <div>
              <h2 className="laso-cms__result-name">{result.hoTen}</h2>
              <div className="laso-cms__result-meta">
                <span>{result.ngaySinh}/{result.thangSinh}/{result.namSinh}</span>
                <span>Giờ: {result.gioSinh}</span>
                <span>{result.gioiTinh === 'nam' ? 'Nam Mạng' : 'Nữ Mạng'}</span>
              </div>
            </div>
          </div>
          <div className="laso-cms__info-grid">
            <div className="laso-cms__info-card">
              <div className="laso-cms__info-label">Can Chi Năm Sinh</div>
              <div className="laso-cms__info-value gold">{result.canChi}</div>
            </div>
            <div className="laso-cms__info-card">
              <div className="laso-cms__info-label">Nạp Âm</div>
              <div className="laso-cms__info-value">{result.napAm}</div>
            </div>
            <div className="laso-cms__info-card">
              <div className="laso-cms__info-label">Ngũ Hành Mệnh</div>
              <div className="laso-cms__info-value" style={{ color: result.nguHanhColor }}>{result.nguHanh}</div>
            </div>
            <div className="laso-cms__info-card">
              <div className="laso-cms__info-label">Âm Dương</div>
              <div className="laso-cms__info-value">{result.amDuong}</div>
            </div>
            {result.cuc && (
              <div className="laso-cms__info-card">
                <div className="laso-cms__info-label">Cục</div>
                <div className="laso-cms__info-value gold">{result.cuc?.name}</div>
              </div>
            )}
            {result.chuMenh && (
              <div className="laso-cms__info-card">
                <div className="laso-cms__info-label">Chủ Mệnh</div>
                <div className="laso-cms__info-value">{result.chuMenh}</div>
              </div>
            )}
            <div className="laso-cms__info-card span2">
              <div className="laso-cms__info-label">Đánh Giá Tổng Hợp</div>
              <div className="laso-cms__info-value stars">{getRatingStars(result.overallRating)}</div>
            </div>
          </div>
          {result.cungResults && result.cungResults.length > 0 && (
            <>
              <div className="laso-cms__section-title" style={{marginTop:'2rem'}}>12 Cung Trong Lá Số</div>
              <div className="laso-cms__cung-grid">
                {result.cungResults.slice(0, 12).map((cung, i) => (
                  <div key={i} className={'laso-cms__cung-cell' + (cung.isMenh ? ' menh' : '') + (cung.isMinh ? ' than' : '')}>
                    <div className="laso-cms__cung-name">{cung.name}</div>
                    <div className="laso-cms__cung-canchhi">{cung.canChi}</div>
                    {cung.daiHan && <div className="laso-cms__cung-daihan">DH: {cung.daiHan}</div>}
                    {(cung.saoChinhList || []).slice(0, 3).map((s, si) => (
                      <div key={si} className="laso-cms__sao-chinh">{s.ten}</div>
                    ))}
                    {(cung.saoPhuList || []).slice(0, 4).map((s, si) => (
                      <div key={si} className="laso-cms__sao-phu">{s.ten}</div>
                    ))}
                    {cung.isMenh && <div className="laso-cms__cung-tag">MENH</div>}
                    {cung.isMinh && <div className="laso-cms__cung-tag than">THAN</div>}
                  </div>
                ))}
              </div>
            </>
          )}
          {result.advice && result.advice.length > 0 && (
            <>
              <div className="laso-cms__section-title" style={{marginTop:'1.5rem'}}>Luận Giải Tổng Quát</div>
              <div className="laso-cms__advice-list">
                {result.advice.map((a, i) => (
                  <div key={i} className="laso-cms__advice-item">
                    <span className="laso-cms__advice-bullet">✦</span> {a}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="laso-cms__result-actions">
            <button className="laso-cms__btn-secondary" onClick={() => { setActiveTab('form'); setResult(null); setStatus(null); }}>
              Lập Lá Số Khác
            </button>
            <button className="laso-cms__btn-primary" onClick={() => window.print()}>In Lá Số</button>
          </div>
        </div>
      )}
      {activeTab === 'list' && (
        <div className="laso-cms__card">
          <div className="laso-cms__card-header">
            <h2>Danh Sách Lá Số Đã Lập Và Lưu</h2>
            <div className="laso-cms__search-row">
              <input type="text" placeholder="Tìm kiếm theo tên..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchList(1)}
                className="laso-cms__search" />
              <button onClick={() => fetchList(1)} className="laso-cms__btn-search">Tìm</button>
            </div>
          </div>
          {fetchingList ? (
            <div className="laso-cms__loading">Đang tải...</div>
          ) : laSoList.length === 0 ? (
            <div className="laso-cms__empty"><p>Chưa có lá số nào được lưu. Lập lá số và chọn "Lưu vào CSDL".</p></div>
          ) : (
            <>
              <table className="laso-cms__table">
                <thead>
                  <tr>
                    <th>Họ Tên</th>
                    <th>Giới Tính</th>
                    <th>Ngày Sinh</th>
                    <th>Giờ</th>
                    <th>Can Chi</th>
                    <th>Nạp Âm</th>
                    <th>Đánh Giá</th>
                    <th>Ngày Lập</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {laSoList.map(ls => (
                    <tr key={ls._id}>
                      <td className="laso-cms__td-name">{ls.hoTen}</td>
                      <td>{ls.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}</td>
                      <td>{ls.ngaySinh}/{ls.thangSinh}/{ls.namSinh}</td>
                      <td>{ls.gioSinh}</td>
                      <td className="laso-cms__td-gold">{ls.canChi}</td>
                      <td>{ls.napAm}</td>
                      <td>{getRatingStars(ls.overallRating)}</td>
                      <td>{new Date(ls.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="laso-cms__btn-edit-sm" onClick={() => openEditLaSo(ls)}>✏️ Sửa</button>
                        <button className="laso-cms__btn-delete-sm" onClick={() => handleDelete(ls._id)}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination.totalPages > 1 && (
                <div className="laso-cms__pagination">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={'laso-cms__page-btn' + (p === pagination.page ? ' active' : '')} onClick={() => fetchList(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {editLaSo && (
        <div className="laso-cms__modal-overlay" onClick={() => setEditLaSo(null)}>
          <div className="laso-cms__modal" onClick={e => e.stopPropagation()}>
            <div className="laso-cms__modal-header">
              <h3>✏️ Chỉnh Sửa Lá Số</h3>
              <button className="laso-cms__modal-close" onClick={() => setEditLaSo(null)}>✕</button>
            </div>
            <div className="laso-cms__modal-body">
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group span2">
                  <label>Họ và Tên *</label>
                  <input type="text" value={editLaSo.hoTen}
                    onChange={e => setEditLaSo(p => ({ ...p, hoTen: e.target.value }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Giới Tính</label>
                  <select value={editLaSo.gioiTinh}
                    onChange={e => setEditLaSo(p => ({ ...p, gioiTinh: e.target.value }))}>
                    <option value="nam">Nam Mạng</option>
                    <option value="nu">Nữ Mạng</option>
                  </select>
                </div>
              </div>
              <div className="laso-cms__section-title">Ngày Sinh</div>
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group">
                  <label>Ngày *</label>
                  <input type="number" min={1} max={31} value={editLaSo.ngaySinh}
                    onChange={e => setEditLaSo(p => ({ ...p, ngaySinh: parseInt(e.target.value) }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Tháng *</label>
                  <input type="number" min={1} max={12} value={editLaSo.thangSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, thangSinh: parseInt(e.target.value) }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Năm *</label>
                  <input type="number" min={1900} max={2030} value={editLaSo.namSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, namSinh: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group">
                  <label>Giờ Sinh (Địa Chi)</label>
                  <select value={editLaSo.gioSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, gioSinh: e.target.value }))}>
                    {GIO_CHI_LIST.map((chi, i) => (
                      <option key={chi} value={chi}>{chi} ({GIO_RANGE[i]}h)</option>
                    ))}
                  </select>
                </div>
                <div className="laso-cms__form-group">
                  <label>Loại Lịch</label>
                  <select value={editLaSo.isLunar ? 'lunar' : 'solar'}
                    onChange={e => setEditLaSo(p => ({ ...p, isLunar: e.target.value === 'lunar' }))}>
                    <option value="solar">Dương Lịch</option>
                    <option value="lunar">Âm Lịch</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="laso-cms__modal-footer">
              <button className="laso-cms__btn-secondary" onClick={() => setEditLaSo(null)}>Hủy</button>
              <button className="laso-cms__btn-primary" onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? 'Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}