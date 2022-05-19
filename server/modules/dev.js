let userModel = require('./auth/model')
const template = require('./template');

async function dev(req, res, next) {
  try {

    // Delete like/unlike/likedBy field ----------------
    // data = {
    //   like: [],
    //   unlike: [],
    //   likedBy: [],
    //   match: []
    // }
    // await userModel.update({}, {'$set': data}, {multi: true})
    // -----------------------------

    res.json(template.successRes([]))
  } catch(e) {next(e)}
}

module.exports = dev