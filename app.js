require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

/* env variables */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

/* mongodb connection */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB error:', error));

/* schema & model */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);

/* routes */

// GET /
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// GET /api/items
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// GET /api/items/:id
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// POST /api/items
app.post('/api/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

// PUT /api/items/:id
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// DELETE /api/items/:id
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

/* server start */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
