import TuViResult from '../models/TuViResult.js';
import TuViDatabase from '../models/TuViDatabase.js';

// ===== DATA TABLES =====
const TC = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const DC = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const EMO = ['🐀','🐂','🐯','🐰','🐲','🐍','🐴','🐐','🐒','🐓','🐕','🐷'];
const NHC = { Kim:'#C0C0C0', 'Thủy':'#1E90FF', 'Hỏa':'#FF4500', 'Thổ':'#DAA520', 'Mộc':'#2E8B57' };
const NA = [
  'Hải Trung Kim','Hải Trung Kim','Lô Trung Hỏa','Lô Trung Hỏa',
  'Đại Lâm Mộc','Đại Lâm Mộc','Lộ Bàng Thổ','Lộ Bàng Thổ',
  'Kiếm Phong Kim','Kiếm Phong Kim','Sơn Đầu Hỏa','Sơn Đầu Hỏa',
  'Giản Hạ Thủy','Giản Hạ Thủy','Thành Đầu Thổ','Thành Đầu Thổ',
  'Bạch Lạp Kim','Bạch Lạp Kim','Dương Liễu Mộc','Dương Liễu Mộc',
  'Tuyền Trung Thủy','Tuyền Trung Thủy','Ốc Thượng Thổ','Ốc Thượng Thổ',
  'Phích Lịch Hỏa','Phích Lịch Hỏa','Tùng Bách Mộc','Tùng Bách Mộc',
  'Trường Lưu Thủy','Trường Lưu Thủy','Sa Trung Kim','Sa Trung Kim',
  'Sơn Hạ Hỏa','Sơn Hạ Hỏa','Bình Địa Mộc','Bình Địa Mộc',
  'Bích Thượng Thổ','Bích Thượng Thổ','Kim Bạch Kim','Kim Bạch Kim',
  'Phú Đăng Hỏa','Phú Đăng Hỏa','Thiên Hà Thủy','Thiên Hà Thủy',
  'Thái Dịch Thổ','Thái Dịch Thổ','Thoa Xuyến Kim','Thoa Xuyến Kim',
  'Tang Đố Mộc','Tang Đố Mộc','Đại Khe Thủy','Đại Khe Thủy',
  'Sa Trung Thổ','Sa Trung Thổ','Thiên Thượng Hỏa','Thiên Thượng Hỏa',
  'Thạch Lựu Mộc','Thạch Lựu Mộc','Đại Hải Thủy','Đại Hải Thủy',
];
const CN = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
const CI = ['👤','👨‍👩‍👧','🙏','🏠','💼','🤝','✈️','🏥','💰','👶','💑','👫'];
const CM = { 'Thủy':{name:'Thủy Nhị Cục',value:2},'Mộc':{name:'Mộc Tam Cục',value:3},'Kim':{name:'Kim Tứ Cục',value:4},'Thổ':{name:'Thổ Ngũ Cục',value:5},'Hỏa':{name:'Hỏa Lục Cục',value:6} };
const GCM = { '23-1':{chi:'Tý',index:0},'1-3':{chi:'Sửu',index:1},'3-5':{chi:'Dần',index:2},'5-7':{chi:'Mão',index:3},'7-9':{chi:'Thìn',index:4},'9-11':{chi:'Tỵ',index:5},'11-13':{chi:'Ngọ',index:6},'13-15':{chi:'Mùi',index:7},'15-17':{chi:'Thân',index:8},'17-19':{chi:'Dậu',index:9},'19-21':{chi:'Tuất',index:10},'21-23':{chi:'Hợi',index:11} };

// ===== HELPERS =====
function getNH(na) {
  if (na.includes('Kim')) return 'Kim';
  if (na.includes('Thủy')) return 'Thủy';
  if (na.includes('Hỏa')) return 'Hỏa';
  if (na.includes('Thổ')) return 'Thổ';
  if (na.includes('Mộc')) return 'Mộc';
  return 'Không xác định';
}
function genRating(s) { const x=Math.sin(s*12.9898+78.233)*43758.5453; return Math.floor((x-Math.floor(x))*5)+1; }
function rLabel(r) {
  if(r===5) return {text:'Tuyệt vời',color:'#27AE60'};
  if(r===4) return {text:'Tốt',color:'#2ECC71'};
  if(r===3) return {text:'Bình thường',color:'#F39C12'};
  if(r===2) return {text:'Yếu',color:'#E67E22'};
  return {text:'Kém',color:'#E74C3C'};
}
function interp(cn,r,g,nh) {
  const gt=g==='nam'?'nam':'nữ';
  if(cn==='Mệnh') return `Cung Mệnh ${rLabel(r).text.toLowerCase()}. Người ${gt} mệnh ${nh}. Tính cách và vận mệnh ở mức ${r}/5.`;
  return `${cn} ${rLabel(r).text.toLowerCase()}. Mệnh ${nh} ${r>=4?'hỗ trợ tốt':'cần chú ý'} cho cung này.`;
}

function calcTuVi({hoTen,gioiTinh,ngaySinh,thangSinh,namSinh,gioSinh,isLunar}) {
  const y=parseInt(namSinh),m=parseInt(thangSinh),d=parseInt(ngaySinh);
  const tc=TC[(y-4)%10], dc=DC[(y-4)%12], gi=(y-4)%12;
  const na=NA[(y-4)%60], nh=getNH(na);
  const gc=GCM[gioSinh]||{chi:'Tý',index:0};
  const seed=y*10000+m*100+d+gc.index*7+(gioiTinh==='nam'?1:0);
  const cungResults=CN.map((n,i)=>{
    const r=genRating(seed+i*13+7), lb=rLabel(r);
    return {name:n,icon:CI[i],rating:r,label:lb.text,labelColor:lb.color,interpretation:interp(n,r,gioiTinh,nh)};
  });
  const weak=cungResults.filter(c=>c.rating<=2).map(c=>c.name);
  const strong=cungResults.filter(c=>c.rating>=4).map(c=>c.name);
  const advice=[];
  const nha={'Kim':'Màu trắng, bạc. Hướng: Tây.','Thủy':'Màu đen, xanh dương. Hướng: Bắc.','Hỏa':'Màu đỏ, cam. Hướng: Nam.','Thổ':'Màu vàng, nâu. Hướng: Trung tâm.','Mộc':'Màu xanh lá. Hướng: Đông.'};
  advice.push(`Mệnh ${nh}: ${nha[nh]||''}`);
  if(strong.length) advice.push(`Phát huy: ${strong.join(', ')}.`);
  if(weak.length) advice.push(`Cải thiện: ${weak.join(', ')}.`);
  advice.push('Luôn giữ tâm tích cực, làm việc thiện.');
  const or=Math.round(cungResults.reduce((s,c)=>s+c.rating,0)/cungResults.length*10)/10;
  return {
    hoTen,gioiTinh,ngaySinh:d,thangSinh:m,namSinh:y,gioSinh,isLunar,
    canChi:`${tc} ${dc}`,thienCan:tc,diaChi:dc,
    conGiap:{name:DC[gi],emoji:EMO[gi],index:gi},
    napAm:na,nguHanh:nh,nguHanhColor:NHC[nh]||'#D4AF37',
    cuc:CM[nh]||{name:'N/A',value:0},gioChiName:gc.chi,
    cungResults,advice,overallRating:or,
  };
}

// ===== CONTROLLERS =====

/** POST /api/tuvi/calculate - Tính tử vi */
export const calculate = async (req, res, next) => {
  try {
    const { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem } = req.body;

    if (!hoTen || !gioiTinh || !ngaySinh || !thangSinh || !namSinh || !gioSinh)
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });

    // 1. Tính toán cơ bản
    const result = calcTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar });

    // 2. Lấy dữ liệu chi tiết từ Database
    // Tìm theo tên con giáp (ví dụ: "Tý", "Sửu"...)
    const db = await TuViDatabase.findOne();
    let detailed = null;
    if (db && db.con_giap) {
      detailed = db.con_giap.find(item => item.ten === result.conGiap.name);
    }

    // 3. Bổ sung thông tin từ database vào kết quả
    const finalResult = {
      ...result,
      namXem: namXem ? parseInt(namXem) : undefined,
      thangXem: thangXem ? parseInt(thangXem) : undefined,
      userId: req.user ? req.user._id : undefined,
      detailedAnalysis: detailed ? {
        sacThai: detailed.sac_thai,
        tinhCach: detailed.tinh_cach,
        diemManh: detailed.diem_manh,
        diemYeu: detailed.diem_yeu,
        suNghiep: detailed.su_nghiep,
        tinhCam: detailed.tinh_cam,
        sucKhoe: detailed.suc_khoe,
        taiLoc: detailed.tai_loc,
        namTot: detailed.nam_tot,
        thangTot: detailed.thang_tot,
        soMayMan: detailed.so_may_man,
        mauMayMan: detailed.mau_may_man,
        vanHan2026: detailed.van_han_nam_2026,
      } : null
    };

    const saved = await TuViResult.create(finalResult);

    res.status(200).json({ success: true, message: 'Tính toán thành công!', data: saved });
  } catch (e) { next(e); }
};

/** GET /api/tuvi/:id - Lấy kết quả */
export const getResult = async (req, res, next) => {
  try {
    const r=await TuViResult.findById(req.params.id);
    if(!r) return res.status(404).json({success:false,message:'Không tìm thấy.'});
    r.viewCount+=1; await r.save();
    res.status(200).json({success:true,data:r});
  } catch(e){next(e);}
};

/** GET /api/tuvi/history - Lịch sử user */
export const getHistory = async (req, res, next) => {
  try {
    const p=parseInt(req.query.page)||1, l=parseInt(req.query.limit)||10;
    const [results,total]=await Promise.all([
      TuViResult.find({userId:req.user._id}).sort({createdAt:-1}).skip((p-1)*l).limit(l).select('-cungResults -advice'),
      TuViResult.countDocuments({userId:req.user._id}),
    ]);
    res.status(200).json({success:true,data:results,pagination:{page:p,limit:l,total,totalPages:Math.ceil(total/l)}});
  } catch(e){next(e);}
};

/** DELETE /api/tuvi/:id - Xóa kết quả */
export const deleteResult = async (req, res, next) => {
  try {
    const r=await TuViResult.findOne({_id:req.params.id,userId:req.user._id});
    if(!r) return res.status(404).json({success:false,message:'Không tìm thấy.'});
    await r.deleteOne();
    res.status(200).json({success:true,message:'Đã xóa.'});
  } catch(e){next(e);}
};

/** GET /api/tuvi/stats - Thống kê (Admin) */
export const getStats = async (req, res, next) => {
  try {
    const [total,recent,topNH]=await Promise.all([
      TuViResult.countDocuments(),
      TuViResult.find().sort({createdAt:-1}).limit(5).select('hoTen nguHanh overallRating createdAt'),
      TuViResult.aggregate([{$group:{_id:'$nguHanh',count:{$sum:1}}},{$sort:{count:-1}}]),
    ]);
    res.status(200).json({success:true,data:{total,recent,topNH}});
  } catch(e){next(e);}
};
