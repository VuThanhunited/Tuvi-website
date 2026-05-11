import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './Chatbot.css';

export default function Chatbot() {
  const location = useLocation();
  const { isAuthenticated, credits } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Mình là AI Trợ lý của hệ thống. Bạn muốn hỏi gì về lá số Tử Vi, các cung hay cách cục không?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Hàm tạo câu trả lời tự động dựa trên từ khóa (Mock AI)
  const generateAutoReply = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('mệnh') || lowerText.includes('thân')) {
      return 'Cung Mệnh đại diện cho bản chất bẩm sinh, còn cung Thân là nơi bạn sẽ hướng tới sau 30 tuổi. Bạn đang có sao nào đóng tại cung Mệnh vậy?';
    }
    if (lowerText.includes('tử vi') || lowerText.includes('thất sát') || lowerText.includes('phá quân') || lowerText.includes('tham lang') || lowerText.includes('sát phá tham')) {
      return 'Đây là những chính tinh rất quan trọng. Bộ Sát Phá Tham thường chỉ sự biến động, khai phá, tính hành động cao. Còn Tử Vi mang tính lãnh đạo, bao dung và tôn quý.';
    }
    if (lowerText.includes('tình duyên') || lowerText.includes('phu thê') || lowerText.includes('vợ chồng')) {
      return 'Cung Phu Thê sẽ cho biết tổng quan về đường tình duyên, tính cách người phối ngẫu và hạnh phúc gia đình. Nếu có các sao như Đào Hoa, Hồng Loan, Thiên Hỷ thì đường tình cảm rất phong phú!';
    }
    if (lowerText.includes('tiền') || lowerText.includes('tài bạch') || lowerText.includes('giàu') || lowerText.includes('tài lộc')) {
      return 'Cung Tài Bạch thể hiện phương thức kiếm tiền và khả năng quản lý tài chính. Nếu có Hóa Lộc, Vũ Khúc hay Lộc Tồn miếu vượng thì đường tiền tài rất hanh thông và thuận lợi.';
    }
    if (lowerText.includes('giá') || lowerText.includes('xem phí') || lowerText.includes('đặt lịch') || lowerText.includes('thầy')) {
      return 'Bạn có thể đặt lịch luận giải chuyên sâu trực tiếp với Thầy Nguyễn Thế Anh hoặc các chuyên gia trên hệ thống qua nút "Đặt lịch" ở trang chủ nhé. Chi phí sẽ tùy thuộc vào gói luận giải bạn chọn.';
    }
    if (lowerText.includes('cách cục') || lowerText.includes('tứ hóa')) {
      return 'Cách cục và Tứ Hóa là phần nâng cao giúp đánh giá sự thành bại trong lá số. Bạn có thể xem chi tiết ở mục CMS quản trị hoặc chờ bản cập nhật tính năng AI luận giải sâu sắp tới nhé!';
    }
    if (lowerText.includes('chào') || lowerText.includes('hello') || lowerText.includes('hi')) {
      return 'Chào bạn! Mình có thể giúp gì cho bạn hôm nay?';
    }
    if (lowerText.includes('cảm ơn') || lowerText.includes('thanks')) {
      return 'Không có gì! Chúc bạn một ngày tốt lành và gặp nhiều may mắn nhé. Nếu cần gì thêm cứ nhắn mình.';
    }
    
    // Câu trả lời mặc định khi không khớp từ khóa
    return 'Cảm ơn câu hỏi của bạn. Hệ thống AI luận giải của chúng tôi đang kết nối với cơ sở dữ liệu CMS để phân tích sâu hơn. Tạm thời bạn hãy để lại thông tin hoặc đặt lịch trực tiếp với chuyên gia để được giải đáp chi tiết nhé!';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const isSpecific = location.pathname.includes('/ket-qua');

    if (isSpecific) {
      if (!isAuthenticated) {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn cần đăng nhập để sử dụng Chatbot hỏi chi tiết lá số.' }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      if (credits <= 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn đã hết coin. Vui lòng nạp thêm coin để hỏi chi tiết lá số.' }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      // DEDUCT COIN LOGIC HERE IN REAL APP
      setTimeout(() => {
        const botReply = `(Đã trừ 1 coin) ${generateAutoReply(userMsg)}`;
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    } else {
      // General chat
      setTimeout(() => {
        const botReply = generateAutoReply(userMsg);
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span style={{fontSize: '1.2rem'}}>🤖</span> AI Luận Giải
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input 
              type="text" 
              className="chatbot-input" 
              placeholder="Nhập câu hỏi của bạn..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="chatbot-send" onClick={handleSend} title="Gửi tin nhắn">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
