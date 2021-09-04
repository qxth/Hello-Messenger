import crypto from "crypto-js";
import keys from "./../secret/keys";

const key = keys.cryptoKey;
const iv = keys.cryptoIV;
const cryptAnsw = async (answ) => {
  const hash = crypto.AES.encrypt(answ, key, { iv: iv, outputLength: 20 });
  console.log(hash.toString());
  return hash.toString();
};
const decryptAnsw = async (answ) => {
  const decrypt = crypto.AES.decrypt(answ.toString(), key, { iv: iv });
  console.log(decrypt.toString(crypto.enc.Utf8));
  return decrypt;
};

export { cryptAnsw, decryptAnsw };
