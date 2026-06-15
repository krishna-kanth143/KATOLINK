import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    console.log(`[DB] Connected to: ${conn.connection.host}`);
    
    // Explicit collection check/initialization
    const collections = await conn.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Ensure vital collections are initialized (Mongoose usually does this, but being explicit)
    const required = ['urls', 'clicks', 'users'];
    for (const name of required) {
      if (!collectionNames.includes(name)) {
        await conn.connection.db.createCollection(name);
        console.log(`[DB] Initialized missing collection: ${name}`);
      }
    }

    console.log(`[DB] Collections verified: ${collectionNames.join(', ')}`);
  } catch (error) {
    console.error('[DB_ERROR] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
