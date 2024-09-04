const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/webhooks', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Definir el esquema y modelo de Mongoose
const webhookSchema = new mongoose.Schema({
    data: Object,
    receivedAt: { type: Date, default: Date.now }
});

const Webhook = mongoose.model('Webhook', webhookSchema);

// Endpoint para recibir webhooks
app.post('/webhook', async (req, res) => {
    try {
        const newWebhook = new Webhook({ data: req.body });
        await newWebhook.save();
        res.status(200).send('Webhook received and saved');
    } catch (err) {
        console.error('Error saving webhook:', err);
        res.status(500).send('Internal Server Error');
    }
});
