const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const getDb = async () => {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  if (!client) throw { message: "You must connect first!" };
  return client.db("translators");
};

class User {
  constructor()
}
