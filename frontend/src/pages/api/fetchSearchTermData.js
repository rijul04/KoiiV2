// // pages/api/fetchData.js
// import { MongoClient } from 'mongodb';

// export default async function handler(req, res) {
//   const uri = "mongodb+srv://ri1jgo0l:milkman@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII";
//   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//   await client.connect();

//   const db = client.db('KOII'); // Replace with your actual database name
//   const collection = db.collection('SearchTerm'); // Replace with your collection name
// //   const data = await collection.find({}).toArray();
//   const data = await collection.findOne({}, { projection: { search_term: 1 } });

//   await client.close();

//   res.status(200).json(data);
// }


// pages/api/fetchData.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient("mongodb+srv://ri1jgo0l:milkman@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII");

  try {
    await client.connect();
    const db = client.db('KOII'); // Replace with your database name
    const collection = db.collection('SearchTerm'); // Replace with your collection name
    
    // Perform a MongoDB query
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ message: 'Failed to fetch data' });
  } finally {
    await client.close(); // Close the database connection
  }
}
