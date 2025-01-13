import express from 'express';
import { validationResult } from 'express-validator';
import { validirajGlumca, validirajId, validirajImeGlumca } from '../middleware/validacijaMiddleware.js';

const router = express.Router();

const glumci = [
  { id: 123, name: 'Morgan Freeman', birthYear: 1937, movies: [4222334] },
  { id: 234, name: 'Marlon Brando', birthYear: 1924, movies: [5211223] },
  { id: 345, name: 'Al Pacino', birthYear: 1940, movies: [5211223] }
];

router.get('/', validirajImeGlumca(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const name = req.query.name ? req.query.name.trim() : null;
    let rezultat = glumci;
    if(name){
        rezultat = rezultat.filter(glumac => glumac.name.toLowerCase().includes(name.toLowerCase()));
    }
    res.json(rezultat);
});

router.get('/:id', validirajId(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const glumac = glumci.find(g => g.id === parseInt(req.params.id));
    if(!glumac){
        return res.status(404).json({ errors: [{ msg: 'Glumac nije pronađen!' }] });
    }
    res.json(glumac);
});

router.post('/', validirajGlumca(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, birthYear } = req.body;
    const noviGlumac = { id: Date.now(), name, birthYear, movies: [] };
    glumci.push(noviGlumac);
    res.status(201).json(noviGlumac);
});

router.patch('/:id', validirajId(), validirajGlumca(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const glumacId = parseInt(req.params.id);
    const glumac = glumci.find(g => g.id === glumacId);
    if(!glumac){
        return res.status(404).json({ errors: [{ msg: 'Glumac nije pronađen' }] });
    }
    const { name, birthYear } = req.body;
    if(name) glumac.name = name;
    if(birthYear) glumac.birthYear = birthYear;
    res.json({ msg: 'Glumac ažuriran', glumac });
});

export default router;