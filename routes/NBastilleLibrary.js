var NBastille = require("../model/NBastille.js")

module.exports = {

  //get routes function for queries
  routes: function (req, res) {
    if (typeof req.query.routeid !== 'undefined' ) {
      res.json(NBastille.findOne(req.query.routeid));
      }
      else if (typeof req.query.protection !== 'undefined') {
      res.json(NBastille.findProtection(req.query.protection));
      }
      else {
            res.json(NBastille.findAll());
    }
  }
}
