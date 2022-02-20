const mongoose = require('mongoose');
const ContinentSchema = {
   name: {
      type: String,
      required: true,
      unique: true,
   },
   countries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
   }]
};
const Continent = mongoose.model('Continent', ContinentSchema);

module.exports = Continent;

module.exports.mapBodyToEntity = function(body) {
   const {name} = body;
   return {
        name,
   };
}