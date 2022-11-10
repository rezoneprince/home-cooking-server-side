const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ovxjb0p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const productsCollection = client.db("homeCooking").collection("products");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.get("/product3", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.post("/product", async (req, res) => {
      const order = req.body;
      const result = await productsCollection.insertOne(order);
      res.send(result);
    });
  } finally {
  }
};

run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Welcome to Home Cooking Server");
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
