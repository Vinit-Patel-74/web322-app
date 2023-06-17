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
* Cyclic Web App URL:https://glamorous-monkey.cyclic.app/
*
* GitHub Repository URL: https://github.com/Vinit-Patel-74/web322-app.git
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const blogService = require('./blog-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); // no { storage: storage } 
const app = express();
const port = 8080;

cloudinary.config({
cloud_name: 'ddfmvmmun',
api_key: '274794287671495',
api_secret: 'AiuffCwawcUnmOtScGbyrW8OohI',
secure: true});

app.post('/posts/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    upload(req)
      .then((uploaded) => {
        processPost(uploaded.url);
      })
      .catch((error) => {
        console.error(error);
        processPost('');
      });
  } else {
    processPost('');
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    
    console.log(req.body);
    res.redirect('/posts');
  }
});

app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'addPost.html'));
});


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