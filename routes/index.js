const express = require('express');
const router = express.Router();

const cacheMiddleware = require('../cacheMiddleware');
const fetchDataCommand = require('../fetchDataCommand');

router.get('/', (req, res, next) => {
	res.render('index', { title: 'Express' });
});

router.get('/fish/species', cacheMiddleware, fetchDataCommand);

module.exports = router;
