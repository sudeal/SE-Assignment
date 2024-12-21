const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./db/database'); 
const Listing = require('./models/listing');    

const app = express();
const port = process.env.PORT || 5003; 

// Middleware'ler
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS Ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


sequelize.sync({ force: true }) 
    .then(() => {
        console.log('Database is successful!');
    })
    .catch(err => console.error('Connection error:', err));


// Ana Sayfa Route
app.get('/', async (req, res) => {
    try {
        const categories = ['Car', 'Computer', 'Furniture', 'Home', 'Watch'];
        const allListings = await Listing.findAll(); 
        res.render('index', { categories, allListings });
    } catch (error) {
        console.error('Homepage Error', error);
        res.status(500).send('An error occurred');
    }
});


app.get('/reset-db', async (req, res) => {
    try {
        await sequelize.sync({ force: true }); 
        res.send('Database rebuilt!');
    } catch (error) {
        console.error('Database reset error:', error);
        res.status(500).send('An error occurred.');
    }
});

// Seed Database Route'u
app.get('/seed', async (req, res) => {
    try {
        const categories = ['Car', 'Computer', 'Furniture', 'Home', 'Watch'];
        const imageLinks = {
            Car: [
                '/images/carA.jpg',
                '/images/carB.jpg',
                '/images/carC.jpg',
                '/images/carD.jpg'
            ],
            Computer: [
                '/images/computerA.jpg',
                '/images/computerB.jpg',
                '/images/computerC.jpg',
                '/images/computerD.jpg'
            ],
            Furniture: [
                '/images/furnitureA.jpg',
                '/images/furnitureB.jpg',
                '/images/furnitureC.jpg',
                '/images/furnitureD.jpg'
            ],
            Home: [
                '/images/homeA.jpg',
                '/images/homeB.jpg',
                '/images/homeC.jpg',
                '/images/homeD.jpg'
            ],
            Watch: [
                '/images/watchA.jpg',
                '/images/watchB.jpg',
                '/images/watchC.jpg',
                '/images/watchD.jpg'
            ]
        };

        // Seed işlemi
        for (const category of categories) {
            const links = imageLinks[category];
            for (let i = 0; i < links.length; i++) {
                await Listing.create({
                    title: `${category} ${i + 1}`,
                    description: `${category} description for ${i + 1}.`,
                    price: `${90000 + (i + 1) * 8000} £`,
                    city: 'Los Angeles',
                    category,
                    image: links[i] 
                });
            }
        }
        res.send('Sample advert added to the database!');
    } catch (error) {
        console.error('Seed route error:', error);
        res.status(500).send('An error occurred during seeding.');
    }
});

app.get('/detail/:id', async (req, res) => {
    try {
        const listing = await Listing.findByPk(req.params.id); 
        console.log(listing); 
        if (!listing) {
            return res.status(404).send('Advert not found.');
        }
        res.render('detail', { listing });
    } catch (error) {
        console.error('Detail page error:', error);
        res.status(500).send('An error occurred.');
    }
});


app.get('/search/:category', async (req, res) => {
    try {
        const category = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
        const listings = await Listing.findAll({ where: { category } });

        if (!listings || listings.length === 0) {
            return res.status(404).send('No listings found for this category.');
        }

        res.render('categoryPage', { category, listings });
    } catch (error) {
        console.error('Category page error:', error);
        res.status(500).send('An error occurred.');
    }
});

// Express server açılışı
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
