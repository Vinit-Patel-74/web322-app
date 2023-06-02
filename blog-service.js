const fs = require('fs');
const path = require('path');

let posts = [];
let categories = [];

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function initialize() {
  return new Promise((resolve, reject) => {
    const postsPath = path.join(__dirname, 'data', 'posts.json');
    const categoriesPath = path.join(__dirname, 'data', 'categories.json');

    readFileAsync(postsPath)
      .then(data => {
        posts = data;
        return readFileAsync(categoriesPath);
      })
      .then(data => {
        categories = data;
        resolve();
      })
      .catch(err => {
        reject(`Unable to read file: ${err}`);
      });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject('No results returned');
    } else {
      resolve(posts);
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published);
    if (publishedPosts.length === 0) {
      reject('No results returned');
    } else {
      resolve(publishedPosts);
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No results returned');
    } else {
      resolve(categories);
    }
  });
}

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
};
