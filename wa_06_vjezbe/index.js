import express from 'express';
import korisniciRouter from './routes/korisnici.js';
import { body, validationResult, query, param } from 'express-validator';

const PORT = 3000;
const app = express();

// middleware na razini aplikacije
const timer = (req, res, next) => {
    console.log(`Trenutno vrijeme: ${new Date().toLocaleString()}`);
    next();
};

app.use(express.json()); // middleware
app.use(timer);
app.use('/korisnici', korisniciRouter);

app.get('/hello',
    [query('ime').notEmpty().withMessage('Polje ime ne može biti prazno!'), query('ime').escape()],
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return res.send('Hello, ' + req.query.ime);
        }
        return res.status(400).json({ errors: errors.array() });
});

// GET /hello?ime=Leon

app.listen(PORT, (error) => {
    if(error){
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else{
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});