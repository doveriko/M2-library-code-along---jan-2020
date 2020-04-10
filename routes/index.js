const express = require("express");
const router = express.Router();

const Book = require("../models/book");
const Author = require("../models/author");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/books", (req, res, next) => {
  Book.find({})
    .then((books) => {
      res.render("books", { books });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/books/:bookId", (req, res, next) => {
  let bookId = req.params.bookId;

  if (!/^[0-9a-fA-F]{24}$/.test(bookId)) {
    return res.status(404).render("not-found");
  }

  Book.findOne({ _id: bookId })
    .populate("author")
    .then((book) => {
      if (!book) {
        return res.status(404).render("not-found");
      }
      res.render("book-details", { book });
    })
    .catch(next);
});

router.get("/book/add", (req, res, next) => {
  res.render("book-add");
});

router.post("/book/add", (req, res, next) => {
  const { title, description, rating } = req.body;
  const newBook = new Book({ title, description, rating });
  newBook
    .save()
    .then(() => {
      res.redirect("/books", { newBook });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/books/edit/:bookId", (req, res, next) => {
  Book.findOne({ _id: req.params.bookId })
    .populate("author")
    .then((book) => {
      res.render("book-edit", { book });
    })
    .catch((error) => {
      console.log(error);
    });
});

// router.get('/books/edit', (req, res, next) => {

//   Book.findOne({_id: req.query.book_id})
//   .then((book) => {
//     res.render("book-edit", {book});
//   })
//   .catch((error) => {
//     console.log(error);
//   })

// });

router.post("/books/edit/:bookId", (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const oneBook = req.params.bookId;
  Book.update(
    { _id: oneBook },
    { $set: { title, author, description, rating } },
    { new: true }
  )
    .then((book) => {
      res.redirect("/books");
    })
    .catch((error) => {
      console.log(error);
    });
});



// router.post('/books/edit', (req, res, next) => {
//   const { title, author, description, rating } = req.body;
//   Book.update({_id: req.query.book_id}, { $set: {title, author, description, rating }}, { new: true })
//   .then((book) => {
//     res.redirect('/books');
//   })
//   .catch((error) => {
//     console.log(error);
//   })
// });

router.get("/authors/add", (req, res, next) => {
  res.render("user-add");
});

router.post("/authors/add", (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({
    name,
    lastName,
    nationality,
    birthday,
    pictureUrl,
  });
  newAuthor
    .save()
    .then((book) => {
      res.redirect("/books");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments }}})
  .then(book => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});


module.exports = router;
