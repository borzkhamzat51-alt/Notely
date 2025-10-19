const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date },
  location: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Instrument', instrumentSchema);
