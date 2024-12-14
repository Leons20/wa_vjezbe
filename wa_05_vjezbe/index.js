import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';

const app = express();
const PORT = 3000;

let db = await connectToDatabase();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Pizza app');
});

app.get("/pizze", async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let svePizze = await pizze_collection.find().toArray();
    res.status(200).json(svePizze);
});

app.get("/pizze/:naziv", async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv = req.params.naziv;
    let pizza = await pizze_collection.find({ naziv: naziv }).toArray();
    res.status(200).json(pizza);
});

app.post("/pizze", async (req, res) => {
    let podaci = req.body;
    let key = Object.keys(podaci);
    for(let k of ["naziv", "cijena", "sastojci", "slika"]){
        if(!key.includes(k)) return res.status(400).json("Moraju se proslijediti svi podaci!");
    }
    if(typeof podaci.cijena !== 'number') return res.status(400).json("Cijena mora biti broj!");
    if(podaci.cijena <= 0) return res.status(400).json("Cijena mora biti veća od nule!");
    if(!podaci.sastojci || podaci.sastojci.length === 0){
        return res.status(400).json("Morate unijeti barem jedan sastojak!");
    }
    if(!podaci.sastojci.every(sastojak => typeof sastojak === 'string')){
        return res.status(400).json("Svaki sastojak mora biti string!");
    }
    let pizze_collection = db.collection('pizze');
    let result = await pizze_collection.insertOne(podaci);
    res.status(200).json(result);
});

app.post("/narudzba", async (req, res) => {
    let narudzba = req.body;
    for(let k of ["ime", "adresa", "telefon", "pizza_stavke"]){
        if(!Object.keys(narudzba).includes(k)) return res.status(400).json("Moraju se proslijediti svi podaci!");
    }
    if(typeof(narudzba.telefon) !== 'string' && typeof(narudzba.telefon) !== 'number'){
        return res.status(400).json("Telefon mora biti broj ili string!");
    }
    if(!narudzba.pizza_stavke.every(stavka => 
            typeof(stavka.naziv) === 'string' && 
            typeof(stavka.kolicina) === 'number' &&
            ['mala', 'srednja', 'velika'].includes(stavka.velicina))
    ) return res.status(400).json("Stavke moraju imati ispravne podatke!");
    let ukupnaCijena = 0;
    for(let stavka of narudzba.pizza_stavke){
        let pizze_collection = db.collection('pizze');
        let pizza = await pizze_collection.findOne({ naziv: stavka.naziv });
        if(!pizza) return res.status(400).json(`Pizza s nazivom ${stavka.naziv} ne postoji!`);
        let cijenaPoKom = pizza.cijena;
        ukupnaCijena += cijenaPoKom * stavka.kolicina;
    }
    narudzba.ukupna_cijena = ukupnaCijena;
    let narudzbe_collection = db.collection('pizza_narudzbe');
    try{
        let result = await narudzbe_collection.insertOne(narudzba);
        res.status(200).json(result);
    } catch(error){
        console.error("Greška prilikom dodavanja narudžbe:", error);
        res.status(500).json({ error: "Greška prilikom dodavanja narudžbe" });
    }
});

app.listen(PORT, error => {
    if(error){
        console.log('Greška prilikom pokretanja servera', error);
    }
    console.log(`Pizza poslužitelj radi na http://localhost:${PORT}`);
});