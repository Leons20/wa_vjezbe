import express from 'express';
import filmoviRouter from './routes/filmovi.js';
import glumciRouter from './routes/glumci.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    const trenutnoVrijeme = new Date().toISOString();
    const popravljenDatum = trenutnoVrijeme.replace('T', ' ').split('.')[0];
    console.log(`[movie-server] [${popravljenDatum}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/filmovi', filmoviRouter);
app.use('/glumci', glumciRouter);

app.listen(PORT, (error) => {
    if(error){
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else{
        console.log(`Server radi na http://localhost:${PORT}`);
    }
});