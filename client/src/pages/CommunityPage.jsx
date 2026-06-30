import React, { useState, useEffect } from 'react';
import './StaticPages.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', author: '', content: '' });
  const [selectedPostComments, setSelectedPostComments] = useState(null); // ID of post to view comments
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [submittingPost, setSubmittingPost] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

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
        setNewPost({ title: '', author: '', content: '' });
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

  const getSourceBadge = (source, url) => {
    if (source === 'user') {
      return <span style={{ padding: '2px 8px', fontSize: '0.72rem', backgroundColor: '#e2f0d9', color: '#388e3c', borderRadius: '4px', fontWeight: 'bold' }}>👤 Thành viên</span>;
    }
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        style={{ 
          padding: '2px 8px', 
          fontSize: '0.72rem', 
          backgroundColor: '#e6f3ff', 
          color: '#1565c0', 
          borderRadius: '4px', 
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px'
        }}
      >
        🌐 Diễn đàn {source} ↗
      </a>
    );
  };

  return (
    <div className="static-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="static-page-header">
          <h1>💬 Tường Cộng Đồng</h1>
          <p>Nơi trao đổi, chia sẻ lá số tử vi và nhận luận giải hữu ích từ cộng đồng cùng các chuyên gia</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(prev => !prev)}
            style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600' }}
          >
            {showCreateForm ? '✖ Hủy đăng bài' : '✏️ Tạo Bài Viết Mới'}
          </button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div style={{ 
            background: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '1.2rem', color: '#7a1618' }}>✏️ Đăng câu hỏi luận giải lá số</h3>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Họ tên hoặc Biệt danh</label>
                <input 
                  type="text" 
                  name="author" 
                  value={newPost.author} 
                  onChange={handlePostChange}
                  placeholder="Ví dụ: Nguyễn Văn A..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Tiêu đề câu hỏi</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newPost.title} 
                  onChange={handlePostChange}
                  placeholder="Ví dụ: Hỏi về cung Phu Thê nữ mạng 1995..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Nội dung câu hỏi (Nêu chi tiết ngày giờ sinh và thắc mắc)</label>
                <textarea 
                  name="content" 
                  value={newPost.content} 
                  onChange={handlePostChange}
                  placeholder="Mô tả thắc mắc của bạn về cung tài lộc, tình cảm hoặc sức khỏe..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '120px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submittingPost}
                style={{ width: '100%', padding: '12px', fontWeight: '700' }}
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
            <p style={{ color: '#777' }}>Đang tải bài viết thảo luận...</p>
          </div>
        )}

        {!loading && discussions.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: '#fff', 
            borderRadius: '8px', 
            border: '1px solid #eee',
            color: '#888'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Chưa có bài viết thảo luận nào.</p>
            <p style={{ fontSize: '0.9rem' }}>Vui lòng đăng bài viết mới hoặc truy cập Admin Dashboard để cào các lá số thảo luận từ diễn đàn!</p>
          </div>
        )}

        <div className="community-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!loading && discussions.map((d) => (
            <div key={d._id} className="discussion-card" style={{ 
              background: '#fff', 
              border: '1px solid #eee', 
              borderRadius: '10px', 
              padding: '20px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
              position: 'relative'
            }}>
              {/* Badge nguồn */}
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                {getSourceBadge(d.source, d.originalUrl)}
              </div>

              <div className="discussion-meta" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div className="discussion-avatar" style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#7a1618', 
                  color: '#ffda75', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>{d.avatar}</div>
                <div>
                  <div className="discussion-author" style={{ fontWeight: '700', color: '#333' }}>{d.author}</div>
                  <div className="discussion-time" style={{ fontSize: '0.8rem', color: '#888' }}>
                    {d.time || new Date(d.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <h3 className="discussion-title" style={{ fontSize: '1.15rem', color: '#7a1618', fontWeight: '800', marginBottom: '10px', maxWidth: '80%' }}>{d.title}</h3>
              <p className="discussion-preview" style={{ fontSize: '0.92rem', color: '#444', lineHeight: '1.6', marginBottom: '15px' }}>{d.content}</p>
              
              <div className="discussion-stats" style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #f5f5f5', paddingTop: '10px' }}>
                <span 
                  onClick={() => handleLike(d._id)} 
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}
                >
                  ❤️ {d.likesCount} thích
                </span>
                <span 
                  onClick={() => setSelectedPostComments(selectedPostComments === d._id ? null : d._id)} 
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}
                >
                  💬 {d.commentsCount} bình luận
                </span>
              </div>

              {/* Comments Section */}
              {selectedPostComments === d._id && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #7a1618' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: '#7a1618' }}>Bình luận ({d.comments?.length || 0})</h4>
                  
                  {/* List of comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                    {d.comments && d.comments.map((c, cIdx) => (
                      <div key={cIdx} style={{ fontSize: '0.85rem', padding: '8px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
                          <span>{c.author}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#aaa' }}>{c.time}</span>
                        </div>
                        <div style={{ color: '#333' }}>{c.content}</div>
                      </div>
                    ))}
                    {(!d.comments || d.comments.length === 0) && (
                      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.82rem', margin: 0 }}>Chưa có bình luận nào. Hãy là người đầu tiên luận giải bài này!</p>
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={(e) => handleAddComment(e, d._id)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        name="author"
                        value={newComment.author}
                        onChange={handleCommentChange}
                        placeholder="Tên của bạn..." 
                        style={{ width: '30%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                        required
                      />
                      <input 
                        type="text" 
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        placeholder="Nhập nội dung luận giải / ý kiến..." 
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={submittingComment}
                      style={{ padding: '6px 15px', alignSelf: 'flex-end', fontSize: '0.82rem' }}
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
    </div>
  );
}
