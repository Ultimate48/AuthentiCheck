// Add these two routes to your Express server (server.js)

const { SupplyMember } = require('./models');

// GET /supply-members — list all
app.get('/supply-members', async (req, res) => {
  try {
    const members = await SupplyMember.findAll({
      attributes: ['id', 'entity_name', 'public_key', 'status', 'createdAt']
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /supply-member/:id/status — update status
app.patch('/supply-member/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'revoked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const member = await SupplyMember.findByPk(id);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    await member.update({ status });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
