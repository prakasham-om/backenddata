const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://rohitsahoo866:prakash1998@cluster0.tynrt9h.mongodb.net/dataneuron?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define data schema
const dataSchema = new mongoose.Schema({
  content: String
});

const Data = mongoose.model('Data', dataSchema);

app.use(bodyParser.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.findOne();
    res.json(data ? data.content : '');
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/data', async (req, res) => {
  const { content } = req.body;
  try {
    await Data.findOneAndUpdate({}, { content }, { upsert: true });
    res.status(201).send('Data added successfully');
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('Internal server error');
  }
});

app.put('/api/data', async (req, res) => {
  const { content } = req.body;
  try {
    await Data.findOneAndUpdate({}, { content });
    res.send('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
