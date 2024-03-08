const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());
mongoose.connect('mongodb+srv://rohitsahoo866:prakash1998@cluster0.tynrt9h.mongodb.net/counter?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const Data = mongoose.model('Data', {
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  addCount: { type: Number, default: 0 },
  updateCount: { type: Number, default: 0 }
});

app.use(bodyParser.json());

app.post('/api/data/add', async (req, res) => {
  try {
    const newData = new Data({
      name: req.body.name,
      description: req.body.description
    });

    const savedData = await newData.save();
    res.json(savedData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update data route
app.put('/api/data/update/:id', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          updatedAt: Date.now(),
          $inc: { updateCount: 1 }
        }
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json(updatedData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Count route
app.get('/api/data/count', async (req, res) => {
  try {
    const addCount = await Data.countDocuments();
    const updateCount = await Data.aggregate([{ $group: { _id: null, total: { $sum: "$updateCount" } } }]);
    res.json({ addCount, updateCount: updateCount.length > 0 ? updateCount[0].total : 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
