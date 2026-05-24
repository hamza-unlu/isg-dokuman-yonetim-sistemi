// models/VeriDepo.js
const mongoose = require('mongoose');

const veriDepoSchema = new mongoose.Schema({
    anahtar: { type: String, required: true, unique: true },
    deger: { type: mongoose.Schema.Types.Mixed } // Her türlü veriyi tutabilmesi için Mixed kullanıyoruz
});

module.exports = mongoose.model('VeriDepo', veriDepoSchema);