const multer = require('multer');

const imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(res.status(400).send('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
      },
    filename: function (req, file, cb) {
        cb(null, String(Date.now()+file.originalname.replace(' ','-')));
    }
});

module.exports = (req,res,next) => {
    try
    {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
        upload(req, res, async function(err) {
            try{
                if (req.fileValidationError)
                throw new Error('format not supported or limit exceeded');
                else if (!req.file)
                    throw new Error('Please select an image to upload');
                else if (err||err instanceof multer.MulterError)
                    throw new Error(err);
                req.image=req.file;
                next();
            }
            catch(err){
                if(!err.statusCode)
                  err.statusCode=500;
                next(err);
            }    
        });
    }catch(err){
        if(!err.statusCode)
          err.statusCode=500;
        next(err);
    }    
};