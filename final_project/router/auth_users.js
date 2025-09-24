const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const validUsername = users.find( user=> user.username === username);
    if (validUsername.length > 0) return true;
    else return false;
}

const authenticatedUser = (username, password)=>{ //returns boolean
        // Filter the users array for any user with the same username and password
        const validUser = users.filter((user) => {
            return (user.username === username && user.password === password);
        });
        // Return true if any valid user is found, otherwise false
        if (validUser.length > 0) {
            return true;
        } else {
            return false;
        }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password}= req.body;

  if (!username) {
      return res.status(404).json({message: "Username is missing"});
  }
  if (!password) {
    return res.status(404).json({message: "Password is missing"});
  }

//   //  Check if the username is valid
//   if(!isValid(username)) {
//         return res.status(409).json({message: "User with Username does not exist"});
//     }

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const {username} = req.session.authorization;
    
    const bookToReview = books[isbn];

    if (!bookToReview) {
        return res.status(404).json({ message: "Book not found!" });
      }
    
    if (!review) {
        return res.status(400).json({ message: "Review is required!" });
      }

    bookToReview.reviews[username] = review;

    return res.status(200).json({message: "Review successfully added", bookToReview});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const {username} = req.session.authorization;

    const bookToReview = books[isbn];
    const bookReviews = bookToReview.reviews
    if (!bookReviews[username]) {
        return res.status(404).json({ message: "No review found for this user!" });
      }

      delete bookReviews[username];

      return res.status(200).json({
        message: "Review deleted successfully!",
        reviews: bookToReview
      }); 

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
