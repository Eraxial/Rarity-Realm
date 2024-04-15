const connection = require('../config/database');
const { connect } = require('../routes/admin');
const { validationResult } = require('express-validator');

class AdminController {

  showAdminPage = (req, res) => {

    let collections = 'SELECT collection.*, collector.nick FROM collection left join collector on collector.collector_id = collection.collector_id where collection.collection_isdeleted = 0;';

    let items = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 ORDER BY item.item_id;`

    let collectors = 'SELECT * FROM collector WHERE is_deleted = 0 AND is_admin = 0';

    let categories = 'SELECT * FROM category ORDER BY category_id';

    connection.query(collections, (err, resultCollection) => {
      if (err) throw err;
      connection.query(items, (err2, resultItem) => {
        if (err2) throw err2;
        connection.query(collectors, (err3, resultCollector) => {
          if (err3) throw err3;
          connection.query(categories, (err4, resultCategories) => {
            if (err4) throw err4;
            
            console.log(resultCollector)

            res.render('admin', {title: 'Admin', resultCollection, resultItem, resultCollector, resultCategories});

          })
        })
      })
    })

    
  }

  eraseCollector = (req, res) => {
    const {id} = req.params;

    let sql = 'UPDATE collector SET is_deleted = 1 WHERE collector_id = ?'

    connection.query(sql, [id], (err) => {
      if (err) throw err;
      res.redirect('/admin')
    })

  }

  addCategory = (req, res) => {

    const {name} = req.body;

    let sql = 'INSERT INTO category (category_name) VALUES (?)'

    connection.query(sql, [name], err => {
      if (err) throw err;
      res.redirect('/admin');
    })
  }

  eraseCategory = (req, res) => {
  
    const {id} = req.params;
  
    let sql = 'DELETE FROM category WHERE category_id = ?;'
  
    connection.query(sql, [id], err => {
      if (err) throw err;
      res.redirect('/admin');
    })
  }

  eraseCollection = (req, res) => {
    const {id} = req.params;

    let sql = 'UPDATE collection SET collection_isdeleted = 1 WHERE collection_id = ?'

    connection.query(sql, [id], (err) => {
      if (err) throw err;
      res.redirect('/admin')
    })
  }

  eraseItem = (req,res) => {
    const {id} = req.params;

    let sql = 'UPDATE item SET item_isdeleted = 1 WHERE item_id = ?'

    connection.query(sql, [id], (err) => {
      if (err) throw err;
      res.redirect('/admin')
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
        res.redirect('/admin');
      })
    }
  }

  filterCollector = (req, res) => {

    const {options, filter} = req.body;

    console.log(req.body);

    let collections = 'SELECT collection.*, collector.nick FROM collection left join collector on collector.collector_id = collection.collector_id where collection.collection_isdeleted = 0;';

    let items = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 ORDER BY item.item_id;`

    let collectors = `SELECT * FROM collector WHERE is_deleted = 0 AND is_admin = 0 AND ${options} LIKE ("%${filter}%")`;
    
    let categories = 'SELECT * FROM category ORDER BY category_id';

    connection.query(collections, (err, resultCollection) => {
      if (err) throw err;
      connection.query(items, (err2, resultItem) => {
        if (err2) throw err2;
        connection.query(collectors, (err3, resultCollector) => {
          if (err3) throw err3;
          connection.query(categories, (err4, resultCategories) => {
            if (err4) throw err4;
            
            console.log(resultCollector)

            res.render('admin', {title: 'Admin', resultCollection, resultItem, resultCollector, resultCategories});

          })
        })
      })
    })

    
  }

  filterItem = (req, res) => {

    const {options, filter} = req.body;

    let collections = 'SELECT collection.*, collector.nick FROM collection left join collector on collector.collector_id = collection.collector_id where collection.collection_isdeleted = 0;';

    let items = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 AND ${options} LIKE ('%${filter}%') ORDER BY item.item_id `

    let collectors = 'SELECT * FROM collector WHERE is_deleted = 0 AND is_admin = 0';

    let categories = 'SELECT * FROM category ORDER BY category_id';

    connection.query(collections, (err, resultCollection) => {
      if (err) throw err;
      connection.query(items, (err2, resultItem) => {
        if (err2) throw err2;
        connection.query(collectors, (err3, resultCollector) => {
          if (err3) throw err3;
          connection.query(categories, (err4, resultCategories) => {
            if (err4) throw err4;
            
            console.log(resultCollector)

            res.render('admin', {title: 'Admin', resultCollection, resultItem, resultCollector, resultCategories});

          })
        })
      })
    })
  }

  filterCollection = (req, res) => {
    let {options, filter} = req.body;

    if (options == 'collector' && isNaN(filter)){
      options = 'collector.nick';
    }else {
      options = 'collection.collector_id'
    }

    let collections = `SELECT collection.*, collector.nick FROM collection left join collector on collector.collector_id = collection.collector_id where collection.collection_isdeleted = 0 AND ${options} LIKE ('%${filter}%');`;

    let items = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 ORDER BY item.item_id `

    let collectors = 'SELECT * FROM collector WHERE is_deleted = 0 AND is_admin = 0';

    let categories = 'SELECT * FROM category ORDER BY category_id';

    connection.query(collections, (err, resultCollection) => {
      if (err) throw err;
      connection.query(items, (err2, resultItem) => {
        if (err2) throw err2;
        connection.query(collectors, (err3, resultCollector) => {
          if (err3) throw err3;
          connection.query(categories, (err4, resultCategories) => {
            if (err4) throw err4;
            
            console.log(resultCollector)

            res.render('admin', {title: 'Admin', resultCollection, resultItem, resultCollector, resultCategories});

          })
        })
      })
    })
  }

  filterCategory = (req, res) => {

    const {options, filter} = req.body;

    let collections = 'SELECT collection.*, collector.nick FROM collection left join collector on collector.collector_id = collection.collector_id where collection.collection_isdeleted = 0;';

    let items = `SELECT item.*, collection.collection_name, category.category_name, collector.nick
    FROM item
    LEFT JOIN collection ON item.collection_id = collection.collection_id
    LEFT JOIN category ON item.category_id = category.category_id
    LEFT JOIN collector ON item.collector_id = collector.collector_id
    WHERE item.item_isdeleted = 0 ORDER BY item.item_id;`

    let collectors = 'SELECT * FROM collector WHERE is_deleted = 0 AND is_admin = 0';

    let categories = `SELECT * FROM category WHERE ${options} LIKE ('%${filter}%') ORDER BY category_id `;

    connection.query(collections, (err, resultCollection) => {
      if (err) throw err;
      connection.query(items, (err2, resultItem) => {
        if (err2) throw err2;
        connection.query(collectors, (err3, resultCollector) => {
          if (err3) throw err3;
          connection.query(categories, (err4, resultCategories) => {
            if (err4) throw err4;
            
            console.log(resultCollector)

            res.render('admin', {title: 'Admin', resultCollection, resultItem, resultCollector, resultCategories});

          })
        })
      })
    })
  }
}

module.exports = new AdminController();