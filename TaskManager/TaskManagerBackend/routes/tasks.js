import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const db = await connectToDatabase();

let tasks = [
    {
        naslov: "Kupiti kruh",
        opis: "Idi kupiti kruh danas",
        zavrsen: false,
        tags: ["pomalo"],
    },
    {
        naslov: "Naučiti Vue.js",
        opis: "Prouči malo Vue.js dokumentaciju",
        zavrsen: false,
        tags: ["hitno", "faks"],
    },
    {
        naslov: "Riješi zadaću iz UPP-a",
        opis: "Please natjeraj se riješiti zadaću iz UPP-a, moraš i taj kolegij proći!",
        zavrsen: false,
        tags: ["hitno", "faks"],
    },
];

router.get("/", async (req, res) => {
    try{
        const tasks = await db.collection('tasks').find().toArray();
        const tasksWithId = tasks.map(task => ({
            ...task,
            _id: task._id.toString()
        }));
        res.status(200).json(tasksWithId);
    } catch(error){
        res.status(500).json(error);
    }
});

router.post("/", async (req, res) => {
    const { naslov, opis, zavrsen, tags } = req.body; 
    try{
        const newTask = {
            naslov,
            opis,
            zavrsen: zavrsen || false, 
            tags: tags || [] 
        };

        const result = await db.collection('tasks').insertOne(newTask);

        res.status(200).json({ insertedId: result.insertedId.toString() });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Greška prilikom dodavanja zadatka!", error });
    }
});

router.patch("/:id", async (req, res) => {
    const taskId = req.params.id;
    try{
        if(!ObjectId.isValid(taskId)){
            return res.status(400).json({ message: "Neispravan ID!" });
        }

        const result = await db.collection('tasks').updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { zavrsen: true } }
        );

        if(result.modifiedCount === 1){
            res.status(200).json({ message: "Ispravljeno!" });
        } else{
            res.status(404).json({ message: "Taj zadatak ne postoji!" });
        }
    } catch(error){
        console.error("Pogreška:", error);
        res.status(500).json({ message: "Pogreška:", error });
    }
});

router.delete("/:id", async (req, res) => {
    const taskId = req.params.id;
    try{
        if(!ObjectId.isValid(taskId)){
            return res.status(400).json({ message: "Neispravan ID!" });
        }

        const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });

        if(result.deletedCount === 1){
            res.status(200).json({ message: "Obrisano!" });
        } else{
            res.status(404).json({ message: "Taj zadatak ne postoji!" });
        }
    } catch(error){
        console.error("Pogreška:", error);
        res.status(500).json({ message: "Pogreška:", error });
    }
});

export default router;