import './StaticPages.css';

const discussions = [
  { author: 'Minh Tuấn', avatar: 'MT', time: '2 giờ trước', title: 'Chia sẻ kết quả xem tử vi - Mệnh Phích Lịch Hỏa', preview: 'Mình vừa xem tử vi trên đây và thấy rất chính xác, đặc biệt phần cung Mệnh và cung Tài Bạch...', comments: 15, likes: 42 },
  { author: 'Thu Hương', avatar: 'TH', time: '5 giờ trước', title: 'Hỏi về cung Phu Thê - Năm 1995 Ất Hợi', preview: 'Cho mình hỏi cung Phu Thê có Thái Âm + Thiên Lương thì tình duyên có thuận lợi không ạ?', comments: 8, likes: 23 },
  { author: 'Đức Anh', avatar: 'ĐA', time: '1 ngày trước', title: 'So sánh tử vi phái Bắc và phái Nam', preview: 'Mình muốn hỏi sự khác nhau giữa phương pháp tính tử vi phái Bắc và phái Nam...', comments: 32, likes: 67 },
  { author: 'Ngọc Linh', avatar: 'NL', time: '2 ngày trước', title: 'Review: Xem tử vi cho bé sinh năm 2024', preview: 'Vợ chồng mình vừa xem tử vi cho con gái mới sinh, kết quả rất chi tiết và dễ hiểu...', comments: 5, likes: 18 },
  { author: 'Văn Khoa', avatar: 'VK', time: '3 ngày trước', title: 'Kinh nghiệm cải vận theo ngũ hành Mộc', preview: 'Mình thuộc mệnh Mộc và đã thử nhiều cách cải vận, xin chia sẻ kinh nghiệm...', comments: 21, likes: 55 },
  { author: 'Mai Anh', avatar: 'MA', time: '4 ngày trước', title: 'Xem tuổi hợp vợ chồng - Tý và Sửu', preview: 'Bạn trai mình tuổi Tý, mình tuổi Sửu. Mọi người cho mình hỏi tuổi này có hợp không?', comments: 12, likes: 31 },
];

export default function CommunityPage() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>💬 Cộng Đồng</h1>
          <p>Tham gia thảo luận, chia sẻ kinh nghiệm và kết nối với cộng đồng tử vi</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <button className="btn btn-primary">✏️ Tạo Bài Viết Mới</button>
        </div>

        <div className="community-grid">
          {discussions.map((d, i) => (
            <div key={i} className="discussion-card">
              <div className="discussion-meta">
                <div className="discussion-avatar">{d.avatar}</div>
                <div>
                  <div className="discussion-author">{d.author}</div>
                  <div className="discussion-time">{d.time}</div>
                </div>
              </div>
              <h3 className="discussion-title">{d.title}</h3>
              <p className="discussion-preview">{d.preview}</p>
              <div className="discussion-stats">
                <span>💬 {d.comments} bình luận</span>
                <span>❤️ {d.likes} thích</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
