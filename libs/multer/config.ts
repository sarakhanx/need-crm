import multer from "multer"

const companyLogoUpload = multer.diskStorage({
    destination: function(req , file , cb ){
        cb(null , './uploads/company_assets')
    },
    filename : function (req , file , cb) {
        cb(null , Date.now() + '-' + file.originalname)
    }
})

export const uploadLogo = multer({storage : companyLogoUpload})