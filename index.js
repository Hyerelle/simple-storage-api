/**
 * Get the wrapper connector
 */
const wrapper = require("./lowdb-wrapper");

/**
 * Get the port number value from the 'PORT' environment variable
 *  - If not set : default is 3333
 */
const port = process.env.PORT || 3333;

// Stringify shortener ...
const s9y = JSON.stringify;

/**
 * Launch Polka server
 *  -- https://github.com/lukeed/polka
 */
const polka = require("polka");
const middlewares = require("./middlewares");
polka()
  // pass middlewares
  .use(...middlewares)

  // GET route
  .get("/:database/:collection/:ids?", (req, res) => {
    // get request info
    const { database, collection, ids } = req.params;
    // get results
    const results = wrapper.getByIds(database, collection, ids);
    // response
    res.end(s9y(ids && results.length === 1 ? results[0] : results));
  })

  // POST route
  .post("/:database/:collection", (req, res) => {
    // get request info
    const { body } = req;
    const { database, collection } = req.params;
    // find or create element
    const element = wrapper.insertOrUpdate(database, collection, body);
    // response
    res.end(s9y(element));
  })

  // DELETE route
  .delete("/:database/:collection/:ids", (req, res) => {
    // get request info
    const { database, collection, ids } = req.params;
    // remove 'ids'
    wrapper.removeByIds(database, collection, ids);
    // response
    res.end(
      s9y({
        message: `${ids.split(",").length} removed`,
        removed: ids.split(",")
      })
    );
  })

  // other routes
  .get("*", (req, res) => ((res.statusCode = 204), res.end()))

  .listen(port)
  .then(_ => console.log(`> Running on http://localhost:${port}`));
