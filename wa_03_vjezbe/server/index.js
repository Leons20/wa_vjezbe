import express from "express";
import cors from "cors";
import proizvodiRouter from "./routes/proizvodi.js";
import narudzbeRouter from "./routes/narudzbe.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/proizvodi', proizvodiRouter);
app.use('/narudzbe', narudzbeRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Webshop API" });
});

app.listen(PORT, (error) => {
    if(error){
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else{
        console.log(`Server pokrenut na http://localhost:${PORT}`);
    }
});