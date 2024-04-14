const connection = require('../config/database');

class ItemController {

  showItems = (req, res) => {
    let sql = `SELECT item.*, collection.collection_id, collection.collection_name, category.category_id, category.category_name, collector.nick
    FROM item, collection, category, collector
    WHERE item.collection_id = collection.collection_id
    AND item.category_id = category.category_id
    AND item.collector_id = collector.collector_id
    AND collector.is_admin = 0 AND item.item_isdeleted = 0;`

    connection.query(sql, (err, result) => {
      if (err) throw err;

      res.render('items', {title: 'Items', result});
    })
  }

  filter = (req, res) => {
    const {options, filter} = req.body;

    if(options && filter != ""){
      let sql = `SELECT item.*, collection.collection_id, collection.collection_name, category.category_id, category.category_name, collector.nick
      FROM item, collection, category, collector
      WHERE item.collection_id = collection.collection_id
      AND item.category_id = category.category_id
      AND item.collector_id = collector.collector_id
      AND collector.is_admin = 0 AND item.item_isdeleted = 0
      AND ${options} LIKE ("%${filter}%");`

      connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("------------------------------", req.body);
        res.render('items', {title: 'Items', result});
      })
    }else {
      res.redirect('/items')
    }

    

    
  }

  showItemInfo = (req, res) => {
    const {id} = req.params;

    let sql = `SELECT item.*, collection.collection_id, collection.collection_name, category.category_id, category.category_name 
    FROM item, collection, category
    WHERE item.collection_id = collection.collection_id
    AND item.category_id = category.category_id
    AND item.item_id = ?;`
    
    connection.query(sql, [id], (err, result) => {
      res.render('./oneInfo/oneItem', {title: `Info ${result[0].item_name}`, result: result[0]});
    })
  }

}

module.exports = new ItemController();