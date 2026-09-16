# Tandandan Creative Lab

탄단단 마케터가 인스타그램용 무드 이미지와 브랜드 카피를 빠르게 만드는 내부용 웹 프로토타입입니다.

## 지금 할 수 있는 것

- 제품 정보, 먹는 순간, 게시 목적을 바탕으로 인스타그램 이미지·카피 시안 생성
- Product / Ingredient / Culture 세 가지 무드와 피드 4:5 / 스토리 9:16 비율 선택
- 제품 이미지 업로드 후 시안 합성
- 이미지 위 문구 3안, 캡션, CTA 추천
- 원문을 탄단단 톤앤매너의 문장 3안으로 교정하고 브랜드 체크 표시
- 인스타그램 규격 PNG 다운로드 및 카피 복사

현재는 **Demo Mode**입니다. 카피는 로컬 규칙 엔진으로 만들며, 무드 이미지는 미리 준비된 브랜드 데모 에셋을 사용합니다. 외부 AI API 키나 서버 저장소는 필요하지 않습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 표시되는 로컬 주소를 열어 사용합니다.

## 검증

```bash
npm test
npm run build
```

## 구조

- `components/generator`: 이미지·카피 스튜디오, 언어 교정기, 결과 UI
- `lib/tandandan`: 브랜드 규칙, 데모 생성 엔진, PNG 내보내기
- `app/api`: 추후 실제 AI 연동 시 교체할 API 경계
- `public/demo`: 탄단단 무드 데모 이미지
- `docs/superpowers`: 제품 설계와 구현 계획

## 다음 단계

실제 이미지 생성과 카피 모델을 붙일 때는 `app/api/generate-image-copy`와 `app/api/rewrite-copy` 내부를 교체하면 됩니다. UI와 입력 검증, 브랜드 체크, 내보내기 흐름은 그대로 유지할 수 있습니다.
