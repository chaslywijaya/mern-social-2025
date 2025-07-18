// Buka file: D:\Kuliah\Full-Stack-React-Projects-Second-Edition-master\Chapter05\mern-social\config\config.js

// Hapus import yang salah ini jika ada di config.js
// import app from './express'; // <<< HAPUS BARIS INI DARI config.js

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || '127.0.0.1') + ':' + // Disarankan menggunakan 127.0.0.1
    (process.env.MONGO_PORT || '27017') +
    '/mernproject'
}

export default config // <<< PASTIKAN BARIS INI ADA DAN TIDAK ADA TYPO