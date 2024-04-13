class CollectionController {

  showCollection = (req, res) => {
    res.render ('collections', {title: 'Collection'});
  }
}

module.exports = new CollectionController();