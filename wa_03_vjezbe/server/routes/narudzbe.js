import express from "express";
const router = express.Router();

class Narudzba{
    constructor(id, naruceni_proizvodi){
        this.id = id;
        this.naruceni_proizvodi = naruceni_proizvodi;
    }
    get ukupnaCijena(){
        let ukupno = this.naruceni_proizvodi.reduce((suma, trenutni_proizvod) => {
            let pronadeni_proizvod = proizvodi.find(p => p.id == trenutni_proizvod.id);
            console.log(pronadeni_proizvod);
            return suma + pronadeni_proizvod.cijena * trenutni_proizvod.narucena_kolicina;
        }, 0);
        return ukupno;
    }
}

let narudzbe = [];

router.post("/", (req, res) => {
    let podaci = req.body;
    let naruceni_proizvodi = podaci.naruceni_proizvodi;
    if(!Array.isArray(naruceni_proizvodi) || naruceni_proizvodi.length == 0){
        return res.status(400).json({ message: "Nema podataka" });
    }
    let id_nove_narudzbe = narudzbe.length ? narudzbe.at(-1).id + 1 : 1;
    const narudzba_obj = new Narudzba(id_nove_narudzbe, naruceni_proizvodi);
    console.log(narudzba_obj);
    narudzbe.push(narudzba_obj);
    return res.status(201).json(podaci);
});

export default router;