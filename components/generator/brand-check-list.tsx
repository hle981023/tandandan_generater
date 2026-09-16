import { Check, CircleAlert } from "lucide-react";

import type { BrandCheck } from "@/lib/tandandan/types";

export function BrandCheckList({ checks }: { checks: BrandCheck[] }) {
  const passed = checks.filter((check) => check.passed).length;

  return (
    <div className="brand-checks" aria-label={`${checks.length}개 중 ${passed}개 브랜드 체크 통과`}>
      <div className="check-score">
        <span>BRAND CHECK</span>
        <strong>{passed}/{checks.length}</strong>
      </div>
      <ul>
        {checks.map((check) => (
          <li data-passed={check.passed} key={check.id}>
            {check.passed ? <Check aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
