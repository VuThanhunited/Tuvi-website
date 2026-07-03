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
      },
      // Luận giải chi tiết cào từ tuvi.vn
      {
        type: 'sao_cung',
        sao: 'Lộc Tồn',
        cung: 'Mệnh',
        content: 'Mệnh có Lộc tồn tọa thủ và Cô thần, Quả tú hội hợp: Là người cô đơn, xung khắc cha mẹ, vợ con hay anh em.',
        source: 'Muốn luận đoán đúng tử vi - Hà Vi',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tuế Phá',
        cung: 'Mệnh',
        content: 'Mệnh có Tuế phá: Tư cách: Là mẫu người không bao giờ đồng ý, khi bàn ra chống phá tới cùng, người ta đề nghị gì thì bác bỏ hết.',
        source: 'Tử vi nghiệm lý - Cụ Thiên Lương',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Khốc',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên khốc: Là người cô độc, mệnh vất vả.',
        source: 'Tử vi đẩu số giải mã đời người - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tướng Quân',
        cung: 'Mệnh',
        content: 'Mệnh có Tướng quân: Thích về đằng võ.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hữu Bật',
        cung: 'Mệnh',
        content: 'Mệnh có Hữu bật tọa thủ và Quả tú hội hợp: Sống thọ.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Hư',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên hư: Không giữ được nghiệp nhà.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Vũ Khúc',
        cung: 'Mệnh',
        content: 'Mệnh có Vũ khúc tọa thủ và Hóa kỵ hội hợp: Đen và ai cũng ghét.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Quyền',
        cung: 'Mệnh',
        content: 'Mệnh có Hóa quyền: Dễ khắc chồng, cô đơn và lao động cật lực.',
        source: 'Tử vi đại toàn - Thái Đình Nguyên',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Phủ',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên phủ: Đó là người có phúc khí, có khí chất cao nhã, vượng phu ích tử, nhưng họ cũng nên mập chứ không nên gầy, gầy thì ít phúc. Nếu ở Tuất mà tọa Mệnh thì là người rất lanh lợi thông minh, lý trí và tình cảm cân bằng, chỉ có điều là không đối diện được với sự thất bại và thử thách hơn sự kích động, dễ nhụt chí.',
        source: 'Đăng Hạ Thuật - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Vũ Khúc',
        cung: 'Mệnh',
        content: 'Mệnh có Vũ khúc: Là người tài giỏi, đảm đang gan góc, được hưởng giàu sang và sống lâu. Nhưng phải muộn lập gia đình mới tránh được những nỗi buồn khổ, đau đớn vì chồng con và mới vượng phu ích tử.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thất Sát',
        cung: 'Mệnh',
        content: 'Mệnh có Thái tuế tọa thủ và Thất sát hội hợp: Là người trí dũng có thừa.',
        source: 'Phú Ma Thị',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Tướng',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên tướng tọa thủ và Hóa lộc hội hợp: Dễ quyến rũ đàn bà con gái, cũng thường là số đa thê.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Tướng',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên tướng tọa thủ và Hữu bật hội hợp: Thường gặp may mắn.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Tướng',
        cung: 'Mệnh',
        content: 'Mệnh có Thiên tướng tọa thủ và Hữu bật, Tả phù hội hợp: Làm nghề thầy thuốc giỏi.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Điếu Khách',
        cung: 'Mệnh',
        content: 'Mệnh có Điếu khách tọa thủ và Thiên hình hội hợp: Dễ bị tù tội, thua kiện.',
        source: 'Tử vi đại toàn - Thái Đình Nguyên',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phong Cáo',
        cung: 'Mệnh',
        content: 'Mệnh có Phong cáo tọa thủ và Bát tọa, Tam thai hội hợp: Hưởng phúc của ông cha.',
        source: 'Muốn luận đoán đúng tử vi - Hà Vi',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Kỵ',
        cung: 'Huynh Đệ',
        content: 'Huynh đệ có Hóa kỵ: Anh chị em bất hòa, xa cách nhau.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Lộc',
        cung: 'Huynh Đệ',
        content: 'Huynh đệ có Hóa lộc: Lúc giữa vợ chồng có sự va chạm, nếu muốn vãn hồi hay hòa giải, phương cách tốt nhất là diễn lại chiêu cũ. Đó là mang những chiêu cũ đã dùng lúc mới yêu nhau ra phát huy hết mức. Thái độ ân cần tràn đầy tình ý luôn tỏ ra có hiệu quả, tuy là chiêu cũ nhưng lúc nào cũng thịnh hành; nếu thêm vào đó là tặng quà để tỏ thành ý, thế là bạn sẽ có nhiều ngày tháng tốt đẹp.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Đồng',
        cung: 'Huynh Đệ',
        content: 'Huynh đệ có Thiên đồng: Về cơ bản, cha mẹ chồng (vợ) của bạn sẽ là người cởi mở, mau mắn, không để bụng, không có tâm cơ gì, bình thường luôn mỉm cười..., nhưng tuy họ tính tình khả ái, họ không phải là người dễ bị bắt nạt, nếu bạn giả điên cưỡi lên đầu họ, thì bạn sẽ biết sức bộc phát của họ có thể dọa chết người.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thất Sát',
        cung: 'Phu Thê',
        content: 'Phu thê có Thất sát tọa thủ và Hóa quyền hội hợp: Sợ vợ lắm.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Văn Khúc',
        cung: 'Phu Thê',
        content: 'Phu thê có Văn khúc: "Một nửa kia" của bạn có thể là một người đàn ông đáng yêu hoặc điển trai; "người ấy" lúc nào cũng có nụ cười ngọt ngào trên môi, nếu bạn muốn làm một tình nhân theo kiểu "chị" hay "mẹ" của "người ấy" thì họ sẽ là "một nửa kia" tốt nhất của bạn. Nếu không bạn sẽ phát điên, trên thế giới sao lại có kiểu đàn ông yếu đuối như vậy! Chuyện gì cũng không có ý kiến, chuyện gì cũng nói "được được". Đúng vậy, họ là người không có chủ kiến, ngay cả những cô gái khác ngỏ ý với họ, họ cũng sẽ nói "được được"!',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phá Quân',
        cung: 'Phu Thê',
        content: 'Phu thê có Phá quân: "Một nửa kia" của bạn là một người đàn ông có phong cách của một "đại ca"; nếu bạn là một thiếu nữ cần được bảo vệ, thì họ sẽ mở rộng vòng tay để cho bạn tựa vào. Tuy người đàn ông mạnh mẽ này sẽ mang lại cho bạn cảm giác an toàn, nhưng tính khí của họ cũng rất là thô bạo. Nếu xảy ra chuyện tranh chấp với họ, nhỏ thì quát mắng, lớn thì ném đồ đạc vào bạn, nhưng họ cũng mau nguôi giận, thường thường sau khi nổi cơn tam bành lục tặc họ lại muốn nói lời xin lỗi. Cho nên nếu bạn làm "một nửa kia" của họ thì ngoài tính nết dịu dàng, bạn còn phải đủ mạnh mẽ.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phá Quân',
        cung: 'Phu Thê',
        content: 'Phu thê có Phá quân tọa thủ và Hóa quyền hội hợp: Người phối ngẫu có ý chí phối mình.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Dương',
        cung: 'Tử Tức',
        content: 'Tử tức có Thái dương tọa thủ và Thiên hỉ hội hợp: Đẻ sinh đôi.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Đào Hoa',
        cung: 'Tử Tức',
        content: 'Tử tức có Đào hoa tọa thủ và Văn xương hội hợp: Con trai làm nên to, con gái hư.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Kình Dương',
        cung: 'Tử Tức',
        content: 'Tử tức có Kình dương: Bị điếc.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hồng Loan',
        cung: 'Tử Tức',
        content: 'Tử tức có Hồng loan: Con gái dệt vải và may vá khéo.',
        source: 'Tử vi chỉ nam - Song An Đỗ Văn Lưu',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Linh Tinh',
        cung: 'Tử Tức',
        content: 'Tử tức có Linh tinh đơn thủ: Trường hợp Hỏa Tinh hoặc Linh Tinh độc tọa cung tử nữ mà không thấy tổ hợp sao khác, là ý tượng: đương sự hay tiêu xài một khoản tiền lớn gây ra ảnh hưởng nghiêm trọng, thường phải mất một thời gian dài cần kiệm và rất nỗ lực mới bù đắp được. Nhưng Hỏa Tinh hoặc Linh Tinh tọa cung tử nữ, còn chủ về các khoản tiêu xài bắt buộc hoặc các khoản tiêu xài chính đáng khác, chứ không hoàn toàn do xung động mà tiêu xài tiền.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tham Lang',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Tham lang tọa thủ và Địa không, Địa kiếp hội hợp: Phá tài hoặc bị xâm lấn, thôn tính.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Cô Thần',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Cô thần: Bất luận là chính tinh miếu hãm hoặc là chính tinh hóa ra sao thì cũng đều chủ cuối cùng ắt sẽ phá bại hết.',
        source: 'Tử vi đẩu số giải mã đời người - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Mã',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Thiên mã: Nên sớm xa quê đến nơi khác sẽ được phát tài.',
        source: 'Tử vi đẩu số giải mã đời người - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Lộc Tồn',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Lộc tồn: Chủ đại phú, có vàng chôn ngọc cất.',
        source: 'Thái Vi Phú',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Liêm Trinh',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Liêm trinh tọa thủ và Địa không, Địa kiếp hội hợp: Chủ về nguồn tiền tài bất ổn, thường cảm thấy túng quẫn.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tả Phù',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Tả phù: Khổ nhưng không đến nỗi chịu bần cùng.',
        source: 'Tử vi đẩu số giải mã đời người - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Liêm Trinh',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Liêm trinh: Liêm Trinh là sao đào hoa thứ, tư duy tế nhị, giác quan thứ sáu nhạy bén, rất giỏi quản lý tài chính. Vận hoạnh tài và vận thiên tài không yếu; mệnh tạo sẽ theo đuổi công việc có thu nhập cao để thỏa mãn hứng thú, thị hiếu của mình. Rất thích hợp với các nghề nghiệp liên quan đến nghệ thuật biểu diễn, truyền bá, quảng cáo, quan hệ công chúng, pháp luật, thời trang, kim cương...',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Liêm Trinh',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Liêm trinh tọa thủ và Hóa kỵ hội hợp: Vì tiền mà sinh ra tai họa, hoặc kiếm tiền mà mang họa.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Kỵ',
        cung: 'Tài Bạch',
        content: 'Tài bạch có Hóa kỵ: Có dục vọng theo đuổi tiền tài cực cao; kiếm tiền trong hoàn cảnh thị phi hoặc các ngành nghề đặc thù (luật sư, mệnh lý); hay gặp tình huống không thuận lợi về tài vận hoặc thất nghiệp ngắn hạn; luôn cảm thấy thiếu an toàn về tiền bạc và hay than nghèo; thực dụng và lấy tiền làm thước đo giá trị cuộc sống; tâm lý nặng tính được mất; người phối ngẫu thấy mệnh tạo là người ích kỷ; tiêu xài tiền hào phóng cho bản thân và người thân.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Đà La',
        cung: 'Tật Ách',
        content: 'Tật ách có Đà la: Phải đề phòng bệnh bướu tử cung đưa đến giải phẫu.',
        source: 'Tử vi tinh điển - Vũ Tài Lục',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Cơ',
        cung: 'Tật Ách',
        content: 'Tật ách có Thiên cơ tọa thủ và Hóa kỵ hội hợp: Là ngoại thương, tứ chi bị thương.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Khôi',
        cung: 'Thiên Di',
        content: 'Thiên di có Thiên khôi: Đi xa sẽ thành công hoặc thành danh.',
        source: 'Đăng Hạ Thuật - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hữu Bật',
        cung: 'Thiên Di',
        content: 'Thiên di có Hữu bật: Khéo léo trong giao tiếp, ra ngoài có quý nhân giúp đỡ, đáng tiếc là tình cảm quá phong phú nên dễ chuốc lấy những rắc rối trong chuyện tình cảm.',
        source: 'Tử vi đẩu số giải mã đời người - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thất Sát',
        cung: 'Thiên Di',
        content: 'Thiên di có Thất sát: Chủ quan, hoài bão hùng tâm đại chí nhưng thường "mắt nhìn cao mà tay với không tới". Giàu trí tưởng tượng, năng lực lập kế hoạch cực mạnh nhưng lực hành động thực tiễn lại hơi thiếu; thiếu dũng khí mạo hiểm hoặc thiếu lực xung kích.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Âm',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thái âm tọa thủ và Hóa kỵ hội hợp: Bị lừa dối, hoặc trở thành đối địch.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Đồng',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thiên đồng tọa thủ và Địa không, Địa kiếp hội hợp: Bị gây lụy mà phá tài.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Lương',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thiên lương đơn thủ: Bạn hữu ít, thuộc hạ ít.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Lương',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thiên lương tọa thủ và Hóa kỵ hội hợp: Đối kháng xung đột.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Âm',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thái âm tọa thủ và Địa không, Địa kiếp hội hợp: Vì bạn mà phát tài.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Dương',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thái dương tọa thủ và Địa không, Địa kiếp hội hợp: Vì thuộc hạ mà phá tài, song không được cảm ơn.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Dương',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thái dương tọa thủ và Hóa kỵ hội hợp: Thường vì bạn hữu, thuộc hạ mà chuốc lấy tai họa không đâu.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Lương',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thiên lương tọa thủ và Hóa lộc, Lộc tồn hội hợp: Vì tiền tài mà nổi sóng gió.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Đồng',
        cung: 'Nô Bộc',
        content: 'Nô bộc có Thiên đồng tọa thủ và Hóa kỵ hội hợp: Tình cảm bị tổn thương.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Văn Xương',
        cung: 'Quan Lộc',
        content: 'Quan lộc có Văn xương: Có tài nghệ, viết lách, hội họa hoặc giọng ca hay, thích hợp làm thêm nghề phụ liên quan đến văn nghệ hoặc nghệ thuật.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Tướng',
        cung: 'Quan Lộc',
        content: 'Quan lộc có Thiên tướng: Không thể làm người lãnh đạo tối cao mà cần phụ tá dưới quyền người khác; công tác ở các công ty lớn hoặc cơ cấu lớn; công tác cần có ý kiến nhiều phương diện.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tử Vi',
        cung: 'Quan Lộc',
        content: 'Quan lộc có Tử vi: Nhiều toan tính cao xa, sức chịu đựng cực mạnh và đầy tham vọng. Trừ phi gặp Không Kiếp phá cách, nếu không nhất định có thể tạo dựng sự nghiệp to tát. Tuy nhiên nếu đồng cung với Tham Lang thì thường phát muộn, dễ thất bại thời trẻ do quá trọng đạo nghĩa.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Khoa',
        cung: 'Quan Lộc',
        content: 'Quan lộc có Hóa khoa: Phong thái văn nhã, thanh cao, an phận thủ thường, coi trọng danh dự uy tín; hiếm khi tham gia phe phái tại nơi làm việc; làm tròn bổn phận của mình; công danh sự nghiệp phát triển tuần tự tiệm tiến và có quý nhân phùng hung hóa cát.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Cự Môn',
        cung: 'Điền Trạch',
        content: 'Điền trạch có Cự môn: Người chuyên kích động gây chuyện thị phi, khó gặp hàng xóm tốt, gia đình không yên ổn, thường xảy ra cãi vã. Gần nơi ở có mương nước, đường sông, giếng, chắn đường, phá tường... chủ về hung họa.',
        source: 'Tử vi đẩu số kinh điển - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Cơ',
        cung: 'Điền Trạch',
        content: 'Điền trạch có Thiên cơ: Người tính toán, tranh chấp. Vùng lân cận có rừng cây, cột điện, ống khói, gỗ mục... lấy nhược để luận cát hung.',
        source: 'Tử vi đẩu số kinh điển - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Quyền',
        cung: 'Điền Trạch',
        content: 'Điền trạch có Hóa quyền: Thường được ở dinh thự, hoặc nhà cao cửa rộng, rất sang trọng.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thất Sát',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Thất sát tọa thủ và Hóa kỵ hội hợp: Tuy có mục tiêu nhưng chỉ để an ủi tinh thần, thực tế thường cảm thấy trống rỗng, cuộc đời vô nghĩa.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Việt',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Thiên việt: (Âm phần) Hình dáng dài giống như cái búa.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Bạch Hổ',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Bạch hổ: (Âm phần) Đất có lẫn nhiều đá.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phi Liêm',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Phi liêm: (Âm phần) Mộ để ở gần núi hoặc đồi trơ trọi, đất khô nóng và tan lở.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tham Lang',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Tham lang: (Âm phần) Mộ tổ xa đời, đất nổi cao hình con chó ngồi, sắc đen như bùn, nhiều cây cỏ mọc rạp.',
        source: 'Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Phá Quân',
        cung: 'Phúc Đức',
        content: 'Phúc đức có Phá quân tọa thủ và Hóa kỵ hội hợp: Do dự, không quyết đoán.',
        source: 'Nghiên cứu tinh mệnh học - Nguyễn Anh Vũ biên soạn',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Lộc',
        cung: 'Phụ Mẫu',
        content: 'Phụ mẫu có Hóa lộc: Là người khá thông minh, lạc quan nhưng lười biếng.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Khoa',
        cung: 'Phụ Mẫu',
        content: 'Phụ mẫu có Hóa khoa: Vận thi cử cực tốt, không bị hình phạt, kiện tụng quan ty bám người, gặp họa hóa cát. Bản thân hiếu thuận, quan hệ với song thân dung thông; có duyên với cấp trên tốt.',
        source: 'Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thiên Hình',
        cung: 'Phụ Mẫu',
        content: 'Phụ mẫu có Thiên hình: Cha mẹ duyên mỏng: ít được đoàn tụ với cha mẹ, đa số ở xa nhà hoặc cha mẹ mất sớm.',
        source: 'Đăng Hạ Thuật - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Thái Dương',
        cung: 'Phụ Mẫu',
        content: 'Phụ mẫu có Thái dương: Chủ về mệnh bị vợ quản lý (vì Phụ Mẫu là Điền Trạch của Phu Thê). Vợ là người mẫn cán nhưng quá hung hãn, bá đạo, khiến người khác khó ưa.',
        source: 'Đăng Hạ Thuật - Phan Tử Ngư',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Tuế Phá',
        cung: 'Thân',
        content: 'Thân có Tuế phá: Khi hành động thì không bao giờ đồng ý, khi bàn ra chống phá tới cùng, người ta đề nghị gì thì bác bỏ hết.',
        source: 'Tử vi nghiệm lý - Cụ Thiên Lương',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Hóa Quyền',
        cung: 'Thân',
        content: 'Thân có Hóa quyền: Dễ khắc chồng, cô đơn và lao động cật lực.',
        source: 'Tử vi đại toàn - Thái Đình Nguyên',
        createdBy: adminUser._id
      },
      {
        type: 'sao_cung',
        sao: 'Vũ Khúc',
        cung: 'Thân',
        content: 'Thân có Vũ khúc: Chồng mất trước, không tái giá nhất định cô quả.',
        source: 'Tử vi đẩu số kinh điển - Phan Tử Ngư',
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
