const app = require("./app");
const connectDB = require("./config/mongoConnection");
const PORT = 3001;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});


