// import { namespaceWrapper } from "@_koii/namespace-wrapper";
// import { storeFile } from "./fileUtils.js";
import { crawl } from "./crawler.js";
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid'; 


export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  const uri = "mongodb+srv://ri1jgo0l:milkman@koii.mf9pb.mongodb.net/?retryWrites=true&w=majority&appName=KOII";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


  console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
  try {
    await client.connect();
    const database = client.db("KOII");
    
    const SearchTermcollection = database.collection("SearchTerm");
    const search_term_document = await SearchTermcollection.findOne({}, { projection: { search_term: 1 } });

    const collection = database.collection("ScrappedData");

    // Insert a document to create the collection

    search_term_document.search_term.map(async (term) => {

      const postTitles = await crawl(term);
      
      let articleTitleInfoObj = [];
      postTitles.map((title) => {
        return articleTitleInfoObj.push({name: title, sentiment: 2})
      });

      const result = await collection.insertOne({
        userId: uuidv4(),
        articleTitleInfo: articleTitleInfoObj,
        key_word: [term]
      });

      console.log("Collection created with document ID:", result);
    });
    // const cid = await storeFile(postTitles);
    // await namespaceWrapper.storeSet("cid", cid);
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}


task();