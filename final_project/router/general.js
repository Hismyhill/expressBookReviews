import axios from "axios";
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    // Check if both username and password are provided
    if (!username) {
        return res.status(400).json({ message: "Username is missing!" });
      } 
      if (!password) {
        return res.status(400).json({ message: "Password is missing!" });
      }

    const doesExist = (username) => {
    return users.some((user) => user.username === username);
  };

  if (!doesExist(username)) {
    // Add the new user to the users array
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(409).json({ message: "User already exists!" });
  }
});



// get all books
public_users.get('/', async (req, res) => {
  try {
    // Example: fetch books from your own endpoint
    const response = await axios.get("http://localhost:9000"); 
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  try {
    // Example: fetch books from your own endpoint
    const response = await axios.get(`http://localhost:9000/${isbn}`); 
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const booksArray = Object.values(books)
    const book = booksArray.filter(book=> book.author === author)
    res.send(book)
});

// Get all books based on title
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    const response = await axios.get(`http://localhost:5000/${author}`); // replace with your actual root endpoint
    const booksData = response.data;
  
    // Convert books object to array and filter by author
    const booksArray = Object.values(booksData);
    const book = booksArray.filter(book => book.author === author);
  
    res.send(book);
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn
   const response = await axios.get(`http://localhost:5000/review/${isbn}`); 
   const booksData = response.data;
   const reviews =(booksData).reviews
    res.send(reviews)
});

module.exports.general = public_users;
