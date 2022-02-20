module.exports.parseMatchQuery = function(query)  {
    let newQuery = {};
    const keys = Object.keys(query);
    keys.forEach((key) => {
        newQuery = joinQuery(newQuery, getQueryValue(key, query)); //joins current query with the new one
    });
    console.log(newQuery);
    return newQuery;
};

function getQueryValue(key, query) {
    const newQuery = {};
    const keyValue = JSON.parse(query[key]); //turns value to the correct type instead of string
    if(key.includes(".")) { //if there's an operator in the query after the fields name
        const splitKey = key.split("."); //At [0] is the fields name and at [1] is the operator
        let queryValue;
        if(splitKey[1] == "contains") { //Searchs for the entity that contains keyValue in the desired field
            queryValue = { $regex: keyValue };
        } 
        else if(splitKey[1] == "size") {  //Searchs for the entity that has the size equal to keyValue
            queryValue = { $size: keyValue };
        }
        else if(splitKey[1].charAt(0) == '$') {
            queryValue = {};
            queryValue[splitKey[1]] = keyValue;
        }
        else {
            throw "Invalid query operator";
        }
        newQuery[splitKey[0]] = queryValue;
    } else { //If there's no operator in the query
        if(key == "id") { //if it's the id field
            const _id = query.id;
            newQuery._id = {$eq: _id };
        } else {
            newQuery[key] = {$eq: keyValue};
        }
    }
    return newQuery;
}

module.exports.parseAggregateQuery = function(query)  {
    const newQuery = [];
    const hasSort = query['sortBy'];
    let matchQuery = {};
    if(hasSort) {
        const sortQuery = {};
        const sortBy = query['sortBy']; //the name of the field which wishes to be sorted by
        const sortOrder = query['sortOrder']; //the sort orded (1): asc and (-1): desc
        sortQuery[sortBy] = sortOrder ? Number.parseInt(sortOrder) : 1;
        newQuery.push({
            $sort: sortQuery
        });
        matchQuery[sortBy] = { $ne: null };
        delete query['sortBy'];
        delete query['sortOrder'];
    }
    matchQuery = joinQuery(matchQuery, this.parseMatchQuery(query)); //joins the queries
    newQuery.push({
        $match: matchQuery,
    });
    console.log(newQuery);
    return newQuery;
}

function joinQuery(...queryList) {
    const newQuery = {};
    queryList.forEach(query => {
        const fields = Object.keys(query);
        fields.forEach(field => {
            if(newQuery[field]) { //in case there's already a match query for the same field, do not overwrite but add the filter to the existing Map
                newQuery[field] = {
                    ...newQuery[field],
                    ...query[field]
                };
            } else {
                newQuery[field] = query[field];
            }
        });
    });
    return newQuery;
}
