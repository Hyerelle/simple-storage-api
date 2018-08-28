/**
 * Lowdb wrapper
 *  -- https://github.com/typicode/lowdb
 */
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// short id generator
const shortid = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);

/**
 * Retrieves and returns a given database / collection name.
 * If a no collection name is given, the whole database is returned.
 * @param {String} base Base name
 * @param {String} collection Collection name
 */
const getCollection = (base, collection) =>
  collection
    ? lowdb(new FileSync("./databases/" + base + ".json"))
        .defaults({ [collection]: [] })
        .get(collection)
    : lowdb(new FileSync("./databases/" + base + ".json"));

/**
 * Retrieves and returns a given database / collection
 *  - If 'ids' are given, those found are returned
 *  - If none is passed, the whole collection is returned
 * @param {String} base Base name
 * @param {String} collection Collection name
 * @param {Array} [ids] Optional - List of IDs to get
 */
const getByIds = (base, collection, ids) => {
  // get collection
  let col = getCollection(base, collection);
  return ids
    ? // if 'ids' : split them on ',' and find each of them
      ids
        .split(",")
        .map(id => col.find({ _id: String(id) }).value())
        .filter(e => e)
    : // no 'ids' : get whole collection value
      col.value();
};

/**
 * Insert or Update an element in the given collection.
 * If the element has no 'id' attribute, a new one is generated.
 * @param {String} base Base name
 * @param {String} collection Collection name
 * @param {Object} element Object to insert in collection
 */
const insertOrUpdate = (base, collection, element) => {
  // get collection
  let col = getCollection(base, collection);
  if (!element._id) {
    // create new element (no _id !)
    const newElement = { _id: shortid(), ...element };
    // insert it
    col.push(newElement).write();
    // return it
    return newElement;
  } else {
    // find if an 'id' element exists
    count = col.find({ _id: String(element._id) });
    // found : update it !
    if (count.size().value()) count.assign(element).write();
    // not found : insert new one
    else col.push(element).write();
    // return inserted / updated element
    return element;
  }
};

/**
 * Remove the elements found based on the array of IDs
 * For a given database / collection
 * @param {String} base Base name
 * @param {String} collection Collection name
 * @param {Array} ids List of IDs to remove
 */
const removeByIds = (base, collection, ids = []) => {
  // get collection
  let col = getCollection(base, collection);
  // remove id's
  const _ids = ids.split(",");
  _ids.forEach(id => col.remove({ _id: String(id) }).write());
};

module.exports = { getByIds, insertOrUpdate, removeByIds };
