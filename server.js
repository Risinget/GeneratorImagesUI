const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getImageUri } = require("./getImageUri");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors()); // Permite todas las solicitudes CORS

app.get('/health', (req, res) => {
  try {
    res.send("Server is running");
  } catch (error) {
    res.status(500).send("Error:"+error);
  }
})

app.get("/getImageUri", async (req, res) => {
  try {
    const imageUri = await getImageUri(req.query.input);
    res.send({ imageUri });
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res.status(500).send("Error al obtener la imagen");
  }
});


app.get("/download", async (req, res) => {
  const url = atob(req.query.url); // Obtener la URL de la imagen desde la consulta
  console.log('DECODIFICADO: '+url);
  try {
    console.log(`Downloading image from: ${url}`);
    const response = await axios.get(url, {
      responseType: "arraybuffer", // Asegúrate de obtener los datos de la imagen
    });

    // Guardar la imagen temporalmente en el servidor
    const tempPath = path.join(__dirname, `${uuidv4()}.png`);
    fs.writeFileSync(tempPath, response.data);

    // Enviar la imagen como archivo descargable
    res.download(tempPath, "image.png", (err) => {
      if (err) {
        console.error("Error al descargar la imagen:", err);
        res.status(500).send("Error al descargar la imagen");
      }
      // Eliminar el archivo temporal después de la descarga
      fs.unlinkSync(tempPath);
    });
  } catch (error) {
    console.error(
      "Error during download:",
      error.response?.data || error.message
    );
    res.status(500).send(error.message);
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


module.exports = app;
