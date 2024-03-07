// server.js

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
  contents: [String], // Array of strings
  addCount: { type: Number, default: 0 },
  updateCount: { type: Number, default: 0 }
});

const Data = mongoose.model('Data', dataSchema);

app.use(bodyParser.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.findOne();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/data', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('Content cannot be empty');
  }
  try {
    const newData = new Data({ contents: [content], addCount: 1, updateCount: 0 });
    await newData.save();
    res.status(201).send('Data added successfully');
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('Internal server error');
  }
});

app.put('/api/data/:index', async (req, res) => {
  const { index } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('Content cannot be empty');
  }
  try {
    const result = await Data.findOneAndUpdate({}, { $set: { [`contents.${index}`]: content }, $inc: { updateCount: 1 } });
    if (!result) {
      return res.status(404).send('Data not found');
    }
    res.send('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
