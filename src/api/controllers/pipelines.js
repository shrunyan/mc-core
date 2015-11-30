module.exports = {
  getList: (req, res) => {
    res.send({
      data: [1, 2, 3, 4]
    })
  }
}
