const CountryModel = require('../model/Country');
const ContinentModel = require('../model/Continent');
const express = require("express");
const Router = express.Router();
const Utils = require('../utils');

Router.post('/', async (req, res) => {
    console.log(`POST request to create Country: ${JSON.stringify(req.body)}`);
    const country = CountryModel.mapBodyToEntity(req.body);
    const newCountry = await CountryModel.create(country);
    if(newCountry) {
        addToContinent(newCountry.continent, newCountry._id);
    }
    return res.status(201).json(newCountry);
});

Router.get('/count', async (req, res) => {
    console.log(req.query);
    console.log(`GET request to count all Country by: ${JSON.stringify(req.query)}`);
    const countries = await CountryModel.count(Utils.parseMatchQuery(req.query));
    return res.status(200).json(countries);
});

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`GET request to find all Country by id ${id}`);
    const countries = await populate(CountryModel.find({_id: id}));
    return res.status(200).json(countries);
});


//localhost:3000/countries/?name.contains="Fra"   -> to get country where name contains Fra
//localhost:3000/countries?sortBy=population&sortOrder=1 -> to get all countries ordered by population in asc order
//localhost:3000/countries/?name.contains="u"&population.$gt=100000 -> to get all countries with an "u" and with more than 100.000 people inside
Router.get('/', async (req, res) => {
    console.log(req.query);
    console.log(`GET request to find all Country by: ${JSON.stringify(req.query)}`);
    const countries = await populate(CountryModel.aggregate(Utils.parseAggregateQuery(req.query)));
    return res.status(200).json(countries);
});



Router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`DELETE request to delete Country by id ${id}`);
    const countries = await CountryModel.findByIdAndDelete(id);
    return res.status(200).json({msg: `Country by ${id} successfully deleted.`});
});


Router.put('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`PUT request to update Country by id ${id}: ${JSON.stringify(req.body)}`);
    const country = CountryModel.mapBodyToEntity(req.body);
    const newCountry = await CountryModel.findByIdAndUpdate(id, country, {
        new: true,
        runValidators: true,
    });
    if(newCountry) {
        addToContinent(country.continent, newCountry.id);
    }
    return res.status(200).json(newCountry);
});

module.exports = Router;

async function populate(request) {
    return CountryModel.populate(await request, {path: 'continent'});
}

async function addToContinent(continentId, countryId) {
    if(continentId) {
        const res = await ContinentModel.updateOne({
            _id: continentId
        }, {
            $addToSet: { 'countries': countryId },
        });
    }
}