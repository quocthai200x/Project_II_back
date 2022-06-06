const request = require("request");
let template = require("../template");
const CLIENT_ID = process.env.CLIENT_ID_IMGUR

async function uploadImage(req, res, next) {
  try {
    let base64Code = req.body.source
    // console.log(base64Code);
    // const api = "https://freeimage.host/api/1/upload"
    const api = "https://api.imgur.com/3/image"
    const options = {
      url: api,
      headers: {
        Authorization: 'Client-ID ' + CLIENT_ID,
      },
      formData: {image: base64Code}
    };
    request.post(
      options, 
      (err, httpResponse, body) => {
        if (err) throw err

        let response = JSON.parse(body)

        if (!response.success)
          res.json(template.failedRes(response.data.error))
        else 
          res.json(template.successRes(response.data))
      });

  } catch(err) {
    console.log(err)
    next(err)
  }
}


module.exports = uploadImage;