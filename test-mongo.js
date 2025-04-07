const mongoose = require('mongoose');

const uri =
  'mongodb+srv://admin:7101093@cluster0.b5tyh2h.mongodb.net/plan_pleno?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Successfully connected to MongoDB!');
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);

    // Test if we can perform a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => console.log(`- ${collection.name}`));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    console.error(`- Error name: ${error.name}`);
    console.error(`- Error message: ${error.message}`);
    if (error.name === 'MongoServerSelectionError') {
      console.error('- This is likely due to network issues or incorrect credentials');
      console.error('- Check if your IP is whitelisted in MongoDB Atlas');
    }
  }
}

testConnection();
