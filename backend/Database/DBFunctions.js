const { SupplyMember, Batch, BatchLink } = require('./models');
const supabase = require('./supabaseClient');
const { createSign, createVerify } = require('crypto');
const QRCode = require('qrcode');

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
        await BatchLink.create({
            parent_id: batchId,
            child_id: batch.id
        });
    }
    qr = await generateQR(batch.id);

    return { batch, qr };
}

async function generateQR(data) {
    const qr = await QRCode.toDataURL(JSON.stringify(data));
    return qr;
}

async function verifyBatch(batchId) {
    const visited = new Set();

    async function traverse(id) {
        if (visited.has(id)) return null;
        visited.add(id);

        const batch = await Batch.findByPk(id, {
            include: [
                { model: SupplyMember, as: 'Producer' },
                { model: SupplyMember, as: 'ShippedTo' },
            ]
        });

        if (!batch) throw new Error(`Batch ${id} not found`);

        const parentLinks = await BatchLink.findAll({ where: { child_id: id } });
        const raw_material_batchIds = parentLinks.map(link => link.parent_id);

        const dataToVerify = {
            batchData: batch.data,
            producerId: batch.producer_id,
            shippedTo: batch.shipped_to_id,
            raw_material_batchIds
        };

        const isValid = verifyData(dataToVerify, batch.signature, batch.Producer.public_key);

        const parents = await Promise.all(
            raw_material_batchIds.map(parentId => traverse(parentId))
        );

        return {
            id: batch.id,
            producer: batch.Producer.entity_name,
            shipped_to: batch.ShippedTo ? batch.ShippedTo.entity_name : null,
            data: batch.data,
            signature_valid: isValid,
            raw_materials: parents.filter(Boolean) // remove nulls
        };
    }

    const chain = await traverse(batchId);
    return chain;
}

module.exports = { createSupplyMember, addBatch, verifyBatch, signData }