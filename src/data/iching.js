// 64 I Ching Hexagrams (주역 64괘)
// lines: 6 lines bottom→top, values:
//   6=old yin (changing), 7=young yang, 8=young yin, 9=old yang (changing)

// ─── 팔괘 (8 Trigrams) ─────────────────────────────────────────────────────────
// Encoded as: yang(top)*4 + yang(mid)*2 + yang(bot)*1
// ☰=7, ☷=0, ☳=1, ☵=2, ☶=4, ☴=6, ☲=5, ☱=3
export const TRIGRAMS = {
  7: { name: 'Qian', kor: '건(乾)', symbol: '☰', element: '하늘', quality: '창조·강건', family: '아버지' },
  0: { name: 'Kun',  kor: '곤(坤)', symbol: '☷', element: '땅',   quality: '수용·유연', family: '어머니' },
  1: { name: 'Zhen', kor: '진(震)', symbol: '☳', element: '우레', quality: '각성·움직임', family: '장남' },
  2: { name: 'Kan',  kor: '감(坎)', symbol: '☵', element: '물',   quality: '위험·깊이', family: '차남' },
  4: { name: 'Gen',  kor: '간(艮)', symbol: '☶', element: '산',   quality: '멈춤·고요', family: '삼남' },
  6: { name: 'Xun',  kor: '손(巽)', symbol: '☴', element: '바람', quality: '부드러운 침투', family: '장녀' },
  5: { name: 'Li',   kor: '이(離)', symbol: '☲', element: '불',   quality: '밝음·의존', family: '차녀' },
  3: { name: 'Dui',  kor: '태(兌)', symbol: '☱', element: '연못', quality: '기쁨·개방', family: '삼녀' },
};

// ─── King Wen 순서 매핑 테이블 ────────────────────────────────────────────────
// key: '${upper}_${lower}' (trigram binary value), value: hexagram number (1-64)
// 버그 수정: 이전 parseInt(binary,2)%64+1 방식은 King Wen 순서와 다름
const KING_WEN = {
  '7_7':1,  '0_7':11, '1_7':34, '2_7':5,  '4_7':26, '6_7':9,  '5_7':14, '3_7':43,
  '7_0':12, '0_0':2,  '1_0':16, '2_0':8,  '4_0':23, '6_0':20, '5_0':35, '3_0':45,
  '7_1':25, '0_1':24, '1_1':51, '2_1':3,  '4_1':27, '6_1':42, '5_1':21, '3_1':17,
  '7_2':6,  '0_2':7,  '1_2':40, '2_2':29, '4_2':4,  '6_2':59, '5_2':64, '3_2':47,
  '7_4':33, '0_4':15, '1_4':62, '2_4':39, '4_4':52, '6_4':53, '5_4':56, '3_4':31,
  '7_6':44, '0_6':46, '1_6':32, '2_6':48, '4_6':18, '6_6':57, '5_6':50, '3_6':28,
  '7_5':13, '0_5':36, '1_5':55, '2_5':63, '4_5':22, '6_5':37, '5_5':30, '3_5':49,
  '7_3':10, '0_3':19, '1_3':54, '2_3':60, '4_3':41, '6_3':61, '5_3':38, '3_3':58,
};

export const HEXAGRAMS = [
  { number: 1, name: 'Qian', korName: '건(乾)', chinese: '乾', upper: 7, lower: 7,
    description: '하늘의 창조적 힘. 강한 추진력과 시작. 리더십과 야망.',
    advice: '창의적 힘을 믿어라. 지금은 강하게 나아갈 때다.',
    judgment: '크게 통하고 올바름이 이롭다. 창조적 힘이 가득하다.',
    image: '하늘이 끊임없이 운행한다. 멈추지 않는 자강불식.',
    shadow: '정상에서도 오만하면 반드시 후회가 온다. 교만을 경계하라.' },

  { number: 2, name: 'Kun', korName: '곤(坤)', chinese: '坤', upper: 0, lower: 0,
    description: '대지의 수용적 힘. 부드럽고 인내하며 키우는 힘.',
    advice: '적극적으로 이끌기보다 수용하고 지원하는 역할을 맡아라.',
    judgment: '암말처럼 유순하게 따를 때 크게 이롭다. 남보다 앞서지 마라.',
    image: '땅의 형세가 순하다. 두터운 덕으로 만물을 싣는다.',
    shadow: '수동성이 지나치면 기회를 놓친다. 따르되 무력해지지 마라.' },

  { number: 3, name: 'Zhun', korName: '둔(屯)', chinese: '屯', upper: 2, lower: 1,
    description: '어려운 시작. 혼돈 속에서 싹이 트려는 시도.',
    advice: '초기의 어려움은 자연스럽다. 인내하면 길이 열린다.',
    judgment: '크게 통하고 올바름이 이롭다. 가는 곳이 없어야 하며 제후를 세우는 것이 이롭다.',
    image: '구름과 우레. 군자는 경영으로 질서를 세운다.',
    shadow: '혼자 해결하려다 더 얽힌다. 지금은 홀로 나서지 마라.' },

  { number: 4, name: 'Meng', korName: '몽(蒙)', chinese: '蒙', upper: 4, lower: 2,
    description: '어리고 무지한 상태. 배움과 안내의 필요.',
    advice: '모르는 것을 인정하고 가르침을 구하라.',
    judgment: '내가 동몽을 구하는 것이 아니라 동몽이 나를 구해야 한다. 배우는 자세가 우선.',
    image: '산 아래 샘물이 솟는다. 군자는 과감한 행동으로 덕을 기른다.',
    shadow: '아는 척하거나 배움을 거부하면 오래도록 어둠 속에 머문다.' },

  { number: 5, name: 'Xu', korName: '수(需)', chinese: '需', upper: 2, lower: 7,
    description: '기다림. 올바른 시기를 기다리는 인내.',
    advice: '억지로 밀어붙이지 마라. 때를 기다려야 한다.',
    judgment: '진실하게 믿으면 크게 통한다. 올바르게 기다리면 길하다.',
    image: '구름이 하늘 위에 있다. 군자는 마시고 먹으며 연회를 즐긴다.',
    shadow: '마냥 기다리는 것도 문제다. 준비 없는 기다림은 나태일 뿐이다.' },

  { number: 6, name: 'Song', korName: '송(訟)', chinese: '訟', upper: 7, lower: 2,
    description: '갈등과 분쟁. 맞서는 힘들 간의 긴장.',
    advice: '직접 대결을 피하고 타협점을 찾아라.',
    judgment: '진실이 있어도 막히게 된다. 중간에 멈추면 길하고 끝까지 가면 흉하다.',
    image: '하늘과 물이 어긋나게 움직인다. 일을 시작할 때 먼저 도모하라.',
    shadow: '소송에서 이겨도 관계는 망가진다. 이기려는 집착이 더 큰 것을 잃게 한다.' },

  { number: 7, name: 'Shi', korName: '사(師)', chinese: '師', upper: 0, lower: 2,
    description: '군대와 규율. 조직된 힘과 리더십.',
    advice: '강한 리더십과 규율로 집단을 이끌어라.',
    judgment: '올바른 지도자가 있어야 한다. 그래야 허물이 없고 길하다.',
    image: '땅 속에 물이 있다. 군자는 백성을 품어 무리를 기른다.',
    shadow: '힘만 있고 정당성이 없으면 반란을 부른다. 명분을 먼저 세워라.' },

  { number: 8, name: 'Bi', korName: '비(比)', chinese: '比', upper: 2, lower: 0,
    description: '연대와 화합. 함께하는 힘.',
    advice: '진정한 연대를 추구하라. 혼자보다 함께가 강하다.',
    judgment: '길하다. 다시 점쳐도 올바름이 이롭다. 뒤늦게 오는 자는 흉하다.',
    image: '땅 위에 물이 있다. 선왕은 모든 나라를 세워 제후들과 친하게 지냈다.',
    shadow: '이익만 보고 모인 연대는 금방 흩어진다. 진심 없는 결합을 경계하라.' },

  { number: 9, name: 'Xiao Xu', korName: '소축(小畜)', chinese: '小畜', upper: 6, lower: 7,
    description: '작은 억제. 일시적 지연과 축적.',
    advice: '지금은 큰 행동보다 작은 준비를 축적하는 시기.',
    judgment: '통하되 짙은 구름이 있어도 비가 내리지 않는다. 지금은 조금 멈춰야 한다.',
    image: '바람이 하늘 위에 분다. 군자는 문덕을 아름답게 닦는다.',
    shadow: '작은 억제에 조급해하지 마라. 기다림을 거부하면 더 크게 막힌다.' },

  { number: 10, name: 'Lu', korName: '리(履)', chinese: '履', upper: 7, lower: 3,
    description: '조심스러운 행동. 위험한 곳을 밟는 것.',
    advice: '신중하게 행동하라. 발걸음을 확인하며 나아가라.',
    judgment: '호랑이 꼬리를 밟아도 물지 않는다. 통한다.',
    image: '하늘 위에 연못이 있다. 군자는 상하를 분별하여 백성의 뜻을 정한다.',
    shadow: '지나친 조심이 아무것도 못 하게 한다. 겁에 질리지 말고 나아가라.' },

  { number: 11, name: 'Tai', korName: '태(泰)', chinese: '泰', upper: 0, lower: 7,
    description: '평화와 번영. 하늘과 땅의 조화.',
    advice: '좋은 시기다. 화합을 유지하며 발전시켜라.',
    judgment: '작은 것이 가고 큰 것이 온다. 길하고 통한다.',
    image: '하늘과 땅이 교류한다. 군자는 천지의 도를 돕고 좌우를 보필한다.',
    shadow: '번영이 영원하지 않다. 좋은 때일수록 준비를 게을리 마라.' },

  { number: 12, name: 'Pi', korName: '비(否)', chinese: '否', upper: 7, lower: 0,
    description: '막힘과 정체. 하늘과 땅이 어긋남.',
    advice: '어려운 시기다. 무리하지 말고 본질을 지켜라.',
    judgment: '군자의 올바름이 이롭지 않다. 큰 것이 가고 작은 것이 온다.',
    image: '하늘과 땅이 교류하지 않는다. 군자는 검약으로 난을 피한다.',
    shadow: '막혔다고 포기하지 마라. 어두운 시기는 반드시 지나간다.' },

  { number: 13, name: 'Tong Ren', korName: '동인(同人)', chinese: '同人', upper: 7, lower: 5,
    description: '사람들과의 연대. 공통의 목적.',
    advice: '같은 뜻을 가진 사람들과 함께하라.',
    judgment: '들판에서 사람들과 함께하면 통한다. 큰 강을 건너는 것이 이롭다.',
    image: '하늘과 함께 불이 있다. 군자는 종류로 구분하고 사물을 분별한다.',
    shadow: '작은 무리끼리만 모이면 진정한 연대가 아니다. 편 가르기를 경계하라.' },

  { number: 14, name: 'Da You', korName: '대유(大有)', chinese: '大有', upper: 5, lower: 7,
    description: '큰 풍요. 넘치는 자원과 성공.',
    advice: '풍요를 넓게 나누고 겸손함을 잃지 마라.',
    judgment: '크게 통한다. 덕이 있고 나누는 자에게 풍요가 온다.',
    image: '불이 하늘 위에 있다. 군자는 악을 막고 선을 드높여 하늘의 뜻에 따른다.',
    shadow: '큰 것을 가진 자는 더 크게 잃을 수 있다. 자만이 가장 큰 위험이다.' },

  { number: 15, name: 'Qian', korName: '겸(謙)', chinese: '謙', upper: 0, lower: 4,
    description: '겸손. 낮은 곳에서 높이 오르는 힘.',
    advice: '겸손함이 진정한 힘이다. 낮추면 높아진다.',
    judgment: '통한다. 군자는 끝마침이 있다.',
    image: '산이 땅 속에 있다. 군자는 많은 것을 줄이고 적은 것을 더하여 고르게 한다.',
    shadow: '가짜 겸손인 비굴함과 혼동하지 마라. 진정한 겸손은 자기 가치를 안다.' },

  { number: 16, name: 'Yu', korName: '예(豫)', chinese: '豫', upper: 1, lower: 0,
    description: '열정과 기쁨. 움직임을 일으키는 활기.',
    advice: '열정적으로 행동하되 자만하지 마라.',
    judgment: '제후를 세우고 군사를 움직이는 것이 이롭다.',
    image: '우레가 땅에서 나온다. 선왕은 음악을 지어 덕을 숭상했다.',
    shadow: '지나친 열락은 방탕이 된다. 기쁨도 절제가 필요하다.' },

  { number: 17, name: 'Sui', korName: '수(隨)', chinese: '隨', upper: 3, lower: 1,
    description: '따름과 적응. 흐름에 맞추는 유연성.',
    advice: '때의 흐름을 따라라. 억지로 거스르지 마라.',
    judgment: '크게 통하고 올바름이 이롭다. 허물이 없다.',
    image: '연못 속에 우레가 있다. 군자는 해질 무렵 집에 들어가 쉰다.',
    shadow: '무조건 따르는 것은 자아를 잃는다. 흐름을 따르되 자기를 잃지 마라.' },

  { number: 18, name: 'Gu', korName: '고(蠱)', chinese: '蠱', upper: 4, lower: 6,
    description: '부패와 바로잡음. 오래된 문제 수정.',
    advice: '썩은 것을 정면으로 마주하고 바로잡아야 할 때.',
    judgment: '크게 통한다. 큰 강을 건너는 것이 이롭다. 시작 사흘, 끝 사흘.',
    image: '산 아래 바람이 분다. 군자는 백성을 진작시키고 덕을 기른다.',
    shadow: '오래된 상처일수록 건드리기 두렵다. 하지만 방치하면 더 썩는다.' },

  { number: 19, name: 'Lin', korName: '림(臨)', chinese: '臨', upper: 0, lower: 3,
    description: '다가옴. 성장하는 힘과 기회.',
    advice: '좋은 기회가 오고 있다. 준비하라.',
    judgment: '크게 통하고 올바름이 이롭다. 팔월에는 흉함이 있다.',
    image: '연못 위에 땅이 있다. 군자는 가르침을 그치지 않고 백성을 보호한다.',
    shadow: '기회는 영원하지 않다. 흘러가기 전에 잡아야 한다.' },

  { number: 20, name: 'Guan', korName: '관(觀)', chinese: '觀', upper: 6, lower: 0,
    description: '관찰과 성찰. 전체를 바라보는 시각.',
    advice: '행동하기 전에 충분히 관찰하고 이해하라.',
    judgment: '손을 씻고 아직 제물을 올리지 않은 것처럼. 믿음이 있어 우러러본다.',
    image: '바람이 땅 위에 분다. 선왕은 지방을 순시하여 백성을 살폈다.',
    shadow: '너무 오래 관찰만 하면 기회를 놓친다. 보는 것과 행동하는 것 사이의 균형.' },

  { number: 21, name: 'Shi He', korName: '서합(噬嗑)', chinese: '噬嗑', upper: 5, lower: 1,
    description: '장애를 씹어 없앰. 결단력 있는 행동.',
    advice: '장애물을 과감하게 제거해야 전진할 수 있다.',
    judgment: '통한다. 형벌을 쓰는 것이 이롭다.',
    image: '우레와 번개가 합쳐진다. 선왕은 형벌을 밝혀 법률을 적용했다.',
    shadow: '너무 강하게 씹으면 자신도 다친다. 힘을 쓸 때는 정확하게.' },

  { number: 22, name: 'Bi', korName: '비(賁)', chinese: '賁', upper: 4, lower: 5,
    description: '꾸밈과 아름다움. 형식과 내용의 조화.',
    advice: '겉치레보다 실질을 중시하되, 형식의 가치도 인정하라.',
    judgment: '통한다. 소소한 일에는 가는 것이 이롭다.',
    image: '산 아래 불이 있다. 군자는 정치를 밝히되 형벌 쓰기를 감히 하지 않는다.',
    shadow: '아름다움에 집착하면 본질을 잃는다. 껍데기가 알맹이를 이겨선 안 된다.' },

  { number: 23, name: 'Bo', korName: '박(剝)', chinese: '剝', upper: 4, lower: 0,
    description: '박탈과 쇠퇴. 껍질이 벗겨지는 과정.',
    advice: '잃어가는 것을 억지로 붙잡지 마라. 때가 되면 새것이 온다.',
    judgment: '가는 것이 이롭지 않다.',
    image: '산이 땅에 붙어 있다. 위는 두텁게 아래를 안정시킨다.',
    shadow: '모든 것이 무너질 것 같아도 핵심 하나는 남는다. 그것을 지켜라.' },

  { number: 24, name: 'Fu', korName: '복(復)', chinese: '復', upper: 0, lower: 1,
    description: '귀환과 회복. 한 사이클이 돌아옴.',
    advice: '돌아오는 빛을 맞이하라. 새로운 시작이 가능하다.',
    judgment: '통한다. 출입에 허물이 없다. 7일 만에 돌아온다.',
    image: '우레가 땅 속에 있다. 선왕은 동지에 관문을 닫았다.',
    shadow: '돌아와도 같은 실수를 반복하면 의미없다. 무엇이 달라졌는지 확인하라.' },

  { number: 25, name: 'Wu Wang', korName: '무망(無妄)', chinese: '無妄', upper: 7, lower: 1,
    description: '순수한 의도. 자연스러운 행동.',
    advice: '계산 없이 순수하게 행동하라. 자연의 흐름을 따르라.',
    judgment: '크게 통하고 올바름이 이롭다. 바르지 않으면 재앙이 있다.',
    image: '하늘 아래 우레가 있다. 선왕은 계절에 맞게 만물을 길렀다.',
    shadow: '순수함을 가장한 무관심은 다른 이름의 무책임이다.' },

  { number: 26, name: 'Da Xu', korName: '대축(大畜)', chinese: '大畜', upper: 4, lower: 7,
    description: '큰 축적. 잠재력의 저장.',
    advice: '큰 힘을 쌓고 있다. 올바른 시기에 쓸 수 있도록 준비하라.',
    judgment: '올바름이 이롭다. 집에서 먹지 않으면 길하다. 큰 강을 건너는 것이 이롭다.',
    image: '산 속에 하늘이 있다. 군자는 옛 말과 행적으로 덕을 기른다.',
    shadow: '쌓기만 하고 쓰지 않으면 결국 부패한다. 멈추는 것도 용기다.' },

  { number: 27, name: 'Yi', korName: '이(頤)', chinese: '頤', upper: 4, lower: 1,
    description: '영양공급. 먹이고 키우는 것.',
    advice: '몸과 마음에 올바른 양식을 줘라. 무엇을 소비하는지 주의하라.',
    judgment: '올바름이 길하다. 스스로 먹을 것을 구하는 것을 관찰하라.',
    image: '산 아래 우레가 있다. 군자는 말을 삼가고 음식과 음료를 절제한다.',
    shadow: '나쁜 것으로 자신을 먹이면 나쁜 것이 자란다. 입으로 들어가는 것을 살펴라.' },

  { number: 28, name: 'Da Guo', korName: '대과(大過)', chinese: '大過', upper: 3, lower: 6,
    description: '과도한 무게. 무너지는 대들보.',
    advice: '과부하 상태다. 무언가를 내려놓아야 버틸 수 있다.',
    judgment: '대들보가 휜다. 가는 것이 이롭다. 통한다.',
    image: '연못이 나무를 가린다. 군자는 홀로 서서 두려움이 없고 세상을 피해도 근심이 없다.',
    shadow: '혼자 모든 것을 지탱하려다 부러진다. 도움 요청이 항복이 아니다.' },

  { number: 29, name: 'Kan', korName: '감(坎)', chinese: '坎', upper: 2, lower: 2,
    description: '위험한 심연. 물처럼 흐르는 위기.',
    advice: '위험 속에서도 내면의 중심을 잃지 마라.',
    judgment: '진실하게 믿으면 마음이 통한다. 행동하면 높이 받들어진다.',
    image: '물이 거듭 온다. 군자는 항상 덕행을 익히고 가르치는 것을 반복한다.',
    shadow: '깊은 물에 들어갈 때 얕다고 방심하지 마라. 위험은 과소평가에서 온다.' },

  { number: 30, name: 'Li', korName: '리(離)', chinese: '離', upper: 5, lower: 5,
    description: '불꽃과 빛. 의존과 명확함.',
    advice: '빛을 발하되 무언가에 의존해야 한다는 것을 받아들여라.',
    judgment: '올바름이 이롭다. 통한다. 암소를 기르면 길하다.',
    image: '밝음이 두 번 겹친다. 대인은 계속 밝힘으로 사방을 비춘다.',
    shadow: '너무 강하게 타면 빨리 꺼진다. 밝음도 지속하려면 조절이 필요하다.' },

  { number: 31, name: 'Xian', korName: '함(咸)', chinese: '咸', upper: 3, lower: 4,
    description: '상호 영향. 서로에게 끌리는 힘.',
    advice: '감정과 직관을 신뢰하라. 진정한 연결은 상호적이다.',
    judgment: '통한다. 올바름이 이롭다. 여자를 취하면 길하다.',
    image: '산 위에 연못이 있다. 군자는 마음을 비워 사람들을 받아들인다.',
    shadow: '이끌림이 강할수록 분별이 필요하다. 감정에 휩쓸리면 판단이 흐려진다.' },

  { number: 32, name: 'Heng', korName: '항(恒)', chinese: '恒', upper: 1, lower: 6,
    description: '지속과 인내. 변함없이 계속하는 것.',
    advice: '꾸준함이 핵심이다. 일관성 있게 지속하라.',
    judgment: '통한다. 허물이 없다. 올바름이 이롭다. 가는 것이 이롭다.',
    image: '우레와 바람. 군자는 서 있을 방향을 바꾸지 않는다.',
    shadow: '변해야 할 때 변하지 않는 것도 완고함이다. 항구함과 경직됨을 구별하라.' },

  { number: 33, name: 'Dun', korName: '둔(遯)', chinese: '遯', upper: 7, lower: 4,
    description: '퇴각과 물러남. 전략적 후퇴.',
    advice: '지금은 물러나는 것이 지혜다. 맞서지 말고 거리를 둬라.',
    judgment: '통한다. 소소한 것에서 올바름이 이롭다.',
    image: '하늘 아래 산이 있다. 군자는 소인을 멀리하되 엄하지 않고 위엄있게 한다.',
    shadow: '도망과 전략적 퇴각을 혼동하지 마라. 물러날 때도 품위가 있어야 한다.' },

  { number: 34, name: 'Da Zhuang', korName: '대장(大壯)', chinese: '大壯', upper: 1, lower: 7,
    description: '강대한 힘. 넘치는 에너지.',
    advice: '강한 힘이 있지만 분별력 없이 쓰면 역효과다.',
    judgment: '올바름이 이롭다.',
    image: '우레가 하늘 위에 있다. 군자는 예(禮)가 아니면 밟지 않는다.',
    shadow: '힘이 넘쳐도 목표가 없으면 낭비다. 강함은 올바른 방향이 있을 때 빛난다.' },

  { number: 35, name: 'Jin', korName: '진(晉)', chinese: '晉', upper: 5, lower: 0,
    description: '전진과 발전. 해가 떠오름.',
    advice: '밝고 빠른 발전의 때다. 자신감을 가지고 나아가라.',
    judgment: '강후가 말을 많이 하사받고 낮에 세 번 접견받는다.',
    image: '밝음이 땅 위에 나타난다. 군자는 스스로를 밝혀 덕을 빛낸다.',
    shadow: '너무 빠른 상승은 견고한 기반 없이 위태롭다. 속도보다 방향을 점검하라.' },

  { number: 36, name: 'Ming Yi', korName: '명이(明夷)', chinese: '明夷', upper: 0, lower: 5,
    description: '빛이 꺼짐. 어두운 시기.',
    advice: '어두운 시기다. 내면의 빛을 숨기고 지혜롭게 참아라.',
    judgment: '어려움에서 올바름이 이롭다.',
    image: '밝음이 땅 속에 들어간다. 군자는 뭇사람을 대하며 어두움을 써서 밝힌다.',
    shadow: '숨어야 할 때 드러내려 하면 더 큰 화를 부른다. 때를 읽어라.' },

  { number: 37, name: 'Jia Ren', korName: '가인(家人)', chinese: '家人', upper: 6, lower: 5,
    description: '가족과 공동체. 내부의 질서.',
    advice: '가까운 관계를 돌봐라. 집에서부터 질서를 세워라.',
    judgment: '여자의 올바름이 이롭다.',
    image: '바람이 불에서 나온다. 군자는 말에 실질이 있게 하고 행동에 항상성이 있게 한다.',
    shadow: '내부 질서가 지나치게 경직되면 숨막힌다. 규율과 유연함의 균형이 필요하다.' },

  { number: 38, name: 'Kui', korName: '규(睽)', chinese: '睽', upper: 5, lower: 3,
    description: '불일치와 대립. 다름 속에서의 보완.',
    advice: '대립하는 것들이 서로를 보완할 수 있다. 차이를 존중하라.',
    judgment: '소소한 것에서 길하다.',
    image: '위에 불, 아래 연못. 군자는 같음 속에서 다름을 인식한다.',
    shadow: '차이를 적대로 보면 영원히 분리된다. 다름이 약점이 아닌 강점임을 기억하라.' },

  { number: 39, name: 'Jian', korName: '건(蹇)', chinese: '蹇', upper: 2, lower: 4,
    description: '장애와 어려움. 불구가 된 발걸음.',
    advice: '앞에 장애가 있다. 억지로 밀어붙이지 말고 도움을 구하라.',
    judgment: '서남쪽이 이롭고 동북쪽은 이롭지 않다. 대인을 보는 것이 이롭다.',
    image: '산 위에 물이 있다. 군자는 자신을 돌이켜 덕을 닦는다.',
    shadow: '장애를 탓하기 전에 자신을 먼저 살펴라. 문제는 때로 내 안에 있다.' },

  { number: 40, name: 'Jie', korName: '해(解)', chinese: '解', upper: 1, lower: 2,
    description: '해방과 릴리즈. 긴장이 풀림.',
    advice: '긴장이 풀리고 있다. 빨리 움직여 기회를 잡아라.',
    judgment: '서남쪽이 이롭다. 가는 곳이 없으면 돌아오는 것이 길하다.',
    image: '우레와 비. 군자는 허물을 용서하고 죄를 사면한다.',
    shadow: '해방이 왔다고 방심하면 안 된다. 긴장이 풀리는 순간이 새로운 시작이다.' },

  { number: 41, name: 'Sun', korName: '손(損)', chinese: '損', upper: 4, lower: 3,
    description: '감소와 내려놓음. 줄임으로써 얻음.',
    advice: '줄이는 것이 때로는 더 크게 얻는 방법이다.',
    judgment: '진실하면 크게 길하고 허물이 없다. 올바름이 이롭다.',
    image: '산 아래 연못이 있다. 군자는 분노를 억누르고 욕심을 막는다.',
    shadow: '덜어내는 것이 항상 손해는 아니다. 무거운 짐을 내려야 더 빨리 간다.' },

  { number: 42, name: 'Yi', korName: '익(益)', chinese: '益', upper: 6, lower: 1,
    description: '증가와 이익. 풍요로워짐.',
    advice: '좋은 때다. 적극적으로 행동하면 이익이 된다.',
    judgment: '가는 것이 이롭다. 큰 강을 건너는 것이 이롭다.',
    image: '바람과 우레. 군자는 선함을 보면 따르고 허물이 있으면 고친다.',
    shadow: '이익을 위해 타인을 해치면 결국 더 크게 잃는다. 이익은 나눌 때 커진다.' },

  { number: 43, name: 'Guai', korName: '쾌(夬)', chinese: '夬', upper: 3, lower: 7,
    description: '결단과 돌파. 단호한 행동.',
    advice: '결단해야 할 시간이다. 단호하게 행동하라.',
    judgment: '왕정에서 드러낸다. 진실하게 알리고 위태로움이 있다.',
    image: '연못이 하늘 위에 있다. 군자는 록(祿)을 베풀고 덕에 거한다.',
    shadow: '단호함이 무모함이 되지 않도록. 결단 전에 충분히 고려하라.' },

  { number: 44, name: 'Gou', korName: '구(姤)', chinese: '姤', upper: 7, lower: 6,
    description: '우연한 만남. 예상치 못한 영향.',
    advice: '우연한 만남이나 유혹에 주의하라. 영향력을 조심해라.',
    judgment: '여자가 강하다. 충동적인 결합을 조심하라.',
    image: '하늘 아래 바람이 분다. 군주는 명을 내려 사방에 알린다.',
    shadow: '우연처럼 보이는 것도 원인이 있다. 매력적인 것일수록 더 살펴봐야 한다.' },

  { number: 45, name: 'Cui', korName: '취(萃)', chinese: '萃', upper: 3, lower: 0,
    description: '모임과 집결. 함께 모이는 힘.',
    advice: '뜻을 함께하는 사람들을 모아라. 결집이 힘이다.',
    judgment: '통한다. 왕이 사당에 이른다. 대인을 보는 것이 이롭다.',
    image: '연못이 땅 위에 있다. 군자는 병기를 정비하고 예상치 못한 일을 경계한다.',
    shadow: '모임 자체가 목적이 되어선 안 된다. 왜 모이는지 목적이 분명해야 한다.' },

  { number: 46, name: 'Sheng', korName: '승(升)', chinese: '升', upper: 0, lower: 6,
    description: '상승과 성장. 위로 올라감.',
    advice: '점진적으로 올라가고 있다. 꾸준히 노력하면 된다.',
    judgment: '크게 통한다. 대인을 보는 것이 이롭다. 남쪽으로 가면 길하다.',
    image: '땅 속에서 나무가 자란다. 군자는 덕에 따르고 작은 것을 쌓아 높고 크게 한다.',
    shadow: '급히 오르면 금방 떨어진다. 기반 없는 상승은 오래가지 않는다.' },

  { number: 47, name: 'Kun', korName: '곤(困)', chinese: '困', upper: 3, lower: 2,
    description: '고갈과 억눌림. 힘든 상황에서의 인내.',
    advice: '고난 속에서도 정신을 잃지 마라. 이것도 지나간다.',
    judgment: '통한다. 올바름이 이롭다. 대인이면 길하다. 허물이 없다.',
    image: '연못에 물이 없다. 군자는 뜻을 다하여 즐거움을 추구한다.',
    shadow: '고통 속에서 자포자기하면 진짜 끝이 된다. 버티는 것이 이미 승리다.' },

  { number: 48, name: 'Jing', korName: '정(井)', chinese: '井', upper: 2, lower: 6,
    description: '우물과 원천. 변함없는 자원.',
    advice: '내면의 깊은 원천에 접속하라. 본질을 잃지 마라.',
    judgment: '마을이 바뀌어도 우물은 바뀌지 않는다. 두레박 줄이 짧으면 닿지 못한다.',
    image: '나무 위에 물이 있다. 군자는 백성을 위로하고 서로 돕도록 권한다.',
    shadow: '좋은 원천이 있어도 끌어올리지 않으면 무용지물이다. 잠재력을 사용하라.' },

  { number: 49, name: 'Ge', korName: '혁(革)', chinese: '革', upper: 3, lower: 5,
    description: '혁명과 변화. 구 패러다임의 교체.',
    advice: '변화의 때가 왔다. 과감하게 낡은 것을 버려라.',
    judgment: '이미 지난 날에 믿게 된다. 크게 통하고 올바름이 이롭다.',
    image: '연못 속에 불이 있다. 군자는 역법을 밝혀 계절을 분명히 한다.',
    shadow: '변화를 위한 변화는 혼란만 낳는다. 무엇을 왜 바꾸는지 명확히 하라.' },

  { number: 50, name: 'Ding', korName: '정(鼎)', chinese: '鼎', upper: 5, lower: 6,
    description: '솥과 변환. 원료를 완성된 것으로 변환.',
    advice: '지금 가진 것으로 가치 있는 것을 만들어라.',
    judgment: '크게 길하고 통한다.',
    image: '나무 위에 불이 있다. 군자는 지위를 바로 하고 명을 공고히 한다.',
    shadow: '좋은 재료도 요리사가 없으면 음식이 안 된다. 능력과 도구를 갖춰라.' },

  { number: 51, name: 'Zhen', korName: '진(震)', chinese: '震', upper: 1, lower: 1,
    description: '천둥과 각성. 충격으로 인한 각성.',
    advice: '충격이 왔어도 두려워하지 마라. 이 충격이 각성을 준다.',
    judgment: '진이여, 통한다. 우레가 오면 두려움에 떨고 웃음소리가 퍼진다.',
    image: '우레가 거듭 온다. 군자는 두려움과 성찰로 자신을 수련한다.',
    shadow: '충격에 무너지면 아무것도 배우지 못한다. 흔들려도 뿌리를 잡아라.' },

  { number: 52, name: 'Gen', korName: '간(艮)', chinese: '艮', upper: 4, lower: 4,
    description: '산과 멈춤. 고요함과 명상.',
    advice: '멈춰라. 지금은 행동이 아니라 고요한 명상이 필요하다.',
    judgment: '등에서 멈추니 몸을 얻지 못한다. 뜰에 가서도 사람을 보지 못한다.',
    image: '겹친 산. 군자는 생각이 그 지위를 벗어나지 않는다.',
    shadow: '지나친 정지는 무기력이다. 멈춤과 침체를 구별하라.' },

  { number: 53, name: 'Jian', korName: '점(漸)', chinese: '漸', upper: 6, lower: 4,
    description: '점진적 발전. 천천히 자라는 것.',
    advice: '서두르지 마라. 점진적이고 올바른 발전이 가장 오래간다.',
    judgment: '여자가 시집가면 길하다. 올바름이 이롭다.',
    image: '산 위에 나무가 있다. 군자는 현명하고 덕이 있는 데 거한다.',
    shadow: '너무 천천히 가면 기회를 놓친다. 점진과 침체를 혼동하지 마라.' },

  { number: 54, name: 'Gui Mei', korName: '귀매(歸妹)', chinese: '歸妹', upper: 1, lower: 3,
    description: '서두른 결합. 부적절한 관계.',
    advice: '충동적인 결정을 주의하라. 입장을 잘 파악하고 행동해라.',
    judgment: '가면 흉하다. 이로운 것이 없다.',
    image: '우레 위에 연못이 있다. 군자는 결말을 알고 영원한 것과 결함을 안다.',
    shadow: '서두름에서 맺어진 관계는 서두름으로 끝난다. 천천히 확인하라.' },

  { number: 55, name: 'Feng', korName: '풍(豐)', chinese: '豐', upper: 1, lower: 5,
    description: '풍요와 절정. 최고조에 달한 힘.',
    advice: '풍요의 절정이다. 이 순간을 즐기되 절정은 언제나 지나간다.',
    judgment: '통한다. 왕이 이런다. 근심하지 마라. 해가 중천에 있을 때가 마땅하다.',
    image: '우레와 번개가 함께 온다. 군자는 형벌을 결단하고 형집행을 행한다.',
    shadow: '절정을 유지하려다 에너지를 소진한다. 차고 기우는 것이 자연의 이치다.' },

  { number: 56, name: 'Lu', korName: '여(旅)', chinese: '旅', upper: 5, lower: 4,
    description: '여행자. 낯선 곳에서의 이방인.',
    advice: '잠시 머무는 곳에서는 겸손하게 처신하라.',
    judgment: '소소한 것에서 통한다. 여행자는 올바름이 길하다.',
    image: '산 위에 불이 있다. 군자는 신중하게 형벌을 쓰고 소송을 오래 끌지 않는다.',
    shadow: '이방인처럼 떠도는 삶에서도 뿌리를 잃지 마라. 어디서든 자신을 지켜라.' },

  { number: 57, name: 'Xun', korName: '손(巽)', chinese: '巽', upper: 6, lower: 6,
    description: '바람과 부드러운 침투. 유연한 영향력.',
    advice: '부드럽게 스며들어라. 강한 바람보다 꾸준한 바람이 더 멀리 간다.',
    judgment: '소소한 것에서 통한다. 가는 것이 이롭고 대인을 보는 것이 이롭다.',
    image: '바람이 바람을 따른다. 군자는 명을 거듭 펼쳐 일을 행한다.',
    shadow: '너무 유연하면 방향을 잃는다. 부드러움 속에도 중심이 있어야 한다.' },

  { number: 58, name: 'Dui', korName: '태(兌)', chinese: '兌', upper: 3, lower: 3,
    description: '기쁨과 즐거움. 열린 마음.',
    advice: '진정한 기쁨을 나눠라. 기쁨은 줄수록 커진다.',
    judgment: '통한다. 올바름이 이롭다.',
    image: '연못이 겹쳐 있다. 군자는 벗과 함께 학문을 강론한다.',
    shadow: '기쁨이 탐닉이 되면 독이 된다. 즐거움도 절제가 있어야 지속된다.' },

  { number: 59, name: 'Huan', korName: '환(渙)', chinese: '渙', upper: 6, lower: 2,
    description: '분산과 융해. 경직된 것이 녹아냄.',
    advice: '딱딱한 벽을 녹여라. 개방과 소통이 해결책이다.',
    judgment: '통한다. 왕이 사당에 이른다. 큰 강을 건너는 것이 이롭다.',
    image: '바람이 물 위에 분다. 선왕은 제사를 올려 상제에게 제를 드렸다.',
    shadow: '모든 것을 흩으면 결속력을 잃는다. 유연함과 무질서는 다르다.' },

  { number: 60, name: 'Jie', korName: '절(節)', chinese: '節', upper: 2, lower: 3,
    description: '제한과 절제. 적절한 한계.',
    advice: '적절한 한계를 설정하라. 절제가 지속 가능하게 한다.',
    judgment: '통한다. 고통스러운 절제는 올바르지 않다.',
    image: '연못 위에 물이 있다. 군자는 수와 도를 제정하여 덕행을 의논한다.',
    shadow: '제한이 너무 엄격하면 삶이 질식한다. 절제도 인간적이어야 한다.' },

  { number: 61, name: 'Zhong Fu', korName: '중부(中孚)', chinese: '中孚', upper: 6, lower: 3,
    description: '내면의 진실. 깊은 신뢰.',
    advice: '진심어린 신뢰가 다른 사람을 감동시킨다. 내면을 진실되게.',
    judgment: '돼지와 물고기도 길하다. 큰 강을 건너는 것이 이롭다.',
    image: '바람이 연못 위에 있다. 군자는 형벌을 의논하여 사형을 늦춘다.',
    shadow: '믿음이 맹신이 되면 위험하다. 진실한 신뢰도 비판적 사고와 함께해야 한다.' },

  { number: 62, name: 'Xiao Guo', korName: '소과(小過)', chinese: '小過', upper: 1, lower: 4,
    description: '작은 초과. 조심스러운 초월.',
    advice: '작은 일에는 성공하지만 큰 일은 아직 때가 아니다.',
    judgment: '통한다. 올바름이 이롭다. 작은 것에는 가능하되 큰 것에는 불가하다.',
    image: '산 위에 우레가 있다. 군자는 행동에서 공경함을 더하고 상에서 슬픔을 더한다.',
    shadow: '작은 것에만 집착하다 큰 그림을 놓친다. 지금의 한계를 인정하고 준비하라.' },

  { number: 63, name: 'Ji Ji', korName: '기제(旣濟)', chinese: '旣濟', upper: 2, lower: 5,
    description: '완성 후. 이미 건넌 후의 균형.',
    advice: '이루었다. 그러나 방심하면 다시 무너질 수 있으니 경계하라.',
    judgment: '통한다. 소소한 것에 올바름이 이롭다. 처음은 길하나 마지막은 어지럽다.',
    image: '물이 불 위에 있다. 군자는 환란을 생각하여 미리 방비한다.',
    shadow: '완성이 끝이 아니다. 이룬 것을 지키는 것이 이루는 것만큼 어렵다.' },

  { number: 64, name: 'Wei Ji', korName: '미제(未濟)', chinese: '未濟', upper: 5, lower: 2,
    description: '미완성. 아직 건너지 못한 강.',
    advice: '아직 끝나지 않았다. 서두르지 말고 마지막 단계를 조심하라.',
    judgment: '통한다. 어린 여우가 건너려다 꼬리가 젖는다. 이로운 것이 없다.',
    image: '불이 물 위에 있다. 군자는 신중하게 사물을 분별하여 자리를 정한다.',
    shadow: '마지막 단계에서 방심하면 모든 것이 허사다. 끝까지 집중을 유지하라.' },
];

// ─── 유틸리티 함수 ──────────────────────────────────────────────────────────────

function isYang(line) {
  return line === 7 || line === 9;
}

/** 3개 라인으로 팔괘 값 계산 (아래 → 가운데 → 위 순) */
function trigramVal(bottom, mid, top) {
  return (isYang(top) ? 4 : 0) + (isYang(mid) ? 2 : 0) + (isYang(bottom) ? 1 : 0);
}

// 동전 3개 던지기 (앞=3/양, 뒤=2/음)
// 합: 6=노음(변효), 7=소양, 8=소음, 9=노양(변효)
export function throwCoins() {
  const coins = [
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
  ];
  return coins.reduce((a, b) => a + b, 0);
}

export function generateHexagram() {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    lines.push(throwCoins());
  }
  return hexagramFromLines(lines);
}

/**
 * 6개 효(lines[0]=초효/아래, lines[5]=상효/위)로 King Wen 순서 괘 결정
 * 수정: 이전 parseInt(binary,2)%64 방식 → 정확한 King Wen 매핑 테이블 사용
 */
export function hexagramFromLines(lines) {
  const lower = trigramVal(lines[0], lines[1], lines[2]); // 내괘 (하괘)
  const upper = trigramVal(lines[3], lines[4], lines[5]); // 외괘 (상괘)
  const num = KING_WEN[`${upper}_${lower}`] || 1;
  const hexagram = HEXAGRAMS.find(h => h.number === num) || HEXAGRAMS[0];
  return { hexagram, lines };
}

export function getLineSymbol(lineValue) {
  if (lineValue === 9) return '━━○━━'; // 노양 (변효)
  if (lineValue === 7) return '━━━━━'; // 소양
  if (lineValue === 8) return '━━ ━━'; // 소음
  if (lineValue === 6) return '━━×━━'; // 노음 (변효)
  return '━━━━━';
}
