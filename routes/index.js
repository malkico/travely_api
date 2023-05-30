var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/influencer/profilePicture/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.resolve(__dirname, '../public/profile_pictures', imageName);
  res.sendFile(imagePath);
});

module.exports = router;
