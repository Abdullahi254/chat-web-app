<<<<<<< HEAD
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
=======
// entry to server
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });


const PORT = process.env.PORT || 5000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> c8ff33b (updated authentication)
