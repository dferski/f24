import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/api/rate/:date', async (req, res) => {
  const { date } = req.params;
  const url = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${date}/?format=json`;

  console.log(`Making request to NBP API for date: ${date}`);
  try {
    const response = await fetch(url);
    console.log(`Received response from NBP API for date: ${date} - Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`Data received for ${date}:`, data);
      res.json(data);
    } else {
      console.error(`Error with request to NBP API for date: ${date} - Status: ${response.status}, StatusText: ${response.statusText}`);
      res.status(response.status).json({ error: 'Failed to fetch data', statusCode: response.status, statusText: response.statusText });
    }
  } catch (error) {
    console.error(`Server error when fetching from NBP API for date: ${date}`, error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
