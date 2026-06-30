import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Interpretation from './models/Interpretation.js';
import User from './models/User.js';

const seedInterpretations = async () => {
  try {
    await connectDB();

    // 1. Get an Admin User to assign createdBy
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne();
    }
    if (!adminUser) {
      console.log('❌ Vui lòng chạy seedAdmin.js trước để tạo tài khoản admin!');
      process.exit(1);
    }

    // 2. Clear existing interpretations
    await Interpretation.deleteMany({});
    console.log('🗑️  Đã xóa các luận giải cũ.');

    // 3. Define sample interpretations
    const sampleData = [
      // Palace meanings
      {
        type: 'cung',
        cung: 'Mệnh',
        content: 'Cung Mệnh là cung vị chủ chốt của cả lá số, đại diện cho tính cách, dung mạo, tài năng thiên phú, khí chất bẩm sinh và vận mệnh tổng quan của một đời người. Mệnh tốt thì gốc rễ vững chắc, vượt qua tai ương dễ dàng.',
        source: 'Tử Vi Đẩu Số Tân Biên',
        createdBy: adminUser._id
      },
      {
        type: 'cung',
        cung: 'Phu Thê',
        content: 'Cung Phu Thê phản ánh nhân duyên, xu hướng lựa chọn bạn đời, tính cách và hoàn cảnh gia thế của người phối ngẫu, đồng thời cho biết mối quan hệ tình cảm vợ chồng có hòa hợp, hạnh phúc hay xung đột trắc trở.',
        source: 'Tử Vi Đẩu Số Tân Biên',
        createdBy: adminUser._id
      },
      {
        type: 'cung',
        cung: 'Tài Bạch',
        content: 'Cung Tài Bạch chủ về phương thức kiếm tiền, năng lực tài chính, mức độ giàu nghèo và thái độ đối với tiền bạc của mệnh tạo. Cho biết tiền bạc tụ hay tán, đắc tài trong hoàn cảnh nào.',
        source: 'Trung Châu Tử Vi',
        createdBy: adminUser._id
      },
      {
        type: 'cung',
        cung: 'Quan Lộc',
        content: 'Cung Quan Lộc đại diện cho con đường sự nghiệp, ngành nghề thích hợp, vị trí xã hội, năng lực làm việc và mức độ thành bại trong công danh. Cho biết đương số có số làm quan hay làm chủ.',
        source: 'Trung Châu Tử Vi',
        createdBy: adminUser._id
      },

      // Star-in-Palace meanings
      {
        type: 'sao_cung',
        sao: 'Thiên Cơ',
        cung: 'Mệnh',
        trangThai: 'Đ',
        content: 'Thiên Cơ đắc địa đóng tại cung Mệnh chủ về người thông minh, hiền hậu, đa tài, giỏi mưu lược và có óc phán đoán, phân tích sắc bén. Bạn có đầu óc sáng tạo, học một biết mười, tính tình ôn hòa nhưng tâm tính thường suy nghĩ nhiều, không mấy khi nhàn hạ.',
        source: 'Tử Vi Đẩu Số Vân Đằng',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tử Vi',
        cung: 'Mệnh',
        trangThai: 'M',
        content: 'Tử Vi miếu địa đóng mệnh là cách cục đế tinh đắc vị tối tôn tối quý. Đương số dung mạo uy nghi, trung hậu, tính tình bao dung, khí chất lãnh đạo thiên bẩm. Cuộc đời gặp nhiều quý nhân phù trợ, dễ đạt được công danh hiển hách, tài lộc dồi dào.',
        source: 'Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phá Quân',
        cung: 'Huynh Đệ',
        trangThai: 'M',
        content: 'Phá Quân miếu địa đóng cung Huynh Đệ chủ về anh em có người cá tính mạnh mẽ, dũng cảm, quyết đoán nhưng có phần nóng nảy. Anh em lập nghiệp phương xa sẽ tốt hơn, tuy có lúc bất đồng quan điểm nhưng vẫn tương trợ lẫn nhau khi hoạn nạn.',
        source: 'Trung Châu Tử Vi',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Lộc',
        cung: 'Phu Thê',
        content: 'Hóa Lộc tại cung Phu Thê chủ về mối lương duyên tốt đẹp, vợ chồng tình cảm mặn nồng thắm thiết. Người phối ngẫu là người có tài kiếm tiền, mang lại vận may tài lộc cho đương số sau khi kết hôn, gia đình sung túc thịnh vượng.',
        source: 'Tứ Hóa Phái',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Kỵ',
        cung: 'Tài Bạch',
        content: 'Hóa Kỵ tại cung Tài Bạch chủ về tiền tài dễ gặp tranh chấp, thị phi hoặc bị tiểu nhân dòm ngó. Kiếm tiền vất vả, thường phải hao tâm tổn trí. Đương số cần minh bạch trong sổ sách tài chính và tránh đầu tư mạo hiểm.',
        source: 'Tứ Hóa Phái',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Quyền',
        cung: 'Tử Tức',
        content: 'Hóa Quyền tại cung Tử Tức chủ về con cái sau này có chí hướng lớn, năng lực tự lập cao, tính cách mạnh mẽ và có thiên hướng làm lãnh đạo. Con cái có quyền uy, học hành đỗ đạt.',
        source: 'Tứ Hóa Phái',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Khoa',
        cung: 'Phúc Đức',
        content: 'Hóa Khoa đóng cung Phúc Đức là đại cát thần hóa giải tai ách. Đương số được hưởng phúc ấm tổ tiên, dòng họ nhiều người đỗ đạt, thanh danh tốt đẹp. Gặp dữ hóa lành, tâm tính lương thiện, sống an nhàn tự tại.',
        source: 'Trung Châu Tử Vi',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Cơ',
        cung: 'Phu Thê',
        content: 'Thiên Cơ đóng Phu Thê chủ về người phối ngẫu thông minh, nhanh nhẹn, khéo léo nhưng tính khí đôi khi thay đổi thất thường. Vợ chồng kết hôn sớm dễ có trục trặc nhẹ, nên nhường nhịn thấu hiểu lẫn nhau.',
        source: 'Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      }
    ];

    // 4. Insert database
    await Interpretation.insertMany(sampleData);
    console.log('✅ Đã nạp thành công các luận giải Tử Vi mẫu vào Database!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp luận giải:', error.message);
    process.exit(1);
  }
};

seedInterpretations();
