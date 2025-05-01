const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
   weather: {
    type: String,
    required: true,
   },

   imageUrl:  {
     type: String,
     required: true,
    validate: {
      validator(value) {
        return validator.isUrl(value);
      },
      message: 'Link is not Valid',
    },
  },


});

module.exports = mongoose.model("clothingItem", clothingItemSchema)