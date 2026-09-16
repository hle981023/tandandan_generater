import type {
  BrandCheck,
  FieldErrors,
  ImageBrief,
  RewriteBrief,
} from "@/lib/tandandan/types";

export const preferredWords = [
  "리듬",
  "루틴",
  "밸런스",
  "한 끼",
  "가볍게",
  "즐겁게",
  "탄탄하게",
  "나답게",
  "매일",
] as const;

export const discouragedWords = [
  "자격",
  "가치",
  "정직한",
  "믿음",
  "타협하지 않는",
  "개척",
  "완전한",
  "완벽한",
  "본질",
  "근원",
  "견뎌내는",
  "기준",
] as const;

const consumerMoments = [
  "아침",
  "점심",
  "오후",
  "운동",
  "하루",
  "한 끼",
  "매일",
  "허기",
];
const concreteWords = [
  "고소",
  "담백",
  "은은",
  "부드러운",
  "원물",
  "곡물",
  "단백질",
  "포만",
  "아침",
  "오후",
  "운동",
];

export function findWarningWords(text: string): string[] {
  return discouragedWords
    .map((word) => ({ word, index: text.indexOf(word) }))
    .filter(({ index }) => index >= 0)
    .sort((left, right) => left.index - right.index)
    .map(({ word }) => word);
}

export function checkBrandCopy(text: string): BrandCheck[] {
  const compact = text.trim();
  const hasConsumerMoment = consumerMoments.some((word) => compact.includes(word));
  const hasJoyfulLanguage = preferredWords.some((word) => compact.includes(word));
  const hasConcreteLanguage = concreteWords.some((word) => compact.includes(word));
  const hasRhythm = /[,\n.!?]/.test(compact) || compact.length <= 34;
  const feelsLight = compact.length > 0 && compact.length <= 90 && findWarningWords(compact).length === 0;

  return [
    { id: "consumer", label: "소비자의 하루에서 시작해요", passed: hasConsumerMoment },
    { id: "light", label: "가볍게 읽혀요", passed: feelsLight },
    { id: "joy", label: "즐거운 루틴이 느껴져요", passed: hasJoyfulLanguage },
    { id: "concrete", label: "맛과 장면이 구체적이에요", passed: hasConcreteLanguage },
    { id: "rhythm", label: "말의 리듬이 자연스러워요", passed: hasRhythm },
  ];
}

export function validateImageBrief(brief: ImageBrief): FieldErrors<ImageBrief> {
  const errors: FieldErrors<ImageBrief> = {};
  if (!brief.productName.trim()) errors.productName = "제품명을 입력해 주세요.";
  if (!brief.productFacts.trim()) {
    errors.productFacts = "제품 사실을 한 가지 이상 입력해 주세요.";
  }
  if (!brief.occasion.trim()) errors.occasion = "먹는 순간을 입력해 주세요.";
  if (!brief.objective.trim()) errors.objective = "게시 목적을 입력해 주세요.";
  return errors;
}

export function validateRewriteBrief(
  brief: RewriteBrief,
): FieldErrors<RewriteBrief> {
  const errors: FieldErrors<RewriteBrief> = {};
  if (!brief.original.trim()) {
    errors.original = "바꾸고 싶은 문장을 입력해 주세요.";
  }
  return errors;
}
