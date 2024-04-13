const { Router } = require('express');
const { crearPost, obtenerPost} = require('../controllers/post');


const router = Router();

router.post(
    '/new-post', 
    [ // middlewares
    ],
    crearPost
);

router.get(
    '/obtener-post', 
    [ // middlewares
    ],
    obtenerPost
);


module.exports = router;
