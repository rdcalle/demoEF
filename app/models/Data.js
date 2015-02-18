var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DataSchema   = new Schema({
    date: { type: Date, default: Date.now },
    value: { type: Number, min: 0, max: 100 },
    // user: { type: Schema.ObjectId, ref: "User"}
});

module.exports = mongoose.model('Data', DataSchema);
