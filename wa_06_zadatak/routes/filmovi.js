import express from 'express';
import { validationResult } from 'express-validator';
import { validirajFilm, validirajId, validirajGodinuFilma } from '../middleware/validacijaMiddleware.js';

const router = express.Router();

const filmovi = [
  { id: 4222334, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', director: 'Frank Darabont' },
  { id: 5211223, title: 'The Godfather', year: 1972, genre: 'Crime', director: 'Francis Ford Coppola' },
  { id: 4123123, title: 'The Dark Knight', year: 2008, genre: 'Action', director: 'Christopher Nolan' }
];

router.get('/', validirajGodinuFilma(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { min_year, max_year } = req.query;
    let rezultat = filmovi;
    if(min_year){
        rezultat = rezultat.filter(film => film.year >= min_year);
    }
    if(max_year){
        rezultat = rezultat.filter(film => film.year <= max_year);
    }
    res.json(rezultat);
});

router.get('/:id', validirajId(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const film = filmovi.find(f => f.id === parseInt(req.params.id));
    if(!film){
        return res.status(404).json({ errors: [{ msg: 'Film nije pronađen!' }] });
    }
    res.json(film);
});

router.post('/', validirajFilm(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, year, genre, director } = req.body;
    const noviFilm = { id: Date.now(), title, year, genre, director };
    filmovi.push(noviFilm);
    res.status(201).json(noviFilm);
});

router.patch('/:id', validirajId(), validirajFilm(), (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const filmId = parseInt(req.params.id);
    const film = filmovi.find(f => f.id === filmId);
    if(!film){
        return res.status(404).json({ errors: [{ msg: 'Film nije pronađen' }] });
    }
    const { title, year, genre, director } = req.body;
    if(title) film.title = title;
    if(year) film.year = year;
    if(genre) film.genre = genre;
    if(director) film.director = director;
    res.json({ msg: 'Film ažuriran', film });
});

export default router;