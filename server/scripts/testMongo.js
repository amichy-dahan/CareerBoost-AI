// Standalone connectivity test. Run with: node scripts/testMongo.js
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in environment');
    process.exit(1);
  }
  console.log('Attempting to connect...');
  console.log('URI length:', uri.length); // Avoid printing full URI
  try {
    await mongoose.connect(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      maxPoolSize: 5,
    });
    console.log('State after connect (expect 1):', mongoose.connection.readyState);
    const ping = await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Ping result:', ping);
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Collections:', (await mongoose.connection.db.listCollections().toArray()).map(c => c.name));
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
    process.exit(1);
  }
})();
