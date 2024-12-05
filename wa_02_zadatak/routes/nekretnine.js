import express from 'express';

const router = express.Router();

let nekretnine = [];
let idNoveNekretnine = 1;

router.get('/', (req, res) => {
    res.status(200).json(nekretnine);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({ message: 'ID mora biti broj.' });
    }

    const nekretnina = nekretnine.find(n => n.id === id);

    if(nekretnina){
        res.status(200).json(nekretnina);
    } else {
        res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }
});

router.post('/', (req, res) => {
    const { naziv, opis, cijena, lokacija, brojSoba, povrsina } = req.body;
    
    if(!naziv || !opis || cijena == null || !lokacija || brojSoba == null || povrsina == null){
        return res.status(400).json({ message: 'Nedostaju potrebni podaci.' });
    }

    if(cijena < 0 || brojSoba < 0 || povrsina < 0){
        return res.status(400).json({ message: 'Cijena, broj soba i površina moraju biti pozitivni brojevi.' });
    }

    const novaNekretnina = { id: idNoveNekretnine++, naziv, opis, cijena, lokacija, brojSoba, povrsina };
    nekretnine.push(novaNekretnina);
    res.status(201).json(novaNekretnina);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({ message: 'ID mora biti broj.' });

    const { naziv, opis, cijena, lokacija, brojSoba, povrsina } = req.body;

    const idNekretnine = nekretnine.findIndex(n => n.id === id);

    if(idNekretnine === -1){
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    if(cijena < 0 || brojSoba < 0 || povrsina < 0){
        return res.status(400).json({ message: 'Cijena, broj soba i površina moraju biti pozitivni brojevi.' });
    }

    nekretnine[idNekretnine] = { id, naziv, opis, cijena, lokacija, brojSoba, povrsina };
    res.status(200).json(nekretnine[idNekretnine]);
});

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({ message: 'ID mora biti broj.' });
    }

    const nekretnina = nekretnine.find(n => n.id === id);

    if(!nekretnina){
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    const { naziv, opis, cijena, lokacija, brojSoba, povrsina } = req.body;

    if(cijena != null && cijena < 0 || brojSoba != null && brojSoba < 0 || povrsina != null && povrsina < 0){
        return res.status(400).json({ message: 'Cijena, broj soba i površina moraju biti pozitivni brojevi.' });
    }

    if(naziv) nekretnina.naziv = naziv;
    if(opis) nekretnina.opis = opis;
    if(cijena != null) nekretnina.cijena = cijena;
    if(lokacija) nekretnina.lokacija = lokacija;
    if(brojSoba != null) nekretnina.brojSoba = brojSoba;
    if(povrsina != null) nekretnina.povrsina = povrsina;

    res.status(200).json(nekretnina);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({ message: 'ID mora biti broj.' });
    }

    const idNekretnine = nekretnine.findIndex(n => n.id === id);

    if(idNekretnine === -1){
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    nekretnine.splice(idNekretnine, 1);
    res.status(200).json({ message: 'Nekretnina je obrisana.' });
});

export default router;