const connection = require('../config/database');
const bcrypt = require('bcrypt');

class CollectorController {

  showAllCollectors = (req, res) => {
    res.render ('collectors', {title: 'Collectors'});
  }

  showRegisterForm = (req, res) => {
    res.render('register', {title: 'Register'})
  }

  registerCollector = (req, res) => {
    const {nick, email, password} = req.body;
  
    let sql = 'INSERT INTO collector (nick, email, password, img) VALUES (?, ?, ?, "default.png");'

    bcrypt.hash(password, 10, (err, hash) =>{
      if (err) throw err;

      connection.query(sql, [nick, email, hash], error => {
        if (error) throw error;
        res.redirect('/');
      })
    })
  }

  showCollector = (req, res) => {
    const {id} = req.params;
    
    let sql = `SELECT collector.*, item.*, collection.collection_name, category.category_name 
    from collector 
      LEFT JOIN item on collector.collector_id = item.collector_id and item.item_isdeleted = 0
          LEFT JOIN collection on item.collection_id = collection.collection_id 
          LEFT JOIN category ON item.category_id = category.category_id
          WHERE collector.collector_id = ${id};` 

    connection.query(sql, (err, result) => {
      if (err) throw err;

      let finalResult = {};
      let items = [];
      let item = {};

      for (let item of result){
        if(item.item_id){
          item = {
            item_id: item.item_id,
            item_name: item.item_name,
            item_purchaseyear: item.item_purchaseyear,
            item_description: item.item_description,
            item_img: item.item_img,
            collection_id: item.collection_id,
            collection_name: item.collection_name,
            category_id: item.category_id,
            category_name: item.category_name
          }
          items.push(item);
        }
      }
      finalResult = {
        collector_id: result[0].collector_id,
        nick: result[0].nick,
        name: result[0].name,
        last_name: result[0].last_name,
        email:result[0].email,
        interest: result[0].interest,
        phone: result[0].phone, 
        collector_img: result[0].collector_img,
        items
      }

      console.log(finalResult);
      
      res.render('oneCollector', {title: result[0].nick, finalResult});
      
    })
  }

  showFormAddItem = (req, res) => {
    const {id} = req.params;
    let coll = `SELECT collection.collection_id, collection.collection_name from collection, collector 
    where collection.collector_id = collector.collector_id
      and collector.collector_id = ? and collector.is_deleted = 0;`
    let cat = 'SELECT category_id, category_name FROM category'

    connection.query(coll, [id], (collErr, collections) => {
      if (collErr) throw collErr;
      connection.query(cat, (catErr, categories) => {
        if (catErr) throw catErr;
        res.render ('./forms/addItem', {title: 'Add Item', id, collections, categories});
      })
    })

    
  }

  addItem = (req, res) => {
    const {id} = req.params;
    const {item_name, item_purchaseyear, item_description, collection_id, category_id} = req.body;

    let sql = 'INSERT INTO item (item_name, item_purchaseyear, item_description, item_img, collection_id, category_id, collector_id) VALUES (?, ?, ?, ?, ?, ?, ?)'

    const img = req.file ? req.file.filename : 'default.png';

    connection.query(sql, [item_name, item_purchaseyear, item_description, img, collection_id, category_id, id], err => {
      if (err) throw err;
      res.redirect(`/collectors/${id}`)
    })
  }

  showFormEditItem = (req, res) => {
    const {id, itemId} = req.params;
    

    let sql = `SELECT item.*, collection.collection_id, collection.collection_name, category.category_id, category.category_name 
    FROM item, collection, category
    WHERE item.collection_id = collection.collection_id
    AND item.category_id = category.category_id
    AND item.item_id = ?
    AND item.item_isdeleted = 0;`

    let cat = 'SELECT category_id, category_name FROM category'
    let coll = 'SELECT collection_id, collection_name FROM collection WHERE collector_id = ?'

    connection.query(sql, [itemId], (err, result) => {
      if (err) throw err;
      connection.query(cat, (catErr, categories) => {
        if(catErr) throw catErr
        connection.query(coll,[id], (collErr, collections) => {
          if (collErr) throw collErr;
          res.render('./forms/editItem', {title: 'Edit Item', result: result[0], categories, collections, id});
        })
      });
    });
  }

  editItem = (req, res) => {
    const {id, itemId} = req.params;

    const {item_name, item_purchaseyear, item_description, collection_id, category_id} = req.body;

    let sql = 'UPDATE item SET item_name = ?, item_purchaseyear = ?, item_description = ?, collection_id = ?, category_id = ? WHERE item_id = ?';
    connection.query(sql, [item_name, item_purchaseyear, item_description, collection_id, category_id, itemId], err => {
      if (err) throw err;
      res.redirect(`/collectors/${id}`)
    })
  }

  eraseItem = (req, res) => {
    const {id, itemId} = req.params;

    let sql = 'UPDATE item SET item_isdeleted = 1 WHERE item_id = ?'

    connection.query(sql, [itemId], err => {
      if (err)throw err;

      res.redirect(`/collectors/${id}`)
    })
  }
}

module.exports = new CollectorController();