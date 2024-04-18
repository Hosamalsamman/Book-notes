import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "159851",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let booknotes = [
  {id: 1, coverurl: "https://covers.openlibrary.org/b/olid/OL14525777M-M.jpg", review: "A good book", rating: 3},
];


app.get("/", async (req, res) => {
  const result = await db.query(`select * from book_data order by rating`);
  booknotes = result.rows;
  res.render("index.ejs", {booknotes: booknotes});
});

app.post("/edit", (req, res) => {
  console.log("edit");
  const id = req.body.editedItem;
  console.log(id);
  res.render("editItem.ejs", {id: id});
});

app.post("/editItem", async (req, res) => {
  const id = req.body.editedItem;
  const review = req.body.review;
  const rating = req.body.rating;
  try {
    await db.query(`UPDATE book_data SET review = '${review}', rating = '${rating}' WHERE id = ${id}`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
})

app.post("/delete", async (req, res) => {
  console.log("delete");
  const id = req.body.deletedItem;
  console.log(id);
  try {
    await db.query(`delete from book_data where id = ${id}`);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

app.post("/add", (req, res) => {
  res.render("newItem.ejs");
});
app.post("/submit", async (req, res) => {
  const coverurl = "https://covers.openlibrary.org/b/olid/" + req.body.coverID + "-M.jpg";
  const review = req.body.review;
  const rating = req.body.rating;
  await db.query("INSERT INTO book_data (coverurl, review, rating) VALUES ($1, $2, $3)", [coverurl, review, rating]);
  res.redirect("/");
});





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });