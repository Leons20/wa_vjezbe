import express from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../db.js";
import { verifyJWT } from "./auth.js";

const router = express.Router();
const db = await connectToDatabase();

const getUserCollection = (korisnikId) => db.collection(`tasks_${korisnikId}`);

router.get("/", async (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ greska: "Autorizacija nije prisutna ili je neispravna!" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);
    if(!decoded){
        return res.status(401).json({ greska: "Neispravan JWT token!" });
    }
    try{
        const korisnikId = decoded.id;
        const kolekcijaKorisnika = getUserCollection(korisnikId);
        const zadaci = await kolekcijaKorisnika.find({}).toArray();
        res.status(200).json(zadaci);
    } catch(error){
        res.status(500).json({ greska: "Dogodila se greška prilikom dohvaćanja zadataka:", detalji: error.message });
    }
});

router.post("/", async (req, res) => {
    const podaci = req.body;
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ greska: "Autorizacija nije prisutna ili je neispravna!" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);
    if(!decoded){
        return res.status(401).json({ greska: "Neispravan JWT token!" });
    }
    try{
        const korisnikId = decoded.id;
        const kolekcijaKorisnika = getUserCollection(korisnikId);
        const noviZadatak = {
            ...podaci,
            tags: podaci.tags && Array.isArray(podaci.tags) ? podaci.tags : [],
            createdAt: new Date(),
        };
        const result = await kolekcijaKorisnika.insertOne(noviZadatak);
        res.status(201).json({ poruka: "Zadatak uspješno dodan!", insertedId: result.insertedId });
    } catch(error){
        res.status(500).json({ greska: "Dogodila se greška prilikom dodavanja zadatka:", detalji: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ greska: "Autorizacija nije prisutna ili je neispravna!" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);
    if(!decoded){
        return res.status(401).json({ greska: "Neispravan JWT token!" });
    }
    try{
        const korisnikId = decoded.id;
        const kolekcijaKorisnika = getUserCollection(korisnikId);
        const result = await kolekcijaKorisnika.updateOne(
            { _id: new ObjectId(id) },
            { $set: { zavrsen: true } }
        );
        if(result.modifiedCount === 1){
            res.status(200).json({ message: "Zadatak završen!" });
        } else{
            res.status(404).json({ message: "Zadatak nije pronađen!" });
        }
    } catch(error){
        res.status(500).json({ greska: "Dogodila se greška:", detalji: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ greska: "Autorizacija nije prisutna ili je neispravna!" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);
    if(!decoded){
        return res.status(401).json({ greska: "Neispravan JWT token!" });
    }
    try{
        const korisnikId = decoded.id;
        const kolekcijaKorisnika = getUserCollection(korisnikId);
        const result = await kolekcijaKorisnika.deleteOne({ _id: new ObjectId(id) });
        if(result.deletedCount === 1){
            res.status(200).json({ message: "Zadatak obrisan!" });
        } else{
            res.status(404).json({ message: "Zadatak nije pronađen!" });
        }
    } catch(error){
        res.status(500).json({ greska: "Dogodila se greška:", detalji: error.message });
    }
});

export default router;