var express = require('express');
var multer  = require('multer')


var router = express.Router();

/* const uploadMiddleware = (req, res, next) => {
  const upload = multer({
    dest: 'public/images',
    limits: {
      fileSize: 3 * 1024 * 1000
    },
    preservePath: false,
    fileFilter: (req, file, cb) => {
      // 在這裡可驗證一般文字欄位 req.body 和 file 檔案的必填欄位
      // 沒上傳file = undefined
      // 前端送的檔案欄位要放在最後 req.body 才拿的到文字
      const {name} = req.body
      if (!name || !file) return cb('欄位不齊全', false)
  
      // 驗證檔案格式
      const type = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      if (!type.includes(file.mimetype)) return cb('檔案格式不正確', false) 
  
      cb(null, true)
    },
  }).single('img')

  upload(req, res, err => {
    // 以下負責捕捉錯誤提早結束
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // 例如:檔案超過自定義的大小
      const {name, message, code, field, storageErrors} = err
      res.send({message: message})
    } else if (err) {
      // An unknown error occurred when uploading.
      res.send({message: err})
    } else {
      // 檔案和文字欄位正常
      next()
    }
  })
} */

const uploadMiddleware = (req, res, next) => {
  const storage = multer.diskStorage({
    limits: {
      fileSize: 3 * 1024 * 1000
    },
    preservePath: false,
    fileFilter: (req, file, cb) => {
      // 在這裡可驗證一般文字欄位 req.body 和 file 檔案的必填欄位
      // 沒上傳file = undefined
      // 前端送的檔案欄位要放在最後 req.body 才拿的到文字
      console.log(file);
      const {name} = req.body
      if (!name || !file) return cb('欄位不齊全', false)
  
      // 驗證檔案格式
      const type = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      if (!type.includes(file.mimetype)) return cb('檔案格式不正確', false) 
  
      cb(null, true)
    },
    destination: (req, file, cb) => cb(null, 'public/images'),// 儲存地點
    filename:  (req, file, cb) => {
      // 改檔名

      const {originalname, fieldname} = file
      //取得副檔名的 index
      const fileSplit = originalname.split('.')
      const fileIndex = fileSplit.length - 1
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, fieldname + '-' + uniqueSuffix + '.' + fileSplit[fileIndex])
    },
  })

  const upload = multer({storage: storage}).single('img')

  upload(req, res, err => {
    // 以下負責捕捉錯誤提早結束
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // 例如:檔案超過自定義的大小
      const {name, message, code, field, storageErrors} = err
      res.send({message: message})
    } else if (err) {
      // An unknown error occurred when uploading.
      res.send({message: err})
    } else {
      // 檔案和文字欄位正常
      next()
    }
  })
}

router.post('/', uploadMiddleware, function(req, res) {
  //middleware層以驗證完欄位
  //在這裡已驗證完文字和檔案的必填欄位
  res.send({})
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({})
});

module.exports = router;
