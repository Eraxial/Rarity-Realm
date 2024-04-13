const connection = require('../config/database');

class IndexController {

  showIndex = (req, res) => {
    let sql = 'SELECT * FROM collector WHERE is_deleted = 0;'

    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render ('index', {title: 'Rarity Realm', result});
    })
  }
}

module.exports = new IndexController();