import express from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { connectToDatabase } from "../db.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const db = await connectToDatabase();
const kolekcijaKorisnika = db.collection("users");

async function hashPassword(plainPassword, saltRounds) {
    try{
        let hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch(err){
        console.error(`Greška u hashiranju lozinke: ${err}`);
        return null;
    }
}

async function checkPassword(plainPassword, hashedPassword) {
    try{
        let result = await bcrypt.compare(plainPassword, hashedPassword);
        return result;
    } catch(err){
        console.error(`Greška u uspoređivanju lozinki: ${err}`);
        return false;
    }
}

async function generateJWT(payload) {
    try{
        let token = jwt.sign(payload, JWT_SECRET);
        return token;
    } catch(err){
        console.error(`Greška u generiranju JWT tokena: ${err}`);
        return null;
    }
}

async function verifyJWT(token) {
    try{
        let decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch(err){
        console.error(`Greška u verificiranju JWT tokena: ${err}`);
        return null;
    }
}

router.post("/registriraj", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({ message: "Username ili password su obavezni!" });
    }
    const postojeciKorisnik = await kolekcijaKorisnika.findOne({ username });
    if(postojeciKorisnik){
        return res.status(409).json({ message: "Username već postoji!" });
    }
    const hashed_password = await hashPassword(password, 10);
    if(!hashed_password){
        return res.status(500).send("Greška u hashiranju lozinke!");
    }
    const noviKorisnik = { username, password: hashed_password };
    try{
        const result = await kolekcijaKorisnika.insertOne(noviKorisnik);
        return res.status(201).json({
        message: "Korisnik uspješno registriran!",
        user: { id: result.insertedId, username: noviKorisnik.username },
        });
    } catch(err){
        console.error(`Greška pri ubacivanju korisnika u bazu: ${err}`);
        return res.status(500).json({ message: "Interna serverska greška" });
    }
});

router.post('/prijavi', async (req, res) => {
    const { username, password } = req.body;
    const korisnik = await kolekcijaKorisnika.findOne({ username });
    if(!korisnik){
        return res.status(401).send('Neuspješna autentifikacija!');
    }
    const ispravnaLozinka = await checkPassword(password, korisnik.password);
    if(!ispravnaLozinka){
        return res.status(401).send('Neuspješna autentifikacija!');
    }
    let token = await generateJWT({ id: user._id, username: korisnik.username });
    if(!token){
        return res.status(500).json({ message: "Greška u generiranju JWT tokena" });
    }
    return res.status(200).json({ jwt_token: token });
});

export default router;
export { verifyJWT, generateJWT, checkPassword, hashPassword };