// Required Modules
var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var app        = express();

var port = process.env.PORT || 3001;
var User = require('./app/models/User');
var Data = require('./app/models/Data');

// Connect to DB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/demoEF');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


app.post('/authenticate', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});


app.post('/signup', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "¡Usuario ''" + req.body.email + "'' ya existe!\n Pruebe con otro"
                });
            } else {
                var dataModel = new User();
                dataModel.email = req.body.email;
                dataModel.password = req.body.password;
                dataModel.save(function(err, user) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET || 'el gran secreto');
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                });
            }
        }
    });
});

app.get('/me', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.delete('/delete/:id', function(req, res) {
    User.findOneAndRemove({_id: req.params.id}, function(err, user) {
        if (err) {
            console.log("not removed");
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            console.log("removed");
            res.json({
                type: true,
                data: user,
            });
        }
    });
});

app.get('/work', function(req, res) {
    Data.find(function(err, data) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: data
            });
        }
    });
});

app.post('/newdata', function(req, res) {
    User.findOne({date: req.body.date}, function(err, data) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (data) {
                res.json({
                    type: false,
                    data: "No se pudo añadir.\n Elija otra fecha o modifique el dato"
                });
            } else {
                var dataModel = new Data();
                dataModel.date = new Date(req.body.date);
                dataModel.dateString = req.body.dateString;
                dataModel.value = req.body.value;
                // dataModel.user = "";
                dataModel.save(function(err, data) {
                    data.save(function(err, thedata) {
                        res.json({
                            type: true,
                            data: thedata
                        });
                    });
                });
            }
        }
    });
});

app.post('/modifydata', function(req, res) {
    Data.update({_id: req.body._id}, {
        $set: { date: req.body.date, value: req.body.value, dateString: req.body.dateString }
      },function(err) {
        if (err) {
          console.log("not updated");
        } else {
          res.json( { type: true } );
        }

    });
});

app.get('/getData/:id', function(req, res) {
    Data.findOne({_id: req.params.id}, function(err, data) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (data) {
                res.json({
                    type: true,
                    data: data
                });
            } else {
                res.json({
                    type: false,
                    data: "No se encontró"
                });
            }
        }
    });
});

app.delete('/deleteData/:id', function(req, res) {
    Data.remove({_id: req.params.id}, function(err) {
      if (err) {
        res.json({
            type: false,
            data: "Error occured: " + err
        });
      } else {
        res.json({
            type: true
        });
      }
    });
});

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});
