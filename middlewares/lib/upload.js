const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload klasörünü oluştur
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // uploads klasörüne kaydet
    },
    filename: function (req, file, cb) {
        // Benzersiz dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
    // İzin verilen dosya tipleri
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG is allowed.'), false);
    }
};

// Multer konfigürasyonu
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    }
});

module.exports = upload;                    