const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const composerSchema = new Schema({
  name: { type: String, required: true },
  instrumentID: { type: Schema.Types.ObjectId, ref: 'Instrument' },
  genreID: { type: Schema.Types.ObjectId, ref: 'Genre' }
});

module.exports = mongoose.model('Composer', composerSchema);
