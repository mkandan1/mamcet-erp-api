import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGOOSE_URI;
let db 
async function connect() {
  await mongoose.connect(uri)
    .then(() => {
      console.log('Connected to MongoDB ✨');
    }).catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

    let client = new MongoClient(process.env.MONGODB_URI);
    client.connect();
    db = client.db('mymamcet')
  }

export { connect, db }