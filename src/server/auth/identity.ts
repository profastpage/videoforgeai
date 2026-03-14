import { createHash } from "node:crypto";

export function toStableAppUserId(identity: string) {
  const hash = createHash("sha1").update(identity).digest("hex");
  const base = hash.slice(0, 32);

  return [
    base.slice(0, 8),
    base.slice(8, 12),
    `4${base.slice(13, 16)}`,
    `a${base.slice(17, 20)}`,
    base.slice(20, 32),
  ].join("-");
}
