const urls = [
  'https://tuvi-website-sigma.vercel.app/icons/01_logo_quan_tu_vi.png',
  'https://tuvi-website-sigma.vercel.app/icons/02_nav_lap_la_so_sun.png',
  'https://tuvi-website-sigma.vercel.app/icons/03_nav_phu_tu_vi_yinyang.png',
  'https://tuvi-website-sigma.vercel.app/icons/11_top_diem_diamond.png'
];

async function test() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`${url} -> status: ${res.status}, content-type: ${res.headers.get('content-type')}`);
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }
}

test();
