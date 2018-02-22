module.exports = function(app) {
    var controller = require("./../controllers/controller");
    app.use("/index.html", controller.index);
    app.use("/index", controller.index);
    app.use("/arena.html", controller.arena);
    app.use("/arena", controller.arena);
}