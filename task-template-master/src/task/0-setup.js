import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid'; 

export async function setup() {
  // Define any steps that must be executed before the task starts
  console.log("CUSTOM SETUP");

  const uri = "mongodb+srv://ri1jgo0l:milkman@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII";

  async function run() {
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      try {
          await client.connect();
          const database = client.db("KOII");
          const collection = database.collection("ScrappedData");

          // Insert a document to create the collection
          const result = await collection.insertOne({
              userId: uuidv4(),
              articleTitleInfo: [{title: "article title", sentiment: 0.5}],
              key_word: ["word1"]
          });

          console.log("Collection created with document ID:", result.insertedId);
      } finally {
          await client.close();
      }
  }

  await run(); // Make sure to await the run function
}

setup();