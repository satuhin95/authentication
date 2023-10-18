const express = require('express');
const bodyParser = require('body-parser');
const router = require('./route.js')
const router 





const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(router)




// Define Routes
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
