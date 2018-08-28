/**
 *  Each wrapper must exports 3 functions :
 *      - getByIds(base, collection, id = [])
 *      - insertOrUpdate(base, collection, element)
 *      - removeByIds(base, collection, ids = [])
 */
const wrappers = {
  lowdb: require("./wrapper.lowdb")
};

/**
 * Export a function that take the wrapper name as parameter
 *  - Returns the wrapper if found
 *  - Throws a Error (stops the script) if not found
 *
 * @param {String} wrapperName
 */
module.exports = (wrapperName = "lowdb") => {
  const wrapper = wrappers[wrapperName];
  if (!wrapper)
    throw new Error(
      `Wrapper "${wrapperName}" not found.\n` +
        `Available wrappers : ${Object.keys(wrappers).join(" - ")}`
    );
  return wrapper;
};
