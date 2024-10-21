import { cssNames } from "./cssNames";

describe("CSS class-names merging utility for React components", () => {
  it("merges classes from input: string | string[] | Record<string, boolean>", () => {
    expect(cssNames("class1 class2", "\nclass3\t")).toBe("class1 class2 class3");

    expect(cssNames(["a", "b"], "class1", {
      class2: true,
      class3: false,
      class4: undefined,
      class5: 1,
    })).toBe("a b class1 class2 class5");
  });
});
