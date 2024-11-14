import express from 'express';
import nekretnine from './nekretnine.js';

const router = express.Router();

let ponude = [];
let idNovePonude = 1;

router.post('/', (req, res) => {
    const { idNekretnine, ime, prezime, ponudjenaCijena, brojTelefona } = req.body;

    if(!idNekretnine || !ime || !prezime || ponudjenaCijena == null || !brojTelefona){
        return res.status(400).json({ message: 'Nedostaju potrebni podaci.' });
    }

    if(isNaN(idNekretnine) || ponudjenaCijena < 0){
        return res.status(400).json({ message: 'ID nekretnine mora biti broj, a ponuđena cijena mora biti pozitivna.' });
    }

    const nekretnina = nekretnine.find(n => n.id === idNekretnine);

    if(!nekretnina){
        return res.status(404).json({ message: 'Nekretnina nije pronađena.' });
    }

    const novaPonuda = { id: idNovePonude++, idNekretnine, ime, prezime, ponudjenaCijena, brojTelefona };
    ponude.push(novaPonuda);
    res.status(201).json(novaPonuda);
});

router.get('/', (req, res) => {
    res.status(200).json(ponude);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({ message: 'ID mora biti broj.' });
    }

    const ponuda = ponude.find(p => p.id === id);

    if(ponuda){
        res.status(200).json(ponuda);
    } else {
        res.status(404).json({ message: 'Ponuda nije pronađena.' });
    }
});

export default router;