const router = require('express').Router();

const auctionManager = require('../managers/auctionManager');

const { errorMessageHandler } = require('../utils/errorMessageHandler');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/catalog', async (req, res) => {

    try {
        const allAuctions = await auctionManager.getAll().lean();
        res.render('./auction/catalog', { allAuctions });
    } catch (error) {
        return res.render('./auction/catalog', { errorMessage: errorMessageHandler(error) })
    }
});

// Render create page
router.get('/create', isAuth, (req, res) => {
    res.render('./auction/create');
})

// Action on create page
router.post('/create', isAuth, async (req, res) => {
    let { title, description, category, image, price } = req.body;
    const userId = req.user?._id;

    switch (category) {
        case 'estate': category = 'Real Estate'; break;
        case 'vehicles': category = 'Vehicles'; break;
        case 'furniture': category = 'Furniture'; break;
        case 'electronics': category = 'Electronics'; break;
        case 'other': category = 'Other'; break;
    }

    try {
        await auctionManager.addAuction({ title, description, category, image, price, owner: userId })
    } catch (error) {
        return res.render('./auction/create', { errorMessage: errorMessageHandler(error) })
    }

    res.redirect('/auction/catalog')
});

// Render product page
router.get('/details/:id', async (req, res) => {
    const auctionId = req.params.id;

    try {
        const foundAuction = await auctionManager.getAuction(auctionId).lean();

        // check if user is the owner
        const isOwner = foundAuction.owner._id == req.user?._id;

        res.render('./auction/details', { foundAuction, isOwner })
    } catch (error) {
        return res.render('./auction/catalog', { errorMessage: errorMessageHandler(error) })
    }
});

// Delete
router.get('/delete/:id', isAuth, async (req, res) => {
    const productId = req.params.id;

    try {
        await auctionManager.deleteProduct(productId);
    } catch (error) {
        return res.render(`./product/catalog`, { errorMessage: errorMessageHandler(error) })
    }

    res.redirect('/product/catalog');
});

// Get edit page
router.get('/edit/:id', isAuth, async (req, res) => {
    const productId = req.params.id;

    const foundProduct = await auctionManager.getProduct(productId).lean();

    res.render('./product/edit', { foundProduct });
});

// Action on edit page
router.post('/edit/:id', isAuth, async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    try {
        await auctionManager.editProduct(productId, productData);
    } catch (error) {
        const foundProduct = await auctionManager.getProduct(productId).lean();

        return res.render('./product/edit', { errorMessage: errorMessageHandler(error), foundProduct })
    }

    res.redirect(`/product/details/${productId}`)
});

module.exports = router;