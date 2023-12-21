exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
}; //json으로 이미지 업로드가 끝나면 업로드 된 이미지 url을 프론트로 보내고 프론트에서 게시글 업로드 할 때 url을 같이 보냄

exports.uploadPost = (req, res, next) => {
    try {

    } catch (error) {
        console.error(error);
        next(error);
    }
};