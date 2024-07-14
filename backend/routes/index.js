// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

/*
    -- INITIAL TEST ROUTE --
router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});
*/


// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

router.use('/api', apiRouter);

//===========================================================================================

/*

    In development, you need another way to get the XSRF-TOKEN cookie on your frontend application
        -> because the React frontend is on a different server than the Express backend.

    To solve this, add a backend route,
        -> GET /api/csrf/restore in the same file that can be accessed only in development and will restore the XSRF-TOKEN cookie.

*/

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.json({});
    });
}


/*
    - In development, the backend and frontend servers are separate.

    - In production though, the backend also serves up all the frontend assets,
      including the index.html and any JavaScript files in the frontend/build folder
      after running npm run build in the frontend folder.

    In production, the XSRF-TOKEN will be attached to the index.html file in the frontend/dist folder.

    In the backend/routes/index.js file, serve the index.html file at the / route and any routes that don't start with /api.
        -> Along with it, attach the XSRF-TOKEN cookie to the response

     Serve the static files in the frontend/dist folder using the express.static middleware.

*/

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });

    // Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/build")));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });
}


//==========================================================================================

module.exports = router;
