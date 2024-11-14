const express = require("express");
const path = require("path");

let app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/users", (req, res) => {
    const users = [
        { id: 1, ime: "Ivan", prezime: "Ivić" },
        { id: 2, ime: "Ana", prezime: "Anić" },
        { id: 3, ime: "Petar", prezime: "Perić" }
    ];
    res.json(users);
});

const port = 3000;
app.listen(port, (error) => {
    if(error){
        console.error("Greška!");
    } else {
        console.log(`Slušam na Portu ${port}`);
    }   
});
