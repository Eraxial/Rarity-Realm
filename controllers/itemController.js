const connection = require('../config/database');

class ItemController {

  showItems = (req, res) => {
    res.render ('items', {title: 'Items'});
  }

  showItemInfo = (req, res) => {
    const {id} = req.params;

    let sql = 'SELECT * FROM item WHERE item_id = ? AND item_isdeleted = 0'

    connection.query(sql, [id], (err, result) => {
      res.render('oneItem', {title: `Info ${result[0].item_name}`, result: result[0]});
    })
  }

}

module.exports = new ItemController();