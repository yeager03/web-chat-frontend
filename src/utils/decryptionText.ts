// crypto
import crypto from "crypto-js";

// KEY
const CRYPTO_KEY = process.env.REACT_APP_CRYPTO_KEY || "";

// eslint-disable-next-line import/no-anonymous-default-export
export default (cryptText: string) => crypto.AES.decrypt(cryptText, CRYPTO_KEY).toString(crypto.enc.Utf8);
