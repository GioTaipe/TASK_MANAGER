const app = require("./app");
const connectDB = require("./config/mongoConnection");


connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo`);
  });
});


