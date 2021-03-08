# be-vuemessage

Tugas membuat realtime chat dan map untuk hasil dalam bentuk website [Chating](http://52.204.186.223:5000/). Sedangkan untuk bagian frotnend [klik ini](https://github.com/tomimandalap/fe-vuemessage) dan materi presentasi [disini](https://drive.google.com/file/d/16F388kNIJV5xtcl2Pe2nBc3W6W2kaTca/view?usp=sharing).

### Modules
1. [Expressjs]
2. [MySql2]
3. [Dotenv]
4. [CORS]
5. [Body Parser]
6. [bcrypt]
7. [jsonwebtoken] atau JWT
8. [lodash] contoh klik [disini]
9. [multer]

### Dev Modules
1. [Nodemon]

---

[ini]: https://view.genial.ly/6016b1c223fd8e1022267712/learning-experience-challenges-presentation
[Expressjs]: https://www.npmjs.com/package/express
[MySql2]: https://www.npmjs.com/package/mysql2
[Dotenv]: https://www.npmjs.com/package/dotenv
[CORS]: https://www.npmjs.com/package/cors
[Body Parser]: https://www.npmjs.com/package/body-parser
[Nodemon]: https://www.npmjs.com/package/nodemon
[ESLint]: https://eslint.org/docs/user-guide/getting-started
[bcrypt]: https://www.npmjs.com/package/bcrypt
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[lodash]: https://www.npmjs.com/package/lodash
[disini]: https://lodash.com/docs/4.17.15
[cek disini]: https://github.com/tomimandalap/beginer_backend/tree/master
[multer]: https://www.npmjs.com/package/multer


### Tatacara

1. Silahkan download file ini.
2. Silahkan buka file ini dalam satu folder di text editor  seperti VS Code atau sejenisnya
3. Pastikan import database yang ada didalam file ```MySql``` sebagai database di MySql
4. Silahkan ```CREATE``` file ```.env``` lalu buka file tersebut
5. Patikan isi ``` PORT ``` yang akan kamu gunakan di file ``` .env ``` sesuaikan juga dengan yang ada di ``` app.listen ``` pada file ``` app.js ```
6. Silahkan ganti nama database, user dan password pada file ``` .env ``` sesuai dengan MySql kalian. Umumnya seperti berikut:
```
DBHOST= localhost
DBUSER= root
DBPASS= 
DB    = nama_databasenya
PORT = 3000
keyJWT = xxxx
```
  
Untuk pengguna OS windows biasanya bagian passowd di xampp itu kosong, tetapi pengguna Mac silahakn isi passwordnya.

### Penggunaan

Silahkan buka terminal pada VS Code dengan menekan tombol
```
CTRL + SHIFT + `
atau
CTRL + SHIFT + C
```
Kemudian ketikan text berikut
```
"npm install"
"npm run start" //untuk menjalankan nodemon cek di file package.json
```
guna untuk menjalankan project ini. Pastikan anda telah mengaktifkan XAMPP

---
