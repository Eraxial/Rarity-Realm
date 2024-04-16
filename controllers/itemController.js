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

  showCategoryItems = (req, res) => {
    const {id} = req.params;

    let sql = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 AND item.category_id = ?;`

    connection.query(sql, [id], (err, result) => {
      if (err) throw err;
      
      let finalResult = {};
      let item = {};
      let items = [];

      for (let it of result){
        if(it.item_id){
          item = {
            item_id: it.item_id,
            item_name: it.item_name,
            item_purchaseyear: it.item_purchaseyear,
            item_description: it.item_description,
            item_img: it.item_img,
            collection_id: it.collection_id,
            collection_name: it.collection_name,
            category_id: it.category_id,
            category_name: it.category_name
          }
          items.push(item);
        } 
      }
      finalResult = {
        category_name: result[0].category_name,
        items
      }
      res.render('./oneInfo/oneCategory', {title: 'Category items', finalResult})
    })

   }

}

module.exports = new ItemController();