import crypto from "crypto";

// Use SHA256 to generate a consistent 32-byte key from the environment variable
const getKey = () => {
  const envKey =
    process.env.ENCRYPTION_KEY || "your-fallback-key-minimum-32-characters";
  return crypto
    .createHash("sha256")
    .update(String(envKey))
    .digest()
    .slice(0, 32);
};

const ENCRYPTION_KEY = getKey();
const IV_LENGTH = 16; // For AES, this is always 16
const ALGORITHM = "aes-256-cbc";

export const encrypt = (text: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export const decrypt = (text: string): string => {
  try {
    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = Buffer.from(ENCRYPTION_KEY);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};
