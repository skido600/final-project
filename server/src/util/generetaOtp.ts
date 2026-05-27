import { randomInt, createHmac } from "crypto";

export function Otpcode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hmacProcess(code: string, secret: string): string {
  return createHmac("sha256", secret).update(code).digest("hex");
}
