module.exports = {
    name: "gspfscreen",
    api: require("./api/api"),
    gui: require("./gui/gui"),
    dbConnections: [
        {
            name: "gspfscreen",
            type: "mongo",
            url: "mongodb://localhost:27017",
            dbName: "gspfscreen"
        }
    ]
}