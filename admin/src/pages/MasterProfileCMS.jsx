import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Search, 
  Plus, 
  Save, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User, 
  Star, 
  ShieldCheck,
  Image as ImageIcon,
  Edit,
  X,
  Loader2
} from 'lucide-react';
import './MasterProfileCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MasterProfileCMS() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, CRAWLED_PENDING, PUBLISHED
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const quillRef = useRef(null);

  // Fetch data
  useEffect(() => {
    fetchMasters();
  }, [filter]);

  const fetchMasters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/masters`, {
        params: { 
          status: filter === 'ALL' ? undefined : filter,
          search: searchTerm || undefined
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMasters(res.data.data || []);
      } else {
        setMasters([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching masters:', error);
      setLoading(false);
    }
  };

  const handleEdit = (master) => {
    setSelectedMaster({ ...master });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMaster({
      fullName: '',
      avatar: '',
      rank: 'Hạng C',
      trustScore: 50,
      profileDescription: '',
      status: 'CRAWLED_PENDING'
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMaster) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const isNew = !selectedMaster._id;
      
      let res;
      if (isNew) {
        res = await axios.post(
          `${API_URL}/admin/masters`, 
          selectedMaster,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.put(
          `${API_URL}/admin/masters/${selectedMaster._id}`, 
          selectedMaster,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      if (res.data.success) {
        if (isNew) {
          setMasters(prev => [res.data.data, ...prev]);
        } else {
          setMasters(prev => prev.map(m => m._id === selectedMaster._id ? res.data.data : m));
        }
        setIsModalOpen(false);
        setSelectedMaster(null);
      }
      setSaving(false);
    } catch (error) {
      console.error('Error saving master:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu.');
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ chuyên gia này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/admin/masters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMasters(prev => prev.filter(m => m._id !== id));
      }
    } catch (error) {
      console.error('Error deleting master:', error);
      alert('Không thể xóa hồ sơ.');
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_URL}/admin/masters/upload-image`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', res.data.url);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'color'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const stats = useMemo(() => {
    return {
      total: masters.length,
      pending: masters.filter(m => m.status === 'CRAWLED_PENDING').length,
      published: masters.filter(m => m.status === 'PUBLISHED').length
    };
  }, [masters]);

  return (
    <div className="cms-page-container">
      <div className="cms-page-header">
        <div>
          <h1>Quản Trị Hồ Sơ Chuyên Gia</h1>
          <p style={{color: '#94a3b8', marginTop: '0.5rem'}}>Quản lý danh sách, chỉnh sửa hồ sơ và duyệt dữ liệu</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew} style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
          <Plus size={22} /> <span>Thêm Chuyên Gia Mới</span>
        </button>
      </div>

      <div className="cms-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Tổng số thầy</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Chờ duyệt (Crawl)</span>
          <span className="stat-value" style={{color: 'var(--warning)'}}>{stats.pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Đã xuất bản</span>
          <span className="stat-value" style={{color: 'var(--success)'}}>{stats.published}</span>
        </div>
      </div>

      <div className="cms-list-section">
        <div className="list-controls">
          <div className="sidebar-filters">
            <button className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>Tất cả</button>
            <button className={`filter-btn ${filter === 'CRAWLED_PENDING' ? 'active' : ''}`} onClick={() => setFilter('CRAWLED_PENDING')}>Chờ duyệt</button>
            <button className={`filter-btn ${filter === 'PUBLISHED' ? 'active' : ''}`} onClick={() => setFilter('PUBLISHED')}>Đã xong</button>
          </div>
          
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Tìm tên thầy..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMasters()}
            />
          </div>
        </div>

        <div className="masters-table-container">
          <table className="masters-table">
            <thead>
              <tr>
                <th>Chuyên gia</th>
                <th>Phân hạng</th>
                <th>Tín nhiệm</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{textAlign: 'right'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '3rem'}}><Loader2 className="spin" /> Đang tải dữ liệu...</td></tr>
              ) : masters.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>Không có dữ liệu</td></tr>
              ) : (
                masters.map(m => (
                  <tr key={m._id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <img src={m.avatar || 'https://via.placeholder.com/150'} alt="" className="table-avatar" />
                        <div>
                          <div style={{fontWeight: '600', color: '#fff'}}>{m.fullName}</div>
                          <div style={{fontSize: '0.75rem', color: '#64748b'}}>ID: {m._id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="rank-badge">{m.rank}</span></td>
                    <td><span style={{color: 'var(--primary-gold)'}}>⭐ {m.trustScore}</span></td>
                    <td>
                      <span className={`status-tag ${m.status === 'CRAWLED_PENDING' ? 'status-pending' : 'status-published'}`}>
                        {m.status === 'CRAWLED_PENDING' ? 'Chờ duyệt' : 'Đã đăng'}
                      </span>
                    </td>
                    <td><span style={{color: '#94a3b8', fontSize: '0.85rem'}}>{new Date(m.createdAt).toLocaleDateString('vi-VN')}</span></td>
                    <td style={{textAlign: 'right'}}>
                      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                        <button className="action-btn edit" onClick={() => handleEdit(m)}><Edit size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(m._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Editor Modal */}
      {isModalOpen && (
        <div className="cms-modal-overlay">
          <div className="cms-modal-content">
            <div className="modal-header">
              <h3>{selectedMaster?._id ? 'Chỉnh sửa hồ sơ' : 'Thêm mới chuyên gia'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid-layout">
                <div className="form-row">
                  <div className="form-item">
                    <label className="field-label">Họ và Tên</label>
                    <input type="text" className="field-control" value={selectedMaster.fullName} onChange={e => setSelectedMaster({...selectedMaster, fullName: e.target.value})} placeholder="Nhập họ tên chuyên gia..." />
                  </div>

                  <div className="form-item">
                    <label className="field-label">Trạng thái hiển thị</label>
                    <select className="field-control" value={selectedMaster.status} onChange={e => setSelectedMaster({...selectedMaster, status: e.target.value})}>
                      <option value="CRAWLED_PENDING">Chờ duyệt (Crawl)</option>
                      <option value="PUBLISHED">Đã xuất bản (Công khai)</option>
                      <option value="ARCHIVED">Lưu trữ (Ẩn)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-item">
                    <label className="field-label"><Star size={14} /> Điểm tín nhiệm (0-100)</label>
                    <input type="number" className="field-control" value={selectedMaster.trustScore} onChange={e => setSelectedMaster({...selectedMaster, trustScore: parseInt(e.target.value)})} />
                  </div>

                  <div className="form-item">
                    <label className="field-label"><ShieldCheck size={14} /> Phân hạng</label>
                    <select className="field-control" value={selectedMaster.rank} onChange={e => setSelectedMaster({...selectedMaster, rank: e.target.value})}>
                      <option value="Hạng A">Hạng A (Uy tín cao)</option>
                      <option value="Hạng B">Hạng B (Tiêu chuẩn)</option>
                      <option value="Hạng C">Hạng C (Mới)</option>
                      <option value="Kim Cương">Kim Cương</option>
                      <option value="Vàng">Vàng</option>
                      <option value="Bạc">Bạc</option>
                    </select>
                  </div>
                </div>

                <div className="form-item full-width">
                  <label className="field-label">Ảnh đại diện (URL)</label>
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                    <div style={{flex: 1}}>
                      <input type="text" className="field-control" value={selectedMaster.avatar} onChange={e => setSelectedMaster({...selectedMaster, avatar: e.target.value})} placeholder="https://..." />
                      {selectedMaster.avatar && (
                        <div className="avatar-preview-box">
                          <img src={selectedMaster.avatar} alt="Preview" />
                        </div>
                      )}
                    </div>
                    <button className="btn btn-outline" style={{padding: '0.8rem 1rem'}} onClick={() => imageHandler()}><ImageIcon size={20} /></button>
                  </div>
                </div>

                <div className="form-item full-width">
                  <label className="field-label">Hồ sơ chi tiết (Rich Text Editor)</label>
                  <div className="rich-editor-container">
                    <ReactQuill ref={quillRef} theme="snow" value={selectedMaster.profileDescription} onChange={(content) => setSelectedMaster({...selectedMaster, profileDescription: content})} modules={modules} />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="spin" size={18} /> : <><Save size={18} /> Lưu hồ sơ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
