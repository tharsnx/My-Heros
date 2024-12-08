const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const data_test = [
  { id: 1, localized_name: 'Anti-Mage', name: 'antimage' },
  { id: 2, localized_name: 'Axe', name: 'axe' },
  { id: 3, localized_name: 'Bane', name: 'bane' },
  { id: 4, localized_name: 'saran', name: 'sssss' },
  { id: 5, localized_name: 'title', name: 'cccc' }
];

app.get('/api/heroes', (req, res) => {
  res.json(data_test);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
