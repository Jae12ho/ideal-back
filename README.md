# ideal-back

한국 이름과 개인 정보를 기반으로 창의적인 영문 사용자명(ID)을 생성하는 Node.js 백엔드 서비스입니다.

## 프로젝트 소개

ideal-back은 사용자의 한국 이름, 생년월일, 이니셜 등의 정보를 활용하여 의미 있고 독창적인 영문 ID를 제안하는 REST API 서버입니다. 한자 의미, 탄생석, 탄생화 등을 조합하여 5가지 다른 스타일의 사용자명을 생성합니다.

## 주요 기능

- **한자 의미 추출**: 네이버 한자 사전 API를 통해 한국 이름의 한자 의미를 영문으로 변환
- **다양한 조합 방식**: 5가지 알고리즘으로 서로 다른 스타일의 ID 생성
  - 한자 + 한자
  - 탄생석 + 한자
  - 탄생화 + 한자
  - 탄생석 + 탄생화
  - 이니셜 + 한자
- **개인화된 제안**: 생년월일 기반 탄생석 및 탄생화 데이터 활용
- **한글 의미 제공**: 생성된 영문 ID와 함께 한글 의미를 반환

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js v4.18.1
- **HTTP Client**: Axios v0.27.2
- **Middleware**: CORS v2.8.5
- **Language**: JavaScript (ES6+)

## 설치 방법

```bash
# 저장소 클론
git clone <repository-url>

# 디렉토리 이동
cd ideal-back

# 의존성 설치
npm install
```

## 실행 방법

```bash
# 서버 시작
node server.js
```

서버는 기본적으로 **포트 4000**에서 실행됩니다.

## API 명세

### GET /get

사용자 정보를 기반으로 5가지 스타일의 ID를 생성합니다.

#### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| korName | string | O | 한국 이름 | "김철수" |
| initial | string | O | 이니셜 | "KCS" |
| birthDay | string | O | 생년월일 (MM-DD) | "03-15" |
| nameMeaning | array | X | 이름 의미 배열 | ["iron", "water"] |

#### 요청 예시

```
GET http://localhost:4000/get?korName=김철수&initial=KCS&birthDay=03-15
```

#### 응답 예시

```json
[
  {
    "id": "iron.water",
    "meaning": "철.물"
  },
  {
    "id": "aquamarine_iron",
    "meaning": "청옥.철"
  },
  {
    "id": "sweetPea.water",
    "meaning": "스위트피.물"
  },
  {
    "id": "aquamarine_sweetPea",
    "meaning": "청옥.스위트피"
  },
  {
    "id": "KCS.iron",
    "meaning": "KCS.철"
  }
]
```

## 프로젝트 구조

```
ideal-back/
├── server.js           # Express 서버 진입점
├── makeID.js           # ID 생성 핵심 로직
├── birthFlowers.js     # 365일 탄생화 데이터
├── package.json        # 프로젝트 설정 및 의존성
├── package-lock.json   # 의존성 버전 잠금
└── node_modules/       # 설치된 패키지
```

## 주요 모듈 설명

### server.js
- Express 서버 설정 및 라우팅
- CORS 설정 (허용 도메인: http://ideal.p-e.kr)
- 에러 핸들링 미들웨어

### makeID.js
- 5가지 ID 생성 알고리즘 구현
- 네이버 API 연동 (한자 사전, 영어 사전)
- 탄생석/탄생화 데이터 매핑
- 랜덤 조합 및 구분자 생성

### birthFlowers.js
- 365일 각 날짜별 탄생화 데이터
- 01-01부터 12-31까지의 한국어 꽃 이름

## 외부 API 연동

이 프로젝트는 다음의 네이버 API를 사용합니다:

- **네이버 한자 사전 API**: `hanja.dict.naver.com/api3/ccko/search`
- **네이버 영어 사전 API**: `en.dict.naver.com/api3/enko/search`

## ID 생성 로직

1. **한자 의미 추출**: 한국 이름의 각 글자에 대한 한자 의미를 네이버 API에서 조회
2. **번역**: 탄생화 등 한국어 단어를 영어로 번역
3. **조합**: 한자, 탄생석, 탄생화, 이니셜을 다양한 방식으로 조합
4. **구분자 추가**: `.`, `._`, `_.` 등의 구분자를 랜덤하게 삽입
5. **결과 반환**: 영문 ID와 한글 의미를 함께 제공

## 탄생석 및 탄생화 데이터

### 월별 탄생석
- 1월: Garnet (석류석)
- 2월: Amethyst (자수정)
- 3월: Aquamarine (청옥)
- 4월: Diamond (다이아몬드)
- 5월: Emerald (에메랄드)
- 6월: Pearl (진주)
- 7월: Ruby (루비)
- 8월: Peridot (감람석)
- 9월: Sapphire (사파이어)
- 10월: Opal (오팔)
- 11월: Topaz (토파즈)
- 12월: Turquoise (터키석)

### 월별 탄생화 (요약)
각 월마다 대표 탄생화가 지정되어 있으며, 일별로는 365개의 탄생화 데이터가 `birthFlowers.js`에 저장되어 있습니다.

## CORS 설정

현재 다음 도메인에서의 요청만 허용됩니다:
- `http://ideal.p-e.kr`

다른 도메인에서 접근이 필요한 경우 `server.js`의 CORS 설정을 수정하세요.

## 개발 참고사항

- 포트 번호: 4000 (기본값)
- 비동기 처리: Promise.all을 통한 병렬 ID 생성
- 에러 처리: 500 에러 핸들링 미들웨어 구현
- 문자 인코딩: UTF-8 to Hex 변환 지원
