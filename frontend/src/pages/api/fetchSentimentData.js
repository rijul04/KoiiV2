// pages/api/fetchData.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { term } = req.query; 
  const client = new MongoClient("mongodb+srv://ri1jgo0l:milkman@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII");

  try {
    await client.connect();
    const db = client.db('KOII'); // Replace with your database name
    const collection = db.collection('ScrappedData'); // Replace with your collection name
    

     // MongoDB query using regex for partial match, if term is provided
     const query = term
     ? { key_word: { $regex: term, $options: 'i' } } // Adjust `property_name` to the relevant field
     : {}; // Default to fetching all documents if no term

    // Perform a MongoDB query
    const data = await collection.find(query).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ message: 'Failed to fetch data' });
  } finally {
    await client.close(); // Close the database connection
  }
}
