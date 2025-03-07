const router = require('express').Router();

const gameManager = require('../managers/gameManager');
const { errorMessageHandler } = require('../utils/errorMessageHandler');
const { isAuth } = require('../middlewares/authMiddleware');

const optionsGenerator = require('../utils/optionsGenerator');

router.get('/catalog', async (req, res) => {

    try {
        const allGames = await gameManager.allGames().lean();
        res.render('./games/catalog', { allGames });
    } catch (error) {
        return res.render('./games/catalog', { errorMessage: errorMessageHandler(error) })
    }
})

router.get('/create', isAuth, (req, res) => {
    res.render('./games/create');
})

router.post('/create', isAuth, async (req, res) => {
    const gameDetails = req.body;
    const userId = req.user?._id

    try {
        await gameManager.addGame({ ...gameDetails, owner: userId })
    } catch (error) {
        return res.render('./games/create', { errorMessage: errorMessageHandler(error) })
    }

    res.redirect('/games/catalog')
})

router.get('/details/:id', async (req, res) => {
    const gameId = req.params.id;

    try {
        const foundGame = await gameManager.getGame(gameId).lean();
        const isOwner = foundGame.owner == req.user?._id;

        // check if user has bought
        let boughtBy = foundGame.boughtBy.map(el => el.toString())
        const hasBought = boughtBy.includes(req.user?._id) && req.user;

        res.render('./games/details', { foundGame, isOwner, hasBought })
    } catch (error) {
        console.log(error)
        return res.render('./games/catalog', { errorMessage: errorMessageHandler(error) })
    }
});

router.get('/buy/:id', isAuth, async (req, res) => {
    const gameId = req.params.id;
    const userId = req.user?._id;

    try {
        await gameManager.buyGame(gameId, userId);

        res.redirect(`/games/details/${gameId}`)
    } catch (error) {
        return res.render(`./games/details/${gameId}`, { errorMessage: errorMessageHandler(error) })
    }
});

// Delete
router.get('/delete/:id', isAuth, async (req, res) => {
    const gameId = req.params.id;

    try {
        await gameManager.deleteGame(gameId);
    } catch (error) {
        return res.render(`./games/catalog`, { errorMessage: errorMessageHandler(error) })
    }

    res.redirect('/games/catalog');
});

// Get edit page
router.get('/edit/:id', isAuth, async (req, res) => {
    const gameId = req.params.id;

    const foundGame = await gameManager.getGame(gameId).lean();

    const options = optionsGenerator.optionsGenerator(foundGame.platform);

    res.render('./games/edit', { foundGame, options });
});

router.post('/edit/:id', isAuth, async (req, res) => {
    const gameId = req.params.id;
    const { name, image, price, platform, genre, description } = req.body;

    try {
        await gameManager.editGame(gameId, { name, image, price, platform, genre, description });
    } catch (error) {
        const foundGame = await gameManager.getGame(gameId).lean();

        const options = optionsGenerator.optionsGenerator(foundGame.platform);
        return res.render('./games/edit', { errorMessage: errorMessageHandler(error), foundGame, options })
    }

    res.redirect(`/games/details/${gameId}`)
});

// Search
router.get('/search', async (req, res) => {
    try {
        const allGames = await gameManager.allGames().lean();
        res.render('./games/search', { allGames });
    } catch (error) {
        return res.render('./games/search', { errorMessage: errorMessageHandler(error) })
    }
});

router.post('/search', async (req, res) => {
    const { search, platform } = req.body;

    const foundGames = await gameManager.findGame(search, platform);

    return res.render('./games/search', { allGames: foundGames });
})

module.exports = router;