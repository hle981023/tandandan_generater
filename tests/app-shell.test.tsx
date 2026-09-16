import { fireEvent, render, screen } from "@testing-library/react";
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

  it("shows a complete Instagram image and copy brief", () => {
    render(<Home />);

    expect(screen.getByLabelText("제품명")).toBeVisible();
    expect(screen.getByLabelText("제품 사실")).toBeVisible();
    expect(screen.getByLabelText("먹는 순간")).toBeVisible();
    expect(screen.getByLabelText("게시 목적")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "무드 & 카피 만들기" }),
    ).toBeVisible();
  });

  it("opens the Tandandan language rewriter", () => {
    render(<Home />);
    const rewriteTab = screen.getByRole("tab", { name: "언어 교정기" });
    fireEvent.mouseDown(rewriteTab, { button: 0, ctrlKey: false });
    fireEvent.click(rewriteTab);

    expect(screen.getByLabelText("바꾸고 싶은 문장")).toBeVisible();
    expect(screen.getByLabelText("사용 위치")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "탄단단 언어로 바꾸기" }),
    ).toBeVisible();
  });
});
