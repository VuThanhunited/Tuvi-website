import React, { useState, useEffect } from 'react';
import './InterpretationCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function InterpretationCMS() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'sao_cung',
    sao: '',
    cung: '',
    trangThai: '',
    tenCachCuc: '',
    content: '',
    source: ''
  });

  const fetchInterpretations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/interpretations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu CMS:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterpretations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = currentId ? 'PUT' : 'POST';
      const url = currentId 
        ? `${API_URL}/interpretations/${currentId}`
        : `${API_URL}/interpretations`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchInterpretations();
      } else {
        alert(result.message || 'Lưu thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
    }
  };

  const handleEdit = (item) => {
    setCurrentId(item._id);
    setFormData({
      type: item.type || 'sao_cung',
      sao: item.sao || '',
      cung: item.cung || '',
      trangThai: item.trangThai || '',
      tenCachCuc: item.tenCachCuc || '',
      content: item.content || '',
      source: item.source || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa luận giải này?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/interpretations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchInterpretations();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  const openNewModal = () => {
    setCurrentId(null);
    setFormData({
      type: 'sao_cung', sao: '', cung: '', trangThai: '', tenCachCuc: '', content: '', source: ''
    });
    setShowModal(true);
  };

  return (
    <div className="cms-container">
      <div className="cms-header">
        <h1 className="cms-title">⚙️ Quản trị CMS - Luận Giải Tử Vi</h1>
        <button className="btn-add-new" onClick={openNewModal}>+ Thêm luận giải mới</button>
      </div>

      <div className="cms-filters">
        <select>
          <option value="">Tất cả loại</option>
          <option value="sao_cung">Sao tại Cung</option>
          <option value="cung">Ý nghĩa Cung</option>
          <option value="cach_cuc">Cách Cục</option>
        </select>
        <input type="text" placeholder="Tìm kiếm theo Sao, Cung..." />
        <button className="btn-add-new" style={{padding: '8px 15px'}}>Lọc</button>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Sao</th>
              <th>Cung</th>
              <th>Trạng thái</th>
              <th>Cách Cục</th>
              <th>Trích đoạn nội dung</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>}
            {!loading && data.length === 0 && (
              <tr><td colSpan="7" style={{textAlign: 'center', color: '#888'}}>Chưa có dữ liệu nào. Hãy thêm mới!</td></tr>
            )}
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.sao || '-'}</td>
                <td>{item.cung || '-'}</td>
                <td>{item.trangThai || '-'}</td>
                <td>{item.tenCachCuc || '-'}</td>
                <td>{item.content ? item.content.substring(0, 50) + '...' : '-'}</td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEdit(item)}>✏️</button>
                  <button className="action-btn delete" onClick={() => handleDelete(item._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="cms-modal-overlay">
          <div className="cms-modal">
            <h3>{currentId ? 'Chỉnh sửa luận giải' : 'Thêm luận giải mới'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Loại luận giải</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="sao_cung">Sao đóng tại Cung</option>
                  <option value="cung">Ý nghĩa Cung</option>
                  <option value="sao">Ý nghĩa Sao cơ bản</option>
                  <option value="cach_cuc">Cách Cục</option>
                  <option value="tu_hoa">Tứ Hóa</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nguồn (Sách/Tác giả)</label>
                <input type="text" name="source" value={formData.source} onChange={handleInputChange} placeholder="VD: Trung Châu Tử Vi" />
              </div>
            </div>

            {formData.type === 'sao_cung' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Sao</label>
                  <input type="text" name="sao" value={formData.sao} onChange={handleInputChange} placeholder="VD: Tử Vi" />
                </div>
                <div className="form-group">
                  <label>Cung</label>
                  <input type="text" name="cung" value={formData.cung} onChange={handleInputChange} placeholder="VD: Mệnh" />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select name="trangThai" value={formData.trangThai} onChange={handleInputChange}>
                    <option value="">Không có / Bỏ qua</option>
                    <option value="M">Miếu (M)</option>
                    <option value="V">Vượng (V)</option>
                    <option value="Đ">Đắc (Đ)</option>
                    <option value="B">Bình (B)</option>
                    <option value="H">Hãm (H)</option>
                  </select>
                </div>
              </div>
            )}

            {formData.type === 'cach_cuc' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Tên cách cục</label>
                  <input type="text" name="tenCachCuc" value={formData.tenCachCuc} onChange={handleInputChange} placeholder="VD: Tử Phủ Vũ Tướng" />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Nội dung luận giải (Hỗ trợ HTML)</label>
              <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                placeholder="Nhập nội dung luận giải vào đây..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
              <button className="btn-save" onClick={handleSave}>Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
