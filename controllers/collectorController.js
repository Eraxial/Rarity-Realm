const { validationResult } = require('express-validator');
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const sendMail = require('../services/emailService');

class CollectorController {

  showRegisterForm = (req, res) => {
    res.render('./forms/register', {title: 'Register', message:"", validations:[], values:{}})
  }

  showLoginForm = (req, res) => {
    res.render('./forms/login', {title: 'Login', message:"", validations:[], values:{}})
  }

  registerCollector = (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
      res.render('./forms/register', {title: 'Register', validations, values})
    }else{

      const {nick, email, password} = req.body;
  
      console.log(req.body);
  
      bcrypt.hash(password, 10, (err, hash) =>{
        if (err) throw err;
        console.log(err)
  
        const img = req.file ? req.file.filename : 'human.png';
        let sql = 'INSERT INTO collector (nick, email, password, collector_img) VALUES (?, ?, ?, ?);'
  
        connection.query(sql, [nick, email, hash, img], error => {
          if (error) {
            if (error.errno = 1062){
              res.render('./forms/register', {title: 'Register', message:"Email ya existe", validations:[], values:{}})
            } else {
              res.render('./forms/register', {title: 'Register', message:"Hay un error en la base de datos", validations:[], values:{}})
            }
          }else{
            let sql2 = 'SELECT max(collector_id)max FROM collector';
            sendMail(nick, email)
            connection.query(sql2, (error2, result) => {
              if (error2) throw error2;
              const id = result[0].max;
              res.redirect(`/collectors/${id}/logged`);
            })
          }
        })
      })
    }

  }

  login = (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
      res.render('./forms/login', {title: 'Register', message:"", validations, values})
    }else{

      const {email, password} = req.body;

        let sql = 'SELECT * FROM collector WHERE email = ?'
        connection.query(sql, [email], (err, result) => {
          if (err) throw err;

          if (result.length == 1) {
            if (result[0].is_admin == 1) {
              res.redirect('/admin')
            }else{
              let hash = result[0].password;
              bcrypt.compare(password, hash, (error, restultCompare) => {
                if (restultCompare) {
                  let id = result[0].collector_id;
                  res.redirect(`/collectors/${result[0].collector_id}/logged`)
                } else {
                  res.render('../forms/login', {title: 'Login', message: 'Credenciales incorrectos', validations, values})
                }
              })
            }
          } else {
            res.render('../forms/login', {title: 'Login', message: 'Credenciales incorrectos', validations, values})
          }

        })
    }
  }

  showCollector = (req, res) => {
    const {id} = req.params;
    
    let sql = `SELECT collector.collector_id as collector_collectorid, collector.*, item.*, collection.collection_name, category.category_name 
    from collector 
      LEFT JOIN item on collector.collector_id = item.collector_id and item.item_isdeleted = 0
          LEFT JOIN collection on item.collection_id = collection.collection_id 
          LEFT JOIN category ON item.category_id = category.category_id
          WHERE collector.collector_id = ${id};` 

    connection.query(sql, (err, result) => {
      if (err) throw err;

      console.log(result);

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
        collector_id: result[0].collector_collectorid,
        nick: result[0].nick,
        name: result[0].name,
        last_name: result[0].last_name,
        email:result[0].email,
        interest: result[0].interest,
        phone: result[0].phone, 
        collector_img: result[0].collector_img,
        items
      }

      console.log(finalResult)
      res.render('./oneInfo/oneCollector', {title: result[0].nick, finalResult});
      
    })
  }

  showCollectorNoPerm = (req, res) => {
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
        interest: result[0].interest,
        collector_img: result[0].collector_img,
        items
      }

      console.log(finalResult);
      
      res.render('./oneInfo/oneCollectorNoPerm', {title: result[0].nick, finalResult});
      
    })
  }

  showFormAddItem = (req, res) => {
    const {id} = req.params;
    let coll = `SELECT collection_id, collection_name, collector_id FROM collection WHERE collector_id = ? AND collection_isdeleted = 0;`
    let cat = 'SELECT category_id, category_name FROM category'

    connection.query(coll, [id], (collErr, collections) => {
      if (collErr) throw collErr;
      connection.query(cat, (catErr, categories) => {
        if (catErr) throw catErr;
        console.log("----------------------------",collections, categories)
        res.render ('./forms/addItem', {title: 'Add Item', id, collections, categories, validations: [], values: {}, result: []});
      })
    })

    
  }

  addItem = (req, res) => {

    const {id} = req.params;
    const {item_name, item_purchaseyear, item_description, collection_id, category_id} = req.body;
    const result = [{item_name, item_purchaseyear, item_description, collection_id, category_id}];
    const errors = validationResult(req);
    

    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
      let coll = `SELECT collection.collection_id, collection.collection_name from collection, collector 
      where collection.collector_id = collector.collector_id
      and collector.collector_id = ? and collector.is_deleted = 0;`
    let cat = 'SELECT category_id, category_name FROM category'

    connection.query(coll, [id], (collErr, collections) => {
      if (collErr) throw collErr;
      connection.query(cat, (catErr, categories) => {
        if (catErr) throw catErr;
        res.render ('./forms/addItem', {title: 'Add Item', id, result: result[0], collections, categories, validations, values});
      })
    })
    }else{

      
      const {item_name, item_purchaseyear, item_description, collection_id, category_id} = req.body;
  
      let sql = 'INSERT INTO item (item_name, item_purchaseyear, item_description, item_img, collection_id, category_id, collector_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  
      const img = req.file ? req.file.filename : 'default.png';
  
      connection.query(sql, [item_name, item_purchaseyear, item_description, img, collection_id, category_id, id], err => {
        if (err) throw err;
        res.redirect(`/collectors/${id}/logged`)
      })
    }

  }

  addCollection = (req, res) => {
    const {id} = req.params;

    const {collection_name, collection_description} = req.body;

    let sql = 'INSERT INTO collection (collection_name, collection_description, collector_id) VALUES (?,?,?)'

    connection.query(sql, [collection_name, collection_description, id], err => {
      res.redirect(`/collectors/${id}/addItem`)
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
          res.render('./forms/editItem', {title: 'Edit Item', result: result[0], categories, collections, id, validations: [], values: {}});
        })
      });
    });
  }

  editItem = (req, res) => {
    const {id, itemId} = req.params;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
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
            res.render('./forms/editItem', {title: 'Edit Item', result: result[0], categories, collections, id, validations, values});
          })
        });
      });
    }else {
      const {item_name, item_purchaseyear, item_description, collection_id, category_id} = req.body;
  
      let sql2 = 'UPDATE item SET item_name = ?, item_purchaseyear = ?, item_description = ?, collection_id = ?, category_id = ? WHERE item_id = ?';
      connection.query(sql2, [item_name, item_purchaseyear, item_description, collection_id, category_id, itemId], err => {
        if (err) throw err;
        res.redirect(`/collectors/${id}/logged`)
      })
    }

  }

  eraseItem = (req, res) => {
    const {id, itemId} = req.params;

    let sql = 'UPDATE item SET item_isdeleted = 1 WHERE item_id = ?'

    connection.query(sql, [itemId], err => {
      if (err)throw err;

      res.redirect(`/collectors/${id}/logged`)
    })
  }

  showEditCollectorForm = (req, res) => {
    const {id} = req.params;

    let sql = 'SELECT * FROM collector WHERE collector_id = ? AND is_deleted = 0'


    connection.query(sql, [id], (err, result) => {
      if (err) throw err;

      res.render('./forms/editCollector', {title: 'Edit Collector', result: result[0], validations: [], values: {}});
    })
  }

  editCollector = (req, res) => {
    const {id} = req.params;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
      let sql = 'SELECT * FROM collector WHERE collector_id = ? AND is_deleted = 0'


      connection.query(sql, [id], (err, result) => {
        if (err) throw err;

        res.render('./forms/editCollector', {title: 'Edit Collector', result: result[0], validations, values});
    })
    }else{

      const{nick, name, last_name, email, phone} = req.body;

      let sql = 'UPDATE collector SET nick = ?, name = ?, last_name = ?, email = ?, phone = ? WHERE collector_id = ?' 

      connection.query(sql, [nick, name, last_name, email, phone, id], err => {
        if (err) throw err;
        res.redirect(`/collectors/${id}/logged`);
      })
    }
  }
}

module.exports = new CollectorController();