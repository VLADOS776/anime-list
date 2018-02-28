require("fs").readdirSync(__dirname).forEach(function(file) {
    require("./" + file);
});