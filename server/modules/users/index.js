let userModel = require('../auth/model')
let chatModel = require('../chat/model')

const template = require('../template');
const mongoose = require('mongoose');

const handlers = {
  async getCards(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 10,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      let user = await userModel.findById(
        {_id: req.user._id},
      )

      let interest = user.info.interest
      let gender = user.info.gender
      
      let like = user.like
      let unlike = user.unlike
      let metUsers = [...like, ...unlike, String(user._id)]
      let conditions = {
        'info.gender': interest, 
        'info.interest': gender, 
        '_id': {$nin: metUsers}
      }
      let items = await userModel
        .find(conditions, {info: 1})
        .skip(skip)
        .limit(limit)

      res.json(template.successRes(items))
    } catch(e) {next(e)}
  },

  
  async likeAndUnlike(req, res, next) {
    try {
      let status = req.body.status;
      let likeId = String(req.body._id);
      let userId = String(req.user._id);

      let user = await userModel.findById(
        {_id: userId},
      )

      let myMetUsers = [...user.like, ...user.unlike]

      if (myMetUsers.includes(likeId))
        throw new Error('This person has already be in your list. Something went wrong.')
      if (likeId == userId)
        throw new Error('The person you have swiped is you. Something went wrong.')

      let data = []
      let match = false

      switch (status) {
        case "like":
          data = await userModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { like: { $each: [likeId], $position: 0 } } },
            {
              fields: {like: 1},
              new: true
            }
          ).populate('like','info')
          data = data.like
          
          let likedUser = await userModel.findByIdAndUpdate(
            { _id: likeId },
            { $push: { likedBy: { $each: [userId], $position: 0 } } },
            {
              fields: {like: 1},
              new: true
            }
          );

          // -------- When users match ------------
          if (likedUser.like.includes(userId)) {
            match = true
            let createdAt = new Date().toISOString()
            function matchData(id) {
              return {
                _id: id,
                createdAt: createdAt
              }
            }

            await userModel.updateOne(
              { _id: userId },
              { $push: { match: { $each: [matchData(likeId)], $position: 0 } } }
            );
            await userModel.updateOne(
              { _id: likeId },
              { $push: { match: { $each: [matchData(userId)], $position: 0 } } }
            );
            
            let chatData = {
              users: [userId, likeId],
              createdAt: createdAt,
              messages: [],
              usersRead: [
                {userId: userId, read: false},
                {userId: likeId, read: false}
              ]
            }

            await chatModel.create(chatData)
          }
          // --------------------
          break;
        case "unlike":
          data = await userModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { unlike: { $each: [likeId], $position: 0 } } },
            {
              fields: {unlike: 1},
              new: true
            }
          ).populate('unlike','info')

          data = data.unlike

          break;
        default: 
          throw new Error('Invalid value. Must be either "like" or "unlike".')
      }

      res.json(template.successRes({match: match, list: data}));
    } catch (err) {
      err.status = 400
      next(err);
    }
  },
  async getMatches(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 20,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)
      let user = await userModel.findById({_id: req.user._id})
      
      let listMatchId = user.match.map(el => String(el._id))

      // get only data in listMatchId
      let conditions = {
        '_id': {$in: listMatchId}
      }

      // get data in 'info' field
      let matchItems = await userModel
        .find(conditions, {info: 1})
        .skip(skip)
        .limit(limit)
        .sort({createdAt: 'desc'})

      // join data with _id and createdAt -> send this response to client
      let matchItemsWithDate = matchItems.map((item, i) => {
        return {
          _id: String(item._id),
          info: item.info,
          createdAt: user.match[i].createdAt
        }
      })

      // send json response
      res.json(template.successRes(matchItemsWithDate));
    } catch(err) {
      next(err)
    }
  }
}

module.exports = handlers