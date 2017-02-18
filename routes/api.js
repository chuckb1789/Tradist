var NBastille = require("../model/NBastille.js")

module.exports = {

  getData: function (req, res, next) {
      res.json(Contacts.getAllRoutes())
  }

}
