const multer = require('multer')

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize: 3*1024*1024 //max 3mb file size of the resume pdf
    }
})


module.exports={upload}