import { base64 } from "./base64";

const helloWorldBase64Encoded = "SGVsbG8gV29ybGQ=";

describe("Base64 encode/decode abilities", () => {
  it("decodes from base64-encoded string", () => {
    expect(base64.decode(helloWorldBase64Encoded)).toBe("Hello World");
  });

  it("encodes to base64-encoded string", () => {
    expect(base64.encode("Hello World")).toBe(helloWorldBase64Encoded);
  });
});