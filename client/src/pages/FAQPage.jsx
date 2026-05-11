import { useState } from 'react';
import './StaticPages.css';

const faqData = [
  { q: 'Xem tử vi trên TuVi có chính xác không?', a: 'Thuật toán của chúng tôi dựa trên phương pháp tử vi cổ học phái Việt Nam, được kiểm chứng bởi các chuyên gia hàng đầu. Kết quả tham khảo có độ chính xác cao, tuy nhiên tử vi là một phần tham khảo, không nên phụ thuộc hoàn toàn.' },
  { q: 'Có cần đăng ký tài khoản để xem tử vi không?', a: 'Không bắt buộc! Bạn có thể xem tử vi miễn phí mà không cần đăng ký. Tuy nhiên, đăng ký tài khoản giúp bạn lưu lịch sử tính toán và truy cập lại kết quả bất cứ lúc nào.' },
  { q: 'Sự khác biệt giữa "Xem Tử Vi" và "Lập Lá Số" là gì?', a: '"Xem Tử Vi" cung cấp phân tích tổng quan 12 cung mệnh với luận giải dễ hiểu. "Lập Lá Số" chi tiết hơn, bao gồm thiên bàn, địa bàn, an sao (100+ sao), tứ hóa, đại hạn và tiểu hạn.' },
  { q: 'Dữ liệu cá nhân của tôi có được bảo mật không?', a: 'Tuyệt đối bảo mật! Chúng tôi không lưu trữ thông tin nhạy cảm. Dữ liệu ngày sinh chỉ được sử dụng để tính toán và không chia sẻ với bất kỳ bên thứ ba nào.' },
  { q: 'Tôi có thể tải kết quả tử vi dưới dạng PDF không?', a: 'Có! Sau khi tính toán xong, bạn có thể tải kết quả dưới dạng PDF hoặc chia sẻ qua mạng xã hội.' },
  { q: 'Làm sao để xem tử vi bằng lịch âm?', a: 'Trong form nhập thông tin, bạn chỉ cần bật toggle "Tính theo Âm lịch" để chuyển sang chế độ tính theo lịch âm.' },
  { q: 'Dịch vụ có thu phí không?', a: 'Tất cả các tính năng cơ bản đều hoàn toàn miễn phí, bao gồm xem tử vi, lập lá số, xem horoscope hàng ngày và lịch âm dương.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>❓ Câu Hỏi Thường Gặp</h1>
          <p>Giải đáp những thắc mắc phổ biến nhất về dịch vụ của chúng tôi</p>
        </div>

        <div className="content-card">
          <div className="faq-list">
            {faqData.map((faq, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  {faq.q}
                  <span className="faq-arrow">▼</span>
                </button>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
