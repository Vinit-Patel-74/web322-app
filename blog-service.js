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

function writeFileAsync(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
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

function getAllPosts(category, minDate) {
  return new Promise((resolve, reject) => {
    let filteredPosts = posts;

    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (minDate) {
      const minDateObj = new Date(minDate);
      filteredPosts = filteredPosts.filter(post => new Date(post.postDate) >= minDateObj);
    }

    if (filteredPosts.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredPosts);
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

function addPost(postData) {
  return new Promise((resolve, reject) => {
    if (postData.published === undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }

    postData.id = posts.length + 1;
    posts.push(postData);

    const postsPath = path.join(__dirname, 'data', 'posts.json');
    writeFileAsync(postsPath, posts)
      .then(() => {
        resolve(postData);
      })
      .catch(err => {
        reject(`Unable to write file: ${err}`);
      });
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.category === category);
    if (filteredPosts.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredPosts);
    }
  });
}

// ...

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDateObj = new Date(minDateStr);
    const filteredPosts = posts.filter(post => new Date(post.postDate) >= minDateObj);
    
    if (filteredPosts.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredPosts);
    }
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    const post = posts.find(post => post.id === id);

    if (!post) {
      reject('No result returned');
    } else {
      resolve(post);
    }
  });
}


module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};

