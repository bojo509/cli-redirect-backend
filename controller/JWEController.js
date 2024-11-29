import { generateKeyPair, CompactEncrypt, compactDecrypt } from 'jose';

let keyPair;

const initializeKeyPair = async () => {
    if (!keyPair) {
        keyPair = await generateKeyPair('RSA-OAEP');
        console.log('Key pair generated!');
    }
};

const encryptPayload = async (payload) => {
    const { publicKey } = keyPair;
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    const payloadWithExpiry = { ...payload, exp: expirationTime };

    return await new CompactEncrypt(new TextEncoder().encode(JSON.stringify(payloadWithExpiry)))
        .setProtectedHeader({ alg: 'RSA-OAEP', enc: 'A256GCM' })
        .encrypt(publicKey);
};

const decryptPayload = async (jwe) => {
    const { privateKey } = keyPair;
    const { plaintext } = await compactDecrypt(jwe, privateKey);
    return JSON.parse(new TextDecoder().decode(plaintext));
};

export { initializeKeyPair, encryptPayload, decryptPayload };