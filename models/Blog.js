var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
