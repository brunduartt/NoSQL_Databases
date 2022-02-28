const mongoose = require('mongoose');
const CountrySchema = {
   name: {
      type: String,
      required: true,
      unique: true,
   },
   isoCode: {
      type: String,
      unique: true,
   },
   population: {
      type: Number,
      min: 0,
   },
   continent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Continent'
   }
};
const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;

module.exports.mapBodyToEntity = function(body) {
   const {name, isoCode, continent, population} = body;
   return {
        name,
        isoCode,
        continent,
        population
   };
}