const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Add new user OK"});
    }else{
        return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

function getAllBooks(){
    return new Promise((resolve, reject) => {
        const result = Object.values(books);
        if(result.length > 0){
            resolve(result);
        } else {
            reject("No books found");
        }
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,3));
//   return res.status(200).json({message: "Get all Books OK"});
    getAllBooks()
    .then(data => res.json(data))
    .catch(err => res.status(404).json({
        message: err
    }));
});

function getBooksByISBN(isbn){
    return new Promise((resolve, reject) => {
        const result = Object.values(books[isbn]);
        if(result.length > 0){
            resolve(result);
        } else {
            reject("No books found");
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(JSON.stringify(books[isbn],null,3));
//   return res.status(200).json({message: "Get book by ISBN OK"});
    getBooksByISBN(req.params.isbn)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({
        message: err
    }))
});

function getBooksByAuthor(author){
    return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(book => {
            return book.author.includes(author);
        });
        if(result.length > 0){
            resolve(result);
        } else {
            reject("No books found");
        }
    });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const book = Object.values(books).filter(book => {
//     return book.author === author;
//   });
//   res.send(JSON.stringify(book,null,3))
//   return res.status(200).json({message: "Get book by author OK"});
    getBooksByAuthor(req.params.author)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({
        message: err
    }))
});

function getBooksByTitle(title){
    return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(book => {
            return book.title.includes(title);
        });
        if(result.length > 0){
            resolve(result);
        } else {
            reject("No books found");
        }
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const book = Object.values(books).filter(book => book.title.includes(title));
//   res.send(JSON.stringify(book,null,3))
//   return res.status(200).json({message: "Get book by tital OK"});
    getBooksByTitle(req.params.title)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({
        message: err
    }))
});

function getBooksReview(isbn){
    return new Promise((resolve, reject) => {
        const result = books[isbn].reviews
        if(result){
            resolve(result);
        } else {
            reject("No review found");
        }
    });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  getBooksReview(req.params.isbn)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({
        message: err
    }))
});

module.exports.general = public_users;
