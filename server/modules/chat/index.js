const chatModel = require("./model");
const template = require("../template");

const chatHandler = {
  async getListChat(req, res, next) {
    try {
      let {
        pageIndex = 1,
        pageSize = 20,
        pageSizeMess = 20,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      let userId = String(req.user._id) // string, not an ObjectId

      let list = await chatModel.find(
        {users: {$all: [userId]}}, 
        {_id: 1, users: 1, createdAt: 1, messages: {$slice: pageSizeMess}, usersRead: 1}
      )
      .skip(skip).limit(limit).sort({createdAt: 'desc'})
      .populate({
        path: 'users',
        match: { _id: { $ne: userId } },
        select: 'info'
      })

      // return 20 lists with 20 latest mess each
      res.json(template.successRes(list))
    } catch(err) {
      next(err);
    }
  },
  async sendMessage(req, res, next) {
    try {
      let {chatId, matchId} = req.query

      let userId = String(req.user._id) // string, not an ObjectId
      let content = req.body.content.trim()
      let type = req.body.type
      let createdAt = new Date().toISOString()

      if (typeof(content) != "string" && !content.trim())
        throw new Error("Content is not valid, must be a string")
        
      if (!chatId)
        throw new Error("Missing chat id!")
    
      let newMess = {
        owner: userId, 
        type: type,
        content: content,
        createdAt: createdAt
      }

      let data = await chatModel.findByIdAndUpdate(
        {_id: chatId},
        { $push: {messages: { $each: [newMess], $position: 0 }}, 
          usersRead: [
            {userId: userId, read: true},
            {userId: matchId, read: false}
          ]
        },
        {
          fields: {_id: 1, users: 1, createdAt: 1, messages: {$slice: 1}},
          new: true
        }
      )
      // return an object, has an array which contains 1 latest messages
      res.json(template.successRes(data));
    } catch (error) {
      next(error);
    }
  },
  async getMessage(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 20,
        chatId
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      if (!chatId)
        throw new Error("Missing chat id!")
        
      let data = await chatModel.findById(
        {_id: chatId},
        {_id: 1, users: 1, createdAt: 1, messages: {$slice: [skip, limit]}}
      )
      res.json(template.successRes(data));
    } catch (error) {
      next(error);
    }
  },

  async readMessage(req, res, next) {
    try {
      let chatId = req.query.chatId
      let userId = String(req.user._id)
      if (!chatId)
        throw new Error("Missing chat id!")
        
      let data = await chatModel.findOneAndUpdate(
        {_id: chatId, usersRead: {$elemMatch: {userId: userId}}},
        {$set: {"usersRead.$.read": true}},
        {
          new: true
        }
      )
      res.json(template.successRes(data));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = chatHandler;