const pool = require('./db'); 
pool.query("SELECT table_name, column_name, character_maximum_length FROM information_schema.columns WHERE table_schema = 'public' AND character_maximum_length IS NOT NULL")
  .then(res => { console.log(res.rows); pool.end(); });
