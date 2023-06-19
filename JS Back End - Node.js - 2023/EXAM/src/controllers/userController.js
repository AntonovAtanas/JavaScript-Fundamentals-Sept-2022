const router = require('express').Router();

const userManager = require('../managers/userManager');

const { errorMessageHandler } = require('../utils/errorMessageHandler');

const { limitUser } = require('../middlewares/authMiddleware')

router.get('/register', limitUser, (req, res) => {
    res.render('./user/register');
});

router.post('/register', limitUser, async (req, res) => {
    const { email, password, repeatPassword } = req.body;

    try {
        const token = await userManager.register({ email, password, repeatPassword });

        res.cookie('auth', token, { httpOnly: true });

    } catch (error) {
        const errorMessage = errorMessageHandler(error)
        return res.render('./user/register', { errorMessage });
    }

    res.redirect('/');
});

router.get('/login', limitUser, (req, res) => {
    res.render('./user/login')
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userManager.login(email, password);

        res.cookie('auth', token, { httpOnly: true });

    } catch (error) {
        return res.render('./user/login', { errorMessage: errorMessageHandler(error) })
    }

    res.redirect('/')
});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
})

module.exports = router;