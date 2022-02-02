const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config;

app.use(express.json());
app.use(cors());
const Port = process.env.PORT || 5000;

const uri = `mongodb+srv://practice:KJESee695SLN6Clr@cluster0.zetdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("practice");
    const elements = database.collection("elements");

    // Contact Number Save API
    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await elements.insertOne(data);
      res.json(result);
    });
    // Contact Number Get API
    app.get("/contacts", async (req, res) => {
      const data = elements.find({});
      const result = await data.toArray();
      res.json(result);
    });
    app.put("/contacts/:id", async (req, res) => {
      const id = req.params;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await elements.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    app.delete("/contacts/:id", async (req, res) => {
      const id = req.params;
      const filter = { _id: ObjectId(id) };
      const result = await elements.deleteOne(filter);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(Port, () => {
  console.log(`server is running on ${Port}`);
});
