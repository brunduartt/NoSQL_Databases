import pymongo as pymongo

def connectDB():
    client = pymongo.MongoClient(
        "mongodb+srv://epita:epita@cluster0.keyq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.test