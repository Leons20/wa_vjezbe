import express from 'express';
import cors from 'cors';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Spremni za autentifikaciju!');
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});