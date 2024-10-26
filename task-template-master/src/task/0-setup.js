export async function setup() {
  // define any steps that must be executed before the task starts
  console.log("CUSTOM SETUP");

  const { MongoClient } = require("mongodb");
  const uri = "mongodb+srv://ri1jgo0l:<db_password>@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII";

  async function run() {
      const client = new MongoClient(uri);

      try {
          await client.connect();
          const database = client.db("KOII");
          const collection = database.collection("ScrappedData");

          // Insert a document to create the collection
          const result = await collection.insertOne({
              userId: "Jane Doe",
              age: 25,
              occupation: "Designer"
          });

          console.log("Collection created with document ID:", result.insertedId);
      } finally {
          await client.close();
      }
  }

  run().catch(console.dir);

}
