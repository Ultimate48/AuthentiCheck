const { SupplyMember } = require('./models');
const supabase = require('./supabaseClient');

async function createSupplyMember(email, password, entity_name){
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: password,
        email_confirm: true
    });
  
    if (error) {
        console.error('Error creating auth user:', error.message);
        throw new Error(error.message);
    }
  
    const supabaseUserId = data.user.id;

    const { publicKey, privateKey } = generateKeyPair();
  
    const supplyMember = await SupplyMember.create({
        id: supabaseUserId,
        entity_name,
        public_key: publicKey,
        status: 'active'
    });
  
    return { supplyMember, privateKey };
}

function generateKeyPair(){
    const { generateKeyPairSync } = require('crypto');

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 512,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const stripKey = (key) => key
  .replace(/-----BEGIN.*?-----/, '')
  .replace(/-----END.*?-----/, '')
  .replace(/\n/g, '')
  .trim();

  return {
    publicKey: stripKey(publicKey),
    privateKey: stripKey(privateKey)
  };

}

createSupplyMember("arshbir.f4@gamil.com", "password123", "Adeesh's Farm")
.then(({ supplyMember, privateKey }) => {
    console.log('Supply Member created:', supplyMember.toJSON());
    console.log('Private Key:', privateKey);
})

const { createSign, createVerify } = require('crypto');

function signData(data, strippedPrivateKey) {
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${strippedPrivateKey}\n-----END PRIVATE KEY-----`;
    
    const sign = createSign('SHA256');
    sign.update(JSON.stringify(data));
    sign.end();
    
    return sign.sign(privateKeyPem, 'base64');
}

function verifyData(data, signature, strippedPublicKey) {
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${strippedPublicKey}\n-----END PUBLIC KEY-----`;
    
    const verify = createVerify('SHA256');
    verify.update(JSON.stringify(data));
    verify.end();
    
    return verify.verify(publicKeyPem, signature, 'base64');
}

async function addBatch(batchData, producerId, shippedTo, signature, raw_material_batchIds){
    
}