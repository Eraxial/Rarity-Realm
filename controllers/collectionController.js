const connection = require("../config/database");

class CollectionController {

  showCollections = (req, res) => {

    // let sql = 'SELECT * FROM collection WHERE collection_isdeleted = 0'

    let sql = `SELECT collection.*, collector.nick, item.item_img  FROM item, collection, collector
    WHERE item.collection_id = collection.collection_id
    AND item.collector_id = collector.collector_id
    AND collection.collection_isdeleted = 0 AND item.item_isdeleted = 0;`

    connection.query(sql, (err, result) => {
      if (err) throw err;

      let collection = {};
      let collections = [];

      let id = 0;

      for (let elem of result){
        if (elem.collection_id && elem.collection_id != id){
            collection = {
            collection_id: elem.collection_id,
            collection_name: elem.collection_name,
            collection_description: elem.collection_description,
            collector_id: elem.collector_id,
            collector_nick: elem.nick,
            item_img: elem.item_img
          }
          collections.push(collection);
        }
        id = elem.collection_id;
        
      }

      console.log(collections)

      res.render('collections', {title: 'Collections', collections})
    });
  }

  showOneCollection = (req, res) => {
    const id = req.params.id;

    let sql = `SELECT collection.*, category.category_name, collector.nick, collector.collector_img, item.* FROM collection 
    LEFT JOIN item ON collection.collection_id = item.collection_id
      LEFT JOIN collector ON collection.collector_id = collector.collector_id
      LEFT JOIN category ON item.category_id = category.category_id
    WHERE collection.collection_id = ? AND collection.collection_isdeleted = 0 AND item.item_isdeleted = 0`

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
        collector_id: result[0].collector_id,
        collector_nick: result[0].nick,
        collector_img: result[0].collector_img,
        collection_id: result[0].collection_id,
        collection_name: result[0].collection_name,
        collection_description: result[0].collection_description,
        items
      }
      res.render('./oneInfo/oneCollection', {title: 'Collection info', finalResult})
    })

  }

}

module.exports = new CollectionController();