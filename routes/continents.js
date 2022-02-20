const ContinentModel = require('../model/Continent');
const express = require("express");
const Router = express.Router();
const Utils = require('../utils');
const mongoose = require('mongoose');
Router.post('/', async (req, res) => {
    console.log(`POST request to create Continent: ${JSON.stringify(req.body)}`);
    const continent = await ContinentModel.create(ContinentModel.mapBodyToEntity(req.body));
    return res.status(201).json(continent);
});

Router.get('/count', async (req, res) => {
    console.log(req.query);
    console.log(`GET request to count all Continent by: ${JSON.stringify(req.query)}`);
    const countries = await ContinentModel.count(Utils.parseMatchQuery(req.query));
    return res.status(200).json(countries);
});

Router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`GET request to find all Continent by id ${id}`);
    const countries = await populate(ContinentModel.find({_id: id}));
    return res.status(200).json(countries);
});


//localhost:3000/continents/620faccb558d16e032ebe47e/countryAt?pos=3 to get the 4th country of the continent ordered by name 
Router.get('/:id/countryAt', async (req, res) => {
    const id = req.params.id;
    const pos = req.query['pos'] ? Number.parseInt(req.query['pos']) : 4;
    const order = req.query['order'] ? Number.parseInt(req.query['order']) : 1;
    const sort = req.query['sort'] ?? "name";
    const $sort = {};
    $sort["countries." + sort] = order;
    console.log(`GET request the ${pos}th country of Continent (_id: ${id}) in ${order == 1 ? 'asc' : 'desc'} order sorted by ${sort}`);

    const country = await ContinentModel.aggregate([
        {$match: { _id: mongoose.Types.ObjectId(id) },},
        {$lookup: {
            from: "countries",
            localField: "countries",
            foreignField: "_id",
            as: "countries"
        }},
        {$unwind: "$countries"},
        {$sort: $sort},
        { $skip: pos },
        { $limit : pos+1 }
    ]);
    if(country && country[0]) {
        return res.status(200).json(country[0].countries);
    } else {
        return res.status(404).json({"msg": "Not found"});
    }
});


//localhost:3000/continents/?countries.size=3 to get continents with 3 countries
Router.get('/', async (req, res) => {
    console.log(req.query);
    console.log(`GET request to find all Continent by: ${JSON.stringify(req.query)}`);
    const countries = await populate(ContinentModel.find(Utils.parseMatchQuery(req.query)));
    return res.status(200).json(countries);
});



Router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`DELETE request to delete Continent by id ${id}`);
    const countries = await ContinentModel.findByIdAndDelete(id);
    return res.status(200).json({msg: `Continent by ${id} successfully deleted.`});
});


Router.put('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`PUT request to update Continent by id ${id}: ${JSON.stringify(req.body)}`);
    const newContinent = await ContinentModel.findByIdAndUpdate(id, ContinentModel.mapBodyToEntity(req.body), {
        new: true
    });
    return res.status(200).json(newContinent);
});

module.exports = Router;

function populate(request) {
    return request.populate('countries');
}