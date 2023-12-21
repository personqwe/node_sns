const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {afterUploadImage, uploadPost} = require('../controllers/post');

try {
    fs.readdirSync('uploads');
} catch {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            console.log(file);
            const ext = path.extname(file.originalname); // 이미지.png = 이미지202312210737.png 이름의 중복 같이 않도록
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이미지 + 날짜 + 확장자  
        }
    }),
    limits: {fileSize: 10 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage); // main에서 append와 img가 같아야함

const upload2 = multer(); // 설정이 upload와 다르면 한개 더 만들어야함.
router.post('/', isLoggedIn, upload.none(), uploadPost);

module.exports = router;