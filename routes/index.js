
// routes/index.js

const express = require('express');
const router = express.Router();
const Listing = require('../models/Listings'); // Dosyanın doğru konumuna göre yolu düzenleyin


router.get('/', async (req, res) => {
    try {
        // Veritabanından tüm ilanları al
        const allListings = await Listing.findAll(); // Tüm ilanları al

        // `index.ejs` dosyasına `allListings` ve diğer verileri gönder
        res.render('index', { 
            allListings: allListings, // allListings burada tanımlandı
            categories: ['Car', 'Home', 'Furniture', 'Computer', 'Watch'] 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;

