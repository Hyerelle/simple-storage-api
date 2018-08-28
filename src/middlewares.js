/**
 * CORS - Used to allow cross origin requests
 *  -- https://github.com/expressjs/cors
 */
const cors = require("cors")({ origin: true });

/**
 * Body Parser - Used to handle JSON requests
 *  -- https://github.com/expressjs/body-parser
 */
const bodyParserJson = require("body-parser").json();

/**
 * Secure Request if a process.env.SECRET is setted
 *  - REFUSE request only if a 'base' is requested
 *  - AND if a 'secret' is setted
 *  - AND if the 'authorization' request header doesn't matches the 'secret'
 */
const secureRequest = (req, res, next) => {
  if (
    req &&
    req.params &&
    req.params.base &&
    process.env.SECRET &&
    process.env.SECRET !== req.headers.authorization
  )
    res.end(JSON.stringify({ error: "bad secret" }));
  else if (typeof next === "function") next();
};

/**
 * Middlewares are exported in an array :
 *  - Easy to dispatch with '...' operator
 *  - Order is kept
 */
module.exports = [cors, bodyParserJson, secureRequest];
