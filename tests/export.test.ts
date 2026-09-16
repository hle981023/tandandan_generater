import { describe, expect, it } from "vitest";

import { getExportFilename, getExportSize } from "@/lib/tandandan/export";

describe("Instagram export helpers", () => {
  it("uses the correct pixel size for each Instagram ratio", () => {
    expect(getExportSize("4:5")).toEqual({ width: 1080, height: 1350 });
    expect(getExportSize("9:16")).toEqual({ width: 1080, height: 1920 });
  });

  it("creates a filesystem-safe Korean product filename", () => {
    expect(getExportFilename("보리 단백!", "4:5")).toBe("tandandan-보리-단백-4x5.png");
  });
});
