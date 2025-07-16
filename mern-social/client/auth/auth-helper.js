// ... (kode di atas tetap sama)

import { signout } from './api-auth.js' // Pastikan ini diimpor dengan benar

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined")
      return false

    if (sessionStorage.getItem('jwt')) {
      try {
        return JSON.parse(sessionStorage.getItem('jwt'))
      } catch (e) {
        // Handle case where JWT is not valid JSON, though unlikely
        console.error("Error parsing JWT from sessionStorage:", e);
        sessionStorage.removeItem('jwt'); // Clear invalid JWT
        return false;
      }
    }
    else
      return false
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
  },
  clearJWT(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('jwt');
      // Pastikan untuk menghapus cookie 't' jika itu digunakan untuk otentikasi di sisi server.
      // Jika Anda menggunakan JWT di cookie httpOnly, ini penting.
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    // Panggil signout API ke backend
    // Penting: Pastikan API call ini sukses sebelum melakukan redirect atau operasi lain yang bergantung pada logout
    signout().then((data) => {
      // Logika di sini akan berjalan setelah respons dari server diterima
      // Jika server berhasil menghapus HttpOnly cookie 't', maka ini sudah cukup.
      // Penambahan document.cookie di atas (expires=...) adalah fallback yang bagus.

      if (data && data.error) {
        console.error("Server-side signout error:", data.error);
        // Anda mungkin ingin menampilkan pesan error ke user di sini
      }
      
      // Panggil callback setelah semua operasi pembersihan selesai,
      // bahkan jika ada error dari API, agar UI tetap diupdate (misal: redirect)
      if (cb) cb(); 
    })
    .catch(err => {
      console.error("Error during signout API call:", err);
      // Tetap panggil callback meskipun ada error jaringan, dll.
      if (cb) cb(); 
    });
  }
}

export default auth