/*
module.exports.index = function(req, res) {
    res.render("index", { 
        title: "Home", 
    });
}*/

module.exports.index = function(req, res) {
    res.render("index");
}

module.exports.arena = function(req, res) {
    res.render("arena", { 
        title: "Arena", 
    });
}