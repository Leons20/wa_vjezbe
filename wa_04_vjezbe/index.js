import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;

const zaposleniciFilePath = path.resolve('zaposlenici.json');

app.use(express.json());

const dohvatiZaposlenike = async () => {
    try{
        const data = await fs.readFile(zaposleniciFilePath, 'utf8');
        return JSON.parse(data);
    } catch(err){
        console.error('Greška pri čitanju datoteke:', err);
        return [];
    }
};

const spremiZaposlenika = async (zaposlenici) => {
    try{
        await fs.writeFile(zaposleniciFilePath, JSON.stringify(zaposlenici, null, 2));
    } catch(err){
        console.error('Greška pri spremanju datoteke:', err);
    }
};

app.get('/zaposlenici', async (req, res) => {
    const{ sortiraj_po_godinama, pozicija, godine_staza_min, godine_staza_max } = req.query;
    let zaposlenici = await dohvatiZaposlenike();

    if(pozicija){
        zaposlenici = zaposlenici.filter(({ pozicija: p }) => p === pozicija);
    }
    if(godine_staza_min){
        zaposlenici = zaposlenici.filter(({ godine_staza }) => godine_staza >= parseInt(godine_staza_min, 10));
    }
    if(godine_staza_max){
        zaposlenici = zaposlenici.filter(({ godine_staza }) => godine_staza <= parseInt(godine_staza_max, 10));
    }

    if(sortiraj_po_godinama){
        zaposlenici.sort((a, b) => sortiraj_po_godinama === 'uzlazno' ? a.godine_staza - b.godine_staza : b.godine_staza - a.godine_staza);
    }

    res.json(zaposlenici);
});

app.get('/zaposlenici/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)){
        return res.status(400).json({ error: 'ID mora biti broj' });
    }

    const zaposlenici = await dohvatiZaposlenike();
    const zaposlenik = zaposlenici.find(({ id: zaposlenikId }) => zaposlenikId === id);

    if(!zaposlenik){
        return res.status(404).json({ error: 'Zaposlenik nije pronađen' });
    }

    res.json(zaposlenik);
});

app.post('/zaposlenici', async (req, res) => {
    const{ ime, prezime, godine_staza, pozicija } = req.body;

    if(!ime || !prezime || !godine_staza || !pozicija){
        return res.status(400).json({ error: 'Svi podaci su obavezni: ime, prezime, godine_staza, pozicija' });
    }
    if(typeof ime !== 'string' || typeof prezime !== 'string'){
        return res.status(400).json({ error: 'Ime i prezime moraju biti stringovi' });
    }
    if(isNaN(parseInt(godine_staza, 10))){
        return res.status(400).json({ error: 'Godine staža moraju biti broj' });
    }

    const zaposlenici = await dohvatiZaposlenike();
    const noviZaposlenik = {
        id: zaposlenici.length ? zaposlenici[zaposlenici.length - 1].id + 1 : 1,
        ime,
        prezime,
        godine_staza: parseInt(godine_staza, 10),
        pozicija,
    };

    zaposlenici.push(noviZaposlenik);
    await spremiZaposlenika(zaposlenici);

    res.status(201).json(noviZaposlenik);
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});