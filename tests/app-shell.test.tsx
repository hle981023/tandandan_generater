import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Tandandan Creative Lab shell", () => {
  it("opens directly on the two generator choices", () => {
    render(<Home />);

    expect(
      screen.getByRole("tab", { name: "이미지 & 글 생성기" }),
    ).toBeVisible();
    expect(screen.getByRole("tab", { name: "언어 교정기" })).toBeVisible();
    expect(screen.getByText("DEMO MODE")).toBeVisible();
  });
});
