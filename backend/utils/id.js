const crypto = require('crypto');

/** UUID v4 compatible with Node crypto (avoids ESM uuid package in Jest). */
function uuidv4() {
    return crypto.randomUUID();
}

module.exports = { uuidv4 };
