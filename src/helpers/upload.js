const multer = require('multer')
const path = require('path')
const limitFile = 1 // Megabyte

// setting diskStorage
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `./public/img`)
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}${path.extname(file.originalname)}`) // ext originalname => img.png/img.jpg
  }
})

// setting conneting multer with storage
const multerUploadImg = multer({
  storage: multerStorage,
  limits: {
    fileSize: limitFile * 1024 * 1024 // MegaByte(s)
  },
  // custom extension
  fileFilter: (req, file, callback) => {
    const typeExt = path.extname(file.originalname)
    if(typeExt === '.jpg' || typeExt === '.JPG' || typeExt === '.png' || typeExt === '.PNG') {
      callback(null, true)
    } else {
      callback({
        error: 'Wrong type extention! Please upload like png or jpg',
        code: 'typeExtWrong'
      }, false)
    }
  }
})

// make middleware
const singleUploadimg = (req, res, next) => {
  // process upload
  const multerSingle = multerUploadImg.single('image') // name file 
  if(multerSingle) {
    multerSingle(req, res, (error) => {
      if (error) {
        // console.log(error)
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(200).json({ msg: `File size exceeds the ${limitFile} Mb limit`})
        } else if(error.code === 'typeExtWrong') {
          return res.status(200).json({ msg: 'Wrong type extention! Please upload like png or jpg'})
        } else {
          return res.status(500).json({ msg: 'Internal server error!'})
        }
      } else {
        if (!req.file) {
          // if empity file
          return res.status(200).json({ msg: 'Please select an image to upload'})
        } else {
          next()
        }
      }
    })
  } else {
    next()
  }
}

module.exports = singleUploadimg
