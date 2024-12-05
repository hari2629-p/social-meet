const { admin } = require("../app");

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    // const idToken = req.headers.authorization;
    // if (!idToken) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    // admin.auth().verifyIdToken(idToken)
    //     .then((decodedToken) => {
    //         req.user = decodedToken;
    //         next();
    //     })
    //     .catch((error) => {
    //         console.error('Error verifying Firebase ID token:', error);
    //         return res.status(401).json({ error: 'Unauthorized' });
    //     });
    next();
};

module.exports = authenticate;
