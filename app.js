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
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/items/:id
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// GET /version
app.get('/version', (req, res) => {
  res.json({
    version: '1.1',
    updatedAt: '2026-01-18'
  });
});


// POST /api/items
app.post('/api/items', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Create failed' });
  }
});

// PUT /api/items/:id
app.put('/api/items/:id', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// PATCH /api/items/:id
app.patch('/api/items/:id', async (req, res) => {
  try {
    const patchedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patchedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(patchedItem);
  } catch (error) {
    res.status(400).json({ error: 'Patch failed' });
  }
});

// DELETE /api/items/:id
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Delete failed' });
  }
});


/* server start */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
