const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const booksArray = Object.values(books)
    const book = booksArray.filter(book=> book.author === author)
    res.send(book)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase()
    const booksArray = Object.values(books)
    const book = booksArray.filter(book=> book.title.toLowerCase() === title)
    res.send(book)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn
   const review =(books[isbn]).reviews
    res.send(review)
});

module.exports.general = public_users;
