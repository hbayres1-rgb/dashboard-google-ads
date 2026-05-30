const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB_PATH = path.join(__dirname, ".data", "db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ leads: 0, visitas: 0, propostas: 0, vendas: 0, custo: 0, ticket: 0, updatedAt: null }));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET dados atuais
app.get("/api/dados", (req, res) => {
  res.json(readDB());
});

// POST salvar dados
app.post("/api/dados", (req, res) => {
  const { leads, visitas, propostas, vendas, custo, ticket } = req.body;
  const db = readDB();
  if (leads    !== undefined) db.leads    = Number(leads)    || 0;
  if (visitas  !== undefined) db.visitas  = Number(visitas)  || 0;
  if (propostas!== undefined) db.propostas= Number(propostas)|| 0;
  if (vendas   !== undefined) db.vendas   = Number(vendas)   || 0;
  if (custo    !== undefined) db.custo    = Number(custo)    || 0;
  if (ticket   !== undefined) db.ticket   = Number(ticket)   || 0;
  writeDB(db);
  res.json({ ok: true, data: db });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
