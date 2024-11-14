import express from 'express';
const router = express.Router();

const pizze = [
    { id: 1, naziv: "Margerita", cijena: 7.0 },
    { id: 2, naziv: "Capricciosa", cijena: 9.0 },
    { id: 3, naziv: "Šunka sir", cijena: 8.0 },
    { id: 4, naziv: "Vegetariana", cijena: 12.0 },
    { id: 5, naziv: "Quattro formaggi", cijena: 15.0 }
];

// Dohvaćanje svih pizza
router.get('/', (req, res) => {
    res.status(200).json(pizze);
});

// Dohvaćanje pizze po ID-u
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id)){
        return res.status(400).json({ message: 'Proslijedili ste ID koji nije broj.' });
    }

    const pizza = pizze.find(p => p.id === id);

    if(!pizza){
        return res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });
    }

    res.status(200).json(pizza);
});

export default router;