import express from 'express';
import nekretnineRouter from './routes/nekretnine.js';
import ponudeRouter from './routes/ponude.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/nekretnine', nekretnineRouter);
app.use('/ponude', ponudeRouter);

app.listen(PORT, (error) => {
    if(error){
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});