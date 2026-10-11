import crypto from "node:crypto";
export type TelegramUser = { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string };
export function validateTelegramInitData(initData: string, botToken: string, nowSeconds = Math.floor(Date.now()/1000), maxAgeSeconds = 86400): TelegramUser {
 if (!initData || !botToken) throw new Error("Missing Telegram initData or bot token");
 const params = new URLSearchParams(initData); const receivedHash = params.get("hash");
 const authDate = Number(params.get("auth_date")); const userRaw = params.get("user");
 if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) throw new Error("Invalid Telegram hash");
 if (!Number.isFinite(authDate) || authDate > nowSeconds + 30 || nowSeconds-authDate > maxAgeSeconds) throw new Error("Telegram auth data is expired or invalid");
 if (!userRaw) throw new Error("Telegram user is missing");
 params.delete("hash");
 const check = [...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n");
 const secret = crypto.createHmac("sha256","WebAppData").update(botToken).digest();
 const expected = crypto.createHmac("sha256",secret).update(check).digest("hex");
 const a=Buffer.from(receivedHash,"hex"), b=Buffer.from(expected,"hex");
 if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) throw new Error("Telegram signature verification failed");
 const user=JSON.parse(userRaw) as TelegramUser;
 if(!Number.isSafeInteger(user.id)||user.id<=0||!user.first_name) throw new Error("Invalid Telegram user");
 return user;
}
export function issueBearerToken(telegramId: string, botToken: string, issuedAt = Date.now()): string {
 const payload=Buffer.from(JSON.stringify({sub:telegramId,iat:issuedAt,exp:issuedAt+7*86400000})).toString("base64url");
 const secret=crypto.createHash("sha256").update(`msnr-session:${botToken}`).digest();
 return `${payload}.${crypto.createHmac("sha256",secret).update(payload).digest("base64url")}`;
}
export function verifyBearerToken(token: string, botToken: string, now = Date.now()): string {
 const [payload,signature,extra]=token.split("."); if(!payload||!signature||extra) throw new Error("Invalid session token");
 const secret=crypto.createHash("sha256").update(`msnr-session:${botToken}`).digest(); const expected=crypto.createHmac("sha256",secret).update(payload).digest("base64url");
 const a=Buffer.from(signature),b=Buffer.from(expected); if(a.length!==b.length||!crypto.timingSafeEqual(a,b)) throw new Error("Invalid session signature");
 const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as {sub:string;exp:number}; if(!data.sub||data.exp<now) throw new Error("Session expired"); return data.sub;
}
