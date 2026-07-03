import React, { useState, useEffect } from 'react';
import './StaticPages.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', author: '', content: '', imageUrl: '' });
  const [selectedPostComments, setSelectedPostComments] = useState(null); // ID of post to view comments
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [submittingPost, setSubmittingPost] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/discussions`);
      const result = await res.json();
      if (result.success) {
        setDiscussions(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(p => ({ ...p, [name]: value }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    setSubmittingPost(true);
    try {
      const res = await fetch(`${API_URL}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const result = await res.json();
      if (result.success) {
        setNewPost({ title: '', author: '', content: '', imageUrl: '' });
        setShowCreateForm(false);
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/discussions/${postId}/like`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setDiscussions(prev => prev.map(post => 
          post._id === postId ? { ...post, likesCount: result.likesCount } : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment(c => ({ ...c, [name]: value }));
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newComment.author || !newComment.content) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_URL}/discussions/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });
      const result = await res.json();
      if (result.success) {
        setNewComment({ author: '', content: '' });
        // Update local discussion list
        setDiscussions(prev => prev.map(post => 
          post._id === postId ? result.data : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const resolveImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    if (imgUrl.startsWith('/uploads')) {
      const isDev = window.location.hostname === 'localhost';
      if (isDev) {
        return `http://localhost:5000${imgUrl}`;
      }
      const backendUrl = API_URL.replace('/api', '');
      return `${backendUrl}${imgUrl}`;
    }
    return imgUrl;
  };

  const handleOpenLightbox = (imgUrl) => {
    setLightboxImage(resolveImageUrl(imgUrl));
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const getSourceBadge = (source, url) => {
    if (source === 'user') {
      return <span style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: 'rgba(56, 142, 60, 0.15)', color: '#81c784', borderRadius: '20px', fontWeight: '600', border: '1px solid rgba(56, 142, 60, 0.3)' }}>👤 Thành viên</span>;
    }
    if (source === 'facebook') {
      return (
        <a 
          href={url || 'https://www.facebook.com/groups/1353837944687586/'} 
          target="_blank" 
          rel="noreferrer"
          style={{ 
            padding: '4px 10px', 
            fontSize: '0.75rem', 
            backgroundColor: 'rgba(24, 119, 242, 0.15)', 
            color: '#4c9aff', 
            borderRadius: '20px', 
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(24, 119, 242, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px' }}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Nhóm Facebook ↗
        </a>
      );
    }
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        style={{ 
          padding: '4px 10px', 
          fontSize: '0.75rem', 
          backgroundColor: 'rgba(197, 160, 89, 0.15)', 
          color: '#ffda75', 
          borderRadius: '20px', 
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          transition: 'all 0.2s'
        }}
      >
        🌐 Diễn đàn {source} ↗
      </a>
    );
  };

  return (
    <div className="static-page" style={{ background: '#090d16', color: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="static-page-header">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '10px' }}>💬 Tường Cộng Đồng</h1>
          <p style={{ color: '#94a3b8' }}>Nơi trao đổi, chia sẻ lá số tử vi và nhận luận giải hữu ích từ cộng đồng cùng các chuyên gia</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(prev => !prev)}
            style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            {showCreateForm ? '✖ Hủy đăng bài' : '✏️ Tạo Bài Viết Mới'}
          </button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.7)', 
            border: '1px solid rgba(212, 175, 55, 0.25)', 
            borderRadius: '12px', 
            padding: '25px', 
            marginBottom: '2.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ marginBottom: '1.2rem', color: '#ffda75', fontFamily: 'var(--font-display)', fontSize: '1.3rem', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '10px' }}>✏️ Đăng câu hỏi luận giải lá số</h3>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#ffda75' }}>Họ tên hoặc Biệt danh</label>
                <input 
                  type="text" 
                  name="author" 
                  value={newPost.author} 
                  onChange={handlePostChange}
                  placeholder="Ví dụ: Nguyễn Văn A..." 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '0.9rem' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#ffda75' }}>Tiêu đề câu hỏi</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newPost.title} 
                  onChange={handlePostChange}
                  placeholder="Ví dụ: Hỏi về cung Phu Thê nữ mạng 1995..." 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '0.9rem' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#ffda75' }}>Đường dẫn hình ảnh Lá số (Tùy chọn)</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  value={newPost.imageUrl} 
                  onChange={handlePostChange}
                  placeholder="Ví dụ: /uploads/laso_sample_1.png hoặc đường dẫn ảnh online..." 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#ffda75' }}>Nội dung câu hỏi (Nêu chi tiết ngày giờ sinh và thắc mắc)</label>
                <textarea 
                  name="content" 
                  value={newPost.content} 
                  onChange={handlePostChange}
                  placeholder="Mô tả thắc mắc của bạn về cung tài lộc, tình cảm hoặc sức khỏe..." 
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', minHeight: '120px', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.5' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submittingPost}
                style={{ width: '100%', padding: '12px', fontWeight: '700', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                {submittingPost ? 'Đang gửi...' : 'ĐĂNG BÀI VIẾT'}
              </button>
            </form>
          </div>
        )}

        {/* Discussions List */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 15px' }} />
            <p style={{ color: '#94a3b8' }}>Đang tải bài viết thảo luận...</p>
          </div>
        )}

        {!loading && discussions.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'rgba(30, 41, 59, 0.7)', 
            borderRadius: '12px', 
            border: '1px solid rgba(212, 175, 55, 0.15)',
            color: '#94a3b8'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#fff' }}>Chưa có bài viết thảo luận nào.</p>
            <p style={{ fontSize: '0.9rem' }}>Hệ thống đang chuẩn bị cào dữ liệu từ Facebook Group hoặc bạn có thể tự tạo bài viết mới đầu tiên!</p>
          </div>
        )}

        <div className="community-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {!loading && discussions.map((d) => (
            <div key={d._id} className="discussion-card" style={{ 
              background: 'rgba(30, 41, 59, 0.5)', 
              border: '1px solid rgba(212, 175, 55, 0.15)', 
              borderRadius: '12px', 
              padding: '25px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s'
            }}>
              {/* Badge nguồn */}
              <div style={{ position: 'absolute', top: '22px', right: '22px' }}>
                {getSourceBadge(d.source, d.originalUrl)}
              </div>

              <div className="discussion-meta" style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '15px' }}>
                <div className="discussion-avatar" style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #c5a059, #ab853a)', 
                  color: '#0f172a', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)'
                }}>{d.avatar}</div>
                <div>
                  <div className="discussion-author" style={{ fontWeight: '700', color: '#ffda75', fontSize: '0.98rem' }}>{d.author}</div>
                  <div className="discussion-time" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {d.time || new Date(d.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <h3 className="discussion-title" style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '800', marginBottom: '12px', maxWidth: '75%', lineHeight: '1.4' }}>{d.title}</h3>
              <p className="discussion-preview" style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '15px', whiteSpace: 'pre-line' }}>{d.content}</p>
              
              {/* Image Attachment Section */}
              {d.imageUrl && (
                <div 
                  className="discussion-image-container" 
                  style={{ 
                    margin: '18px 0', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(212, 175, 55, 0.2)', 
                    cursor: 'zoom-in', 
                    position: 'relative',
                    maxWidth: '450px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }} 
                  onClick={() => handleOpenLightbox(d.imageUrl)}
                >
                  <img 
                    src={resolveImageUrl(d.imageUrl)} 
                    alt="Lá số Tử Vi" 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block', backgroundColor: 'rgba(0,0,0,0.3)' }}
                    onError={(e) => {
                      if (d.imageUrl.includes('laso_sample_1')) {
                        e.target.src = '/images/laso_sample_1.png';
                      } else if (d.imageUrl.includes('laso_sample_2')) {
                        e.target.src = '/images/laso_sample_2.png';
                      } else {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#ffda75', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    🔍 Phóng to lá số
                  </div>
                </div>
              )}

              <div className="discussion-stats" style={{ display: 'flex', gap: '24px', fontSize: '0.88rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                <span 
                  onClick={() => handleLike(d._id)} 
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', userSelect: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ff6b6b'}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  ❤️ {d.likesCount} thích
                </span>
                <span 
                  onClick={() => setSelectedPostComments(selectedPostComments === d._id ? null : d._id)} 
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', userSelect: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ffda75'}
                  onMouseLeave={(e) => e.target.style.color = ''}
                >
                  💬 {d.commentsCount} bình luận
                </span>
              </div>

              {/* Comments Section */}
              {selectedPostComments === d._id && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', borderLeft: '4px solid #c5a059' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#ffda75', fontWeight: '700' }}>Luận giải từ cộng đồng ({d.comments?.length || 0})</h4>
                  
                  {/* List of comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    {d.comments && d.comments.map((c, cIdx) => (
                      <div key={cIdx} style={{ fontSize: '0.88rem', padding: '12px', backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 'bold', color: '#ffda75' }}>
                          <span>{c.author}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 'normal', color: '#64748b' }}>{c.time}</span>
                        </div>
                        <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>{c.content}</div>
                      </div>
                    ))}
                    {(!d.comments || d.comments.length === 0) && (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem', margin: 0 }}>Chưa có bình luận nào. Hãy là người đầu tiên đóng góp luận giải hữu duyên!</p>
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={(e) => handleAddComment(e, d._id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        name="author"
                        value={newComment.author}
                        onChange={handleCommentChange}
                        placeholder="Tên của bạn..." 
                        style={{ width: '30%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '0.88rem' }}
                        required
                      />
                      <input 
                        type="text" 
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        placeholder="Nhập ý kiến luận giải của bạn..." 
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '0.88rem' }}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={submittingComment}
                      style={{ padding: '8px 18px', alignSelf: 'flex-end', fontSize: '0.85rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 8, 15, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out',
            backdropFilter: 'blur(6px)'
          }}
          onClick={handleCloseLightbox}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button 
              onClick={handleCloseLightbox}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                transition: 'all 0.2s'
              }}
            >
              ✕
            </button>
            <img 
              src={lightboxImage} 
              alt="Lá số phóng to" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain', 
                borderRadius: '8px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                border: '2px solid rgba(197, 160, 89, 0.4)'
              }} 
              onError={(e) => {
                if (lightboxImage.includes('laso_sample_1')) {
                  e.target.src = '/images/laso_sample_1.png';
                } else if (lightboxImage.includes('laso_sample_2')) {
                  e.target.src = '/images/laso_sample_2.png';
                }
              }}
            />
            <p style={{ color: '#94a3b8', marginTop: '15px', fontSize: '0.88rem', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              Nhấp bất kỳ đâu hoặc nút ✕ để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
