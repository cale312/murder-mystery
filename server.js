const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const victims = require('./models/victims');

// Victim randomizer function
function randomizer() {
    var number = Math.floor(Math.random() * 4);
    return victims[number];
}

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home', {});
});

var detective = "";

app.post('/', function(req, res) {
    if (req.body.name !== "") {
        detective = req.body.name;
        res.redirect('/case');
    } else {
        res.redirect('/');
    }
});

app.get('/case', function(req, res) {
    const randomVic = randomizer();

    res.render('case', {
        detective: detective,
        name: randomVic.fullName,
        sex: randomVic.sex,
        job: randomVic.job,
        autopsy: randomVic.autopsy
    });
});

app.post('/case', function(req, res) {
    var button = req.body.button;
    const randomVic = randomizer();

    if (button === randomVic.killer) {
        res.render('verdict', {
            verdict: ' Well done! You found the killer'
        });
    } else if (button === "Play_again") {
        res.redirect('/');
    } else {
        res.render('verdict', {
            verdict: 'Oh no! The killer got away'
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
