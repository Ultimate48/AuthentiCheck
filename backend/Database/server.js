const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const { SupplyMember, Batch, BatchLink } = require('./models');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })

app.use(express.json());

const {
    createSupplyMember,
    addBatch,
    verifyBatch,
    signData
} = require('./DBFunctions');

app.post('/supply-member', async (req, res) => {
    try {
        const { email, password, entity_name } = req.body;

        if (!email || !password || !entity_name) {
            return res.status(400).json({ error: 'email, password and entity_name are required' });
        }

        const { supplyMember, privateKey } = await createSupplyMember(email, password, entity_name);
        res.status(201).json({
            supplyMember: supplyMember.toJSON(),
            privateKey // return once, user must save this themselves
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/batch', async (req, res) => {
    try {
        const { batchData, producerId, shippedTo, privateKey, raw_material_batchIds } = req.body;

        if (!batchData || !producerId || !privateKey) {
            return res.status(400).json({ error: 'batchData, producerId and privateKey are required' });
        }

        const signature = signData({
            batchData,
            producerId,
            shippedTo: shippedTo ?? null,
            raw_material_batchIds: raw_material_batchIds ?? []
        }, privateKey);

        const { batch, qr } = await addBatch(
            batchData,
            producerId,
            shippedTo ?? null,
            signature,
            raw_material_batchIds ?? []
        );

        res.status(201).json({
            batch: batch.toJSON(),
            qr
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/verify', async (req, res) => {
    try {
        const { batchId } = req.body;

        if (!batchId) {
            return res.status(400).json({ error: 'batchId is required' });
        }

        const chain = await verifyBatch(batchId);
        res.status(200).json({ chain });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/supply-members', async (req, res) => {
    //get supply-members using Sequelize
    try {
        const members = await SupplyMember.findAll();
        res.status(200).json({ members });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});