import express from 'express';
const router = express.Router();

let narudzbe = [];

router.post('/', (req, res) => {
    const { narudzba, prezime, adresa, broj_telefona } = req.body;

    if(!narudzba || !prezime || !adresa || !broj_telefona){
        return res.status(400).json({ message: 'Niste poslali sve potrebne podatke za narudžbu!' });
    }

    let ukupno = 0;
    const nazivi = [];
    const pizze = [
        { id: 1, naziv: "Margerita", cijena: 7.0 },
        { id: 2, naziv: "Capricciosa", cijena: 9.0 },
        { id: 3, naziv: "Šunka sir", cijena: 8.0 },
        { id: 4, naziv: "Vegetariana", cijena: 12.0 },
        { id: 5, naziv: "Quattro formaggi", cijena: 15.0 }
    ];

    for(const stavka of narudzba){
        const { pizza, velicina, kolicina } = stavka;

        if(!pizza || !velicina || !kolicina){
            return res.status(400).json({ message: 'Svaka stavka mora imati naziv pizze, veličinu i količinu!' });
        }

        const narucenaPizza = pizze.find(p => p.naziv === pizza);

        if(!narucenaPizza){
            return res.status(404).json({ message: `Pizza ${pizza} ne postoji u jelovniku.` });
        }

        ukupno += narucenaPizza.cijena * kolicina;
        nazivi.push(`${pizza} (${velicina})`);
    }

    const novaNarudzba = { id: narudzbe.length + 1, narudzba, prezime, adresa, broj_telefona, ukupno };
    narudzbe.push(novaNarudzba);

    const poruka = {
        message: `Vaša narudžba za ${nazivi.join(" i ")} je uspješno zaprimljena!`,
        prezime,
        adresa,
        ukupna_cijena: ukupno
    };

    res.status(201).json(poruka);
});

router.get('/', (req, res) => {
    res.status(200).json(narudzbe);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(isNaN(id)){
        return res.status(400).json({ message: 'Proslijedili ste ID koji nije broj.' });
    }

    const narudzba = narudzbe.find(n => n.id === id);

    if(!narudzba){
        return res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
    }

    res.status(200).json(narudzba);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(isNaN(id)){
        return res.status(400).json({ message: 'Proslijedili ste ID koji nije broj.' });
    }

    const index = narudzbe.findIndex(n => n.id === id);

    if(index === -1){
        return res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
    }

    narudzbe.splice(index, 1);
    res.status(200).json({ message: 'Narudžba uspješno obrisana.' });
});

export default router;