const {MongoClient} = require("mongodb")
require("dotenv").config()
const mongoClient = new MongoClient("mongodb+srv://solugezero:ps2021742@cluster0.uvz94yn.mongodb.net/?retryWrites=true&w=majority")

const clientPromise = mongoClient.connect()

exports.handler = async (event) => {
  try {
    const database = (await clientPromise).db("test")
    const collection = database.collection("posts")
    const results = await collection.find().toArray()
    return {statusCode: 200, body: JSON.stringify(results)}
  } catch (err) {
    return {statusCode: 500, body: err.toString()}
  }
}