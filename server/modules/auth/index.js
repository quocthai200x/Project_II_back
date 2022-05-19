const userModel = require("./model");
const { hashMd5, signToken, verifyToken } = require("../utils");
const template = require("../template");
// const crypto = require("crypto");

const handlers = {
  async signIn(req, res, next) {
    try {
      let data = req.body;
      let { email, password } = data;

      if (!email) {
        throw new Error("Missing Email!");
      }
      if (!password) {
        throw new Error("Missing Password!");
      }

      let formattedEmail = String(email).toLowerCase().trim();
      let hashedPassword = hashMd5(String(password)); // crypto pass

      let user = await userModel.findOne({ email: formattedEmail });

      if (!user) {
        throw new Error("Invalid email");
      }
      if (user.password != hashedPassword) {
        throw new Error("Invalid password");
      }
      let userData = user.toObject();
      delete userData.password;
      delete userData.likedBy

      let accessToken = signToken({_id: userData._id, email: userData.email});
      userData.accessToken = accessToken;

      res.json(template.successRes(userData));
    } catch (err) {
      err.status = 400
      next(err);
    }
  },

  async signUp(req, res, next) {
    try {
      let data = req.body;
      let formatedData = {}

      if (
        typeof data.password != "string" ||
        !(data.password.length >= 6 && data.password.length <= 30)
      ) {
        throw new Error("Invalid password! Password must be between 6 and 30");
      }

      formatedData.password = hashMd5(data.password);
      formatedData.email = String(data.email).toLowerCase().trim();
      formatedData.info = {
        name: data.name,
        birthdate: data.birthdate,
        gender: data.gender,
        interest: data.interest,
        desc: data.desc || 'This is demo description',
        imgUrl: data.imgUrl || 'https://live.staticflickr.com/2734/4353428267_bba2b6f6f8.jpg'
      }
      let user = await userModel.create(formatedData);
      let userData = user.toObject();
      delete userData.password;
      delete userData.likedBy

      let accessToken = signToken({_id: userData._id, email: userData.email});
      userData.accessToken = accessToken;
      
      res.json(template.successRes(userData));
    } catch (err) {
      err.status = 400
      next(err);
    }
  },
  async readTokenMiddleware(req, res, next) {
    try {
      let accessToken = req.headers.token;
      if (accessToken) {
        let userData = verifyToken(accessToken)
        req.user = await userModel.findById(userData._id);
      } 
      next();
    } catch (err) {
      console.log(err)
      next(new Error("Invalid access token!"));
    }
  },
  async authenticatedMiddleware(req, res, next) {
    try {
      let user = req.user;
      if (!user || !user._id) {
        throw new Error("Unauthenticated user");
      }
      next();
    } catch (err) {
      err.status = 400
      next(err);
    }
  },
  async checkUser(req, res, next) {
    try {
      let accessToken = req.headers.token;
      if (accessToken) {
        let userData = verifyToken(accessToken);
        
        if (!userData || !userData._id)
          throw new Error("Invalid access token!")

        req.user = await userModel.findById(userData._id).lean();
        let user = {...req.user}
        user.accessToken = accessToken
        delete user.password
        delete user.likedBy
        res.json(template.successRes(user))
      } 
    } catch (err) {
      err.status = 400
      next(err);
    }
  },
};

module.exports = handlers;
