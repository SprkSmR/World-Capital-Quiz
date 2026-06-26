import express from "express";
import bodyParser from "body-parser";
import pkg from 'pg';
const { Client } = pkg;

const app = express();
const port = 3000;
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "countries",
  password: "7117",
  port: 5432
});

db.connect();

const query = "SELECT * FROM capitals";
let quiz = [];

db.query(query, (err, res) => {
  if (err) {
    console.log(err);
    return;
  } else{
    quiz = res.rows;
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if ((currentQuestion.capital ? currentQuestion.capital.toLowerCase() : currentQuestion.capital) === (answer ? answer.toLowerCase() :  answer)) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
