const axios = require('axios');

const dot_ = ['._', '._', '_.', '_.', '._.', '_'];
const birthStone = {
  '01': ['Garnet'],
  '02': ['Amethyst'],
  '03': ['Aquamarine', 'Bloodstone', 'Coral'],
  '04': ['Diamond', 'Crystal'],
  '05': ['Emerald', 'Chrysoprase', 'Jade'],
  '06': ['Pearl', 'Moonstone', 'Alexandrite'],
  '07': ['Ruby', 'Carnelian'],
  '08': ['Peridot', 'Sardonyx', 'spinel'],
  '09': ['Sapphire', 'Lapis_Lazuli', 'Lolite'],
  '10': ['Opal', 'Tourmaline'],
  '11': ['Topaz', 'Citrine', 'Amber'],
  '12': ['Turquoise', 'Tanzanite', 'Zircon'],
}
const birthFlower = {
  '01': 'Narcissus',
  '02': 'Viola',
  '03': 'Narcissus',
  '04': 'SweetPea',
  '05': 'Majalis',
  '06': 'Lily',
  '07': 'Ranunculus',
  '08': 'Gladiolus',
  '09': 'Myosotis',
  '10': 'Calendula',
  '11': 'Asteraceae',
  '12': 'poinsettia',
}

async function run({ korName, initial, birthDay, nameMeaning=[] }) {
  
  const answerList = await Promise.all([
    hanja_hanja(korName, nameMeaning),
    birthStone_hanja(birthDay, korName, nameMeaning),
    birthFlower_hanja(birthDay, korName, nameMeaning),
    birthStone_birthFlower(birthDay),
    initial_hanja(korName, initial, nameMeaning),
  ]);

  return answerList;
}

// 한자 + 한자 조합
async function hanja_hanja(korName, nameMeaning=[]) {
  const n = randomNum(korName.length);

  if (!nameMeaning.length) {
    const answer = await extractMeaning(korName[n]) + dot_[randomNum(dot_.length)] + await extractMeaning(korName[n === korName.length - 1 ? 0 : n + 1]);
    return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), answer.replace(/[a-zA-Z._]/g, '')];


  } else if (nameMeaning.length >= 2) {
    const m = randomNum(nameMeaning.length);

    const answer = await translate(nameMeaning[m]) + dot_[randomNum(dot_.length)] + await translate(nameMeaning[m === nameMeaning.length - 1 ? 0 : m + 1]);
  
    return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), nameMeaning[m] + "," + nameMeaning[m === nameMeaning.length - 1 ? 0 : m + 1]];


  } else {
    const answer = await translate(nameMeaning[0]) + dot_[randomNum(dot_.length)] + await extractMeaning(korName[n]);

    return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), nameMeaning[0] + answer.replace(/[a-zA-Z._]/g, '')];
  }
}

// 탄생석 + 한자 조합
async function birthStone_hanja(birthDay, korName, nameMeaning=[]) {
  let answer = '';
  birthMonth = birthDay.slice(4, 6);
  const n = randomNum(korName.length);
  const m = randomNum(nameMeaning.length);
  const engWord = nameMeaning.length ? await translate(nameMeaning[m]) : await extractMeaning(korName[n]);

  if (randomNum(2)) {
    answer = engWord + dot_[randomNum(dot_.length)] + birthStone[birthMonth][randomNum(birthStone[birthMonth].length)];
  } else {
    answer = birthStone[birthMonth][randomNum(birthStone[birthMonth].length)] + dot_[randomNum(dot_.length)] + engWord;
  }

  return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), nameMeaning.length ? nameMeaning[m] : answer.replace(/[a-zA-Z._]/g, '')];
}

// 탄생화 + 한자 조합
async function birthFlower_hanja(birthDay, korName, nameMeaning=[]) {
  let answer = '';
  birthMonth = birthDay.slice(4, 6);
  const n = randomNum(korName.length);
  const m = randomNum(nameMeaning.length);

  const engWord = nameMeaning.length ? await translate(nameMeaning[m]) : await extractMeaning(korName[n]);

  if (randomNum(2)) {
    answer = engWord + dot_[randomNum(dot_.length)] + birthFlower[birthMonth];
  } else {
    answer = birthFlower[birthMonth] + dot_[randomNum(dot_.length)] + engWord;
  }

  return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), nameMeaning.length ? nameMeaning[m] : answer.replace(/[a-zA-Z._]/g, '')];
}

// 탄생석 + 탄생화 조합
async function birthStone_birthFlower(birthDay) {
  let answer = '';
  birthMonth = birthDay.slice(4, 6);

  if (randomNum(2)) {
    answer = birthStone[birthMonth][randomNum(birthStone[birthMonth].length)] + dot_[randomNum(dot_.length)] + birthFlower[birthMonth];
  } else {
    answer = birthFlower[birthMonth] + dot_[randomNum(dot_.length)] + birthStone[birthMonth][randomNum(birthStone[birthMonth].length)];
  }

  return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), answer.replace(/[a-zA-Z._]/g, '')];
}

async function initial_hanja(korName, initial, nameMeaning=[]) {
  const randomNumber = randomNum(korName.length);
  let useInitial = '';
  let answer = '';
  const n = randomNum(korName.length);
  const m = randomNum(nameMeaning.length);

  const engWord = nameMeaning.length ? await translate(nameMeaning[m]) : await extractMeaning(korName[n]);

  if (randomNumber === 0) {
    useInitial = initial[n];
  } else if (randomNumber === 1) {
    useInitial = initial.slice(1, 3);
  } else {
    useInitial = initial;
  }

  if (randomNum(2)) {
    answer = useInitial + dot_[randomNum(dot_.length)] + engWord;
  } else {
    answer = engWord + dot_[randomNum(dot_.length)] + useInitial;
  }

  return [answer.replace(/[ㄱ-ㅎ가-힣,\s]/g, ''), nameMeaning.length ? nameMeaning[m] : answer.replace(/[a-zA-Z._]/g, '')];
}

// random number
function randomNum(n) {
  return Math.floor(Math.random() * n);
}

async function extractMeaning(query) {
  const { data } = await axios.get(
    `https://hanja.dict.naver.com/api3/ccko/search?query=${stringToHex(query, '%')}&m=pc&range=all`,
    {
      headers: {
        referer: 'https://hanja.dict.naver.com/'
      },
    },
  );

  const words = data.searchResultMap.searchResultListMap.LETTER.items.map(e => e.expKoreanPron.replace(/<strong>/g, '').replace(/<\/strong>/g, '').replace(/\//g, ','));

  const a = []
  words.map(e => {
    if (e.includes(',')) {
      b = e.split(',')
      b.map(e => {
        if (e.includes(query))
          a.push(e.replace(/\([^\)]*\)/g, '').slice(0, -1));
      })
    } else {
      a.push(e.replace(/\([^\)]*\)/g, '').slice(0, -1));
    }
  })
  result = a.map(e => e.replace(/ /g, ''));

  const word = result[randomNum(result.length)];

  return [await translate(word), word + " " + query];
}

// Meaning to English
async function translate(query) {
  const { data } = await axios.get(
    `https://en.dict.naver.com/api3/enko/search?query=${stringToHex(query, '%')}&m=pc&range=word&page=1&lang=ko&shouldSearchOpen=false&hid=166047839252560420`,
    {
      headers: {
        referer: 'https://en.dict.naver.com/'
      },
    },
  );
  
  const dataValues = data.searchResultMap.searchResultListMap.WORD.items.map(e => e.meansCollector[0].means[0].value)

  const words = []
  dataValues.map(e => {
    if (e) {
      e.replace(/\([^\)]*\)/g, '')
      .replace(/\[[^\)]*\]/g, '')
      .replace(/[!'\s;\).-]*/g, '')
      .replace(/[ㄱ-ㅎ|가-힣]/g, '')
      .split(',').map(e => {
        if (e.length < 15 && e != '') {
          words.push(e);
        }
      })
    }
  })

  return words[randomNum(words.length)] ?? 'o';
}



// UTF8 to Hex
function stringToUTF8Bytes(str) {
  const result = [];

  if (!str) return result;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);

    if (c <= 0x7f) {
      result.push(c);
    } else if (c <= 0x07ff) {
      result.push(((c >> 6) & 0x1f) | 0xc0);
      result.push((c & 0x3f) | 0x80);
    } else {
      result.push(((c >> 12) & 0x0f) | 0xe0);
      result.push(((c >> 6) & 0x3f) | 0x80);
      result.push((c & 0x3f) | 0x80);
    }
  }

  return result;
}

function byteToHex(byteNum) {
  const digits = byteNum.toString(16);

  if (byteNum < 16) return `0${digits}`;
  return digits;
}

function bytesToHexString(bytes, join) {
  return `${join}${bytes
    .map((e) => byteToHex(e))
    .join(join)
    .toUpperCase()}`;
}

function stringToHex(str, join) {
  return bytesToHexString(stringToUTF8Bytes(str), join);
}

module.exports = {
  run : run,
}