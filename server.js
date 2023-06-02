
const express = require('express');
const app = express();
const blogService = require('./blog-service');

const port = process.env.PORT || 8080;
app.use(express.static('public/css'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname+'/views/about.html');
});

app.get('/shop', (req, res) => {
    blogService.getPublishedItems()
      .then((publishedItems) => {
        res.json(publishedItems);
      })
      .catch((error) => {
        res.json({ message: error });
      });
  });
  
  app.get('/items', (req, res) => {
    blogService.getAllItems()
      .then((allItems) => {
        res.json(allItems);
      })
      .catch((error) => {
        res.json({ message: error });
      });
  });
  
  app.get('/categories', (req, res) => {
    blogService.getCategories()
      .then((allCategories) => {
        res.json(allCategories);
      })
      .catch((error) => {
        res.json({ message: error });
      });
  });
  

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

blogService.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Initialization error:', error);
  });
