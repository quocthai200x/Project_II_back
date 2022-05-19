let userModel = require('../auth/model')
const template = require('../template');
const { hashMd5, signToken, verifyToken, validateString } = require("../utils");

const handlers = {
  async resetPassword(req, res, next) {
    try {
      let user = req.user
      let oldPw = req.body.oldPassword
      let newPw = req.body.newPassword

      let hashedOldPassword = hashMd5(String(oldPw));
      let hashedNewPassword = hashMd5(String(newPw)); 

      if (!oldPw)
        throw new Error("Old password is required") 
      if (!newPw)
        throw new Error("New password is required") 
      if (hashedOldPassword != user.password)
        throw new Error("Old password is not correct!") 
      if (typeof newPw != "string" || !(newPw.length >= 6 && newPw.length <= 30))
        throw new Error("Invalid password! Password must be between 6 and 30");

      await userModel.updateOne(
        {_id: String(user._id) },
        { password: hashedNewPassword}
      )
      
      res.json(template.successRes('Password updated successfully!'))
    } catch(e) {next(e)}
  },
  async updateProfile(req, res, next) {
    try {
      // can update 7 fields: name/email/gender/interest/birthdate/desc/imgUrl
      
      // --------- Get data ------------
      let user = req.user
      // let email = req.body.email || user.email
      let info = {
        name:  req.body.name || user.info.name,
        gender: req.body.gender || user.info.gender,
        interest: req.body.interest || user.info.interest,
        birthdate: req.body.birthdate || user.info.interest,
        desc: req.body.desc || 'Hãy giới thiệu bản thân',
        imgUrl: req.body.imgUrl || 'https://live.staticflickr.com/2734/4353428267_bba2b6f6f8.jpg',
      }

      // ---- Validate data ------------
      // if (!validateString(email)) 
      //   email = user.email
      
      for (let prop in info) {
        if(!validateString(info[prop])) 
          info[prop] = user.info[prop]
        
        if (prop == 'gender' || prop == 'interest') {
          if (!["male", "female"].includes(info[prop])) 
            info[prop] = user.info[prop]
        }

        if (prop == 'birthdate') {
          if (new Date(info[prop]) == "Invalid Date") 
            info[prop] = user.info[prop]
        }
      }
      // ---------------------

      let userData = await userModel.findByIdAndUpdate(
        {_id: user._id },
        { info: info },
        { 
          fields: { info: 1, _id: 1},
          new: true 
        }
      )      
      res.json(template.successRes(userData))
    } catch(e) {next(e)}
  },
}

module.exports = handlers