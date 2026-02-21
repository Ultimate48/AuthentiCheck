const { SupplyMember, Batch, Batchlink } = require('./models');
const supabase = require('./supabaseClient');
const { createSign, createVerify } = require('crypto');

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

// createSupplyMember("arshbir.f4@gamil.com", "password123", "Adeesh's Farm")
// .then(({ supplyMember, privateKey }) => {
//     console.log('Supply Member created:', supplyMember.toJSON());
//     console.log('Private Key:', privateKey);
// })

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
    for(const batchId of raw_material_batchIds){
        const batch = await Batch.findByPk(batchId);
        if(!batch){
            throw new Error(`Batch with ID ${batchId} does not exist`);
        }
        if(batch.shipped_to_id !== producerId){
            throw new Error(`Batch with ID ${batchId} is not shipped to the producer`);
        }
    }

    const producer = await SupplyMember.findByPk(producerId);
    if(!producer){
        throw new Error(`Producer with ID ${producerId} does not exist`);
    }

    data = {
        batchData,
        producerId,
        shippedTo,
        raw_material_batchIds
    }

    const isValidSignature = verifyData(data, signature, producer.public_key);
    if(!isValidSignature){
        throw new Error('Invalid signature');
    }

    const batch = await Batch.create({
        producer_id: producerId,
        shipped_to_id: shippedTo,
        data: batchData,
        signature
    });

    for(const batchId of raw_material_batchIds){
        await Batchlink.create({
            parent_id: batchId,
            child_id: batch.id
        });
    }

    return batch;
}

function createBatch(){
    const batchData = {
        product_name: 'Tomatoes',
        quantity: "100 kg",
        harvest_date: '2024-06-01'
    }

    producerId = "f0f58506-b7a0-44a8-9380-771631dc8524";

    shippedTo = null;

    const raw_material_batchIds = [];

    const signature = signData({
        batchData,
        producerId,
        shippedTo,
        raw_material_batchIds
    }, "MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAvygOBpHBNXWRTfZ1eQAjgPXrPbvHVO2MzuXI0uCzJIwCwnmn3PaBSMOfqtdCkkuYV69IUjchKdTQCc0MOZTe5wIDAQABAkEAmi44gdv2NqRJOtTbE2mlOVMhFn3q3PltZUO5oz1RwNs3ehscADVPAbA7GPT6keoB7Pu8YxzqGzrhyrgE7FXaQQIhAO0FX5M5Aqhy4gIHTnXyaPtc4z/6IZZKmrkeNgeHsFYJAiEAznaEdgbDK05+nxYAscfJ4ENlGlieyWJtnSjzj0yfSW8CIGr9ZPIg5ulAynJd9/XX0bm9aTtE3opn7MWpNHxbrKZ5AiEAmRvpJYHkUIRYgG+Xuj94JTi1jHE16BB3S3ooDRf8dD8CIAP6pJrc/HOeWdNvEFUy42NLODFO3OSTbbbTeQ6p5qoi"
    );

    addBatch(batchData, producerId, shippedTo, signature, raw_material_batchIds)
    .then(batch => {
        console.log('Batch created:', batch.toJSON());
    })
}

// createBatch();