const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const PLAYFAB_API_URL = "https://titleId.playfabapi.com";
const TITLE_ID = "YOUR_PLAYFAB_TITLE_ID";

app.post('/login', async (req, res) => {
  const { username, password, titleId } = req.body;
  try {
    const response = await fetch(`${PLAYFAB_API_URL}/Client/LoginWithPlayFab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TitleId: titleId, Username: username, Password: password })
    });
    const result = await response.json();
    if (result.code === 200) {
      res.json({ success: true, sessionTicket: result.data.SessionTicket });
    } else {
      res.json({ success: false, errorMessage: result.errorMessage });
    }
  } catch (error) {
    res.json({ success: false, errorMessage: error.message });
  }
});

app.post('/addOrUpdateEmail', async (req, res) => {
  const { email, sessionTicket } = req.body;
  try {
    const response = await fetch(`${PLAYFAB_API_URL}/Client/AddOrUpdateContactEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionTicket
      },
      body: JSON.stringify({ EmailAddress: email })
    });
    const result = await response.json();
    if (result.code === 200) {
      res.json({ success: true });
    } else {
      res.json({ success: false, errorMessage: result.errorMessage });
    }
  } catch (error) {
    res.json({ success: false, errorMessage: error.message });
  }
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
