// Buka file: D:\Kuliah\Full-Stack-React-Projects-Second-Edition-master\Chapter05\mern-social\server\server.js

import config from '../config/config'; // Pastikan path ke config.js benar
import mongoose from 'mongoose';
import app from './express'; // <<< PASTIKAN IMPORT INI ADA DI server.js

// Deklarasikan port di sini
const port = config.port;

// Koneksi ke MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true // Hapus jika tidak ada lagi di Mongoose versi Anda
})
.then(() => {
  console.log("MongoDB connected successfully.");
  // Jalankan server Express HANYA SETELAH koneksi DB berhasil
  app.listen(port, (err) => { // Gunakan variabel port di sini
    if (err) {
      console.log(err);
    }
    console.info('Server started on port %s.', port);
  });
})
.catch(err => {
  console.error(`Error: unable to connect to database: ${err.message}`);
  // Baris ini bisa menyebabkan crash, pertahankan jika Anda ingin aplikasi berhenti jika DB tidak terkoneksi.
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

// Pastikan tidak ada app.listen() di luar blok .then() dari mongoose.connect()