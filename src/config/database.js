import mongoose from "mongoose";

/*Conexao com o MongoDB*/
const mongooseConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://" +
        process.env.USER +
        ":" +
        process.env.PASSWORD +
        "@cluster0.noqrp.mongodb.net/" +
        process.env.DBNAME +
        "?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Conectado no MongoDB");
  } catch (error) {
    console.log("Erro ao conectar no MongoDB " + error);
  }
};

export default mongooseConnection;
