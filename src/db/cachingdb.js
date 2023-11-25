const NodeCache = require('node-cache');

/**
 * A simple in-memory cache using the NodeCache library.
 * @type {NodeCache}
 */
const cachingdb = new NodeCache();

/**
 * Export the NodeCache instance for caching purposes.
 * @type {NodeCache}
 */
module.exports = cachingdb;
