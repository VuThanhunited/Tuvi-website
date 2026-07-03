import { generateLaSo } from 'tuvi-neo';

const laso = generateLaSo({
  name: 'Nguyen Van A',
  gender: 'male',
  birth: {
    isLunar: false,
    year: 1990,
    month: 6,
    day: 15,
    hour: 12,
    minute: 0,
  },
});

console.log('Laso keys:', Object.keys(laso));
console.log('Laso Info:', laso.Info);
console.log('Cac cung keys:', Object.keys(laso.Cac_cung[0]));
console.log('Sample cell stars (Tý):', JSON.stringify(laso.Cac_cung[10], null, 2));
