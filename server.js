/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Vinitkumar Kishorbhai Patel
 Student ID:166164210
  Date: 2023-06-02
*
* Cyclic Web App URL: https://tame-plum-hen-wrap.cyclic.app/
*
* GitHub Repository URL: 
*
********************************************************************************/ 

const express = require('express');
const blogService = require('./blog-service');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get('/blog', (req, res) => {
  res.send('Welcome to the blog!');
});

app.get('/posts', (req, res) => {
  blogService
    .getAllPosts()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ message: err });
    });
});

app.get('/categories', (req, res) => {
  blogService
    .getCategories()
    .then(categories => {
      res.json(categories);
    })
    .catch(err => {
      res.status(404).json({ message: err });
    });
});

blogService
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
