const template = {
  successRes(data) {
    return {
      success: true,
      data: data
    }
  },
  failedRes(message) {
    return {
      success: false,
      message: message
    }
  }
}

module.exports = template