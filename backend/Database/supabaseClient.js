const { createClient } = require('@supabase/supabase-js');
const config = require('./config/supabase.json');

const supabase = createClient(config.url, config.serviceKey);

module.exports = supabase;
