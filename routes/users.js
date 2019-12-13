var express = require('express');
var router = express.Router();
var synaptic = require('synaptic'); // this line is not needed in the browser
var maleNames = require('./maleNames');
var femaleNames = require('./FemaleNames');
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
/* GET users listing. */
console.log(maleNames);
var INPUT_LENGTH = 7;
var myNetwork = new Architect.Perceptron(INPUT_LENGTH, 6, 2);

function convertNameToInput(name1) {
    name = name1.toLowerCase();
    if (name.length > INPUT_LENGTH)
        name = name.substring(INPUT_LENGTH);
    while (name.length < INPUT_LENGTH)
        name = " " + name;
    var characters = name.split("");
    let a = characters.map(
        (c) => c == " " ? 0 : c.charCodeAt(0) / 1000
    );
    console.log(a);
    return a;
}
var trainingData = [];
var trainer = new synaptic.Trainer(myNetwork);
for (var i = 0; i < femaleNames.length; i++) {
    trainingData.push({
        input: convertNameToInput(femaleNames[i]),
        output: [0, 1] // Male = false, Female = true
    });
}
for (var i = 0; i < maleNames.length; i++) {
    for (var j = 0; j < 2; j++) {
        trainingData.push({
            input: convertNameToInput(maleNames[i]),
            output: [1, 0] // Male = true, Female = false
        });
    }
}
for (var i = 0; i < 25; i++) {
    trainer.train(trainingData, {
        rate: 0.01,
        iterations: 200,
        shuffle: true,
        cost: Trainer.cost.CROSS_ENTROPY
    });
    var error = trainer.test(trainingData)["error"];
    console.log(
        "Iteration " + ((i + 1) * 200) + " --> Error: " + error
    );
}
router.get('/:name', function(req, res, next) {
    console.log(req, '===>', maleNames, femaleNames)
    console.log(Architect.Perceptron)
    let name = req.params.name;


    var result = myNetwork.activate(convertNameToInput(name));
    if (result[0] > result[1]) {
        res.send(req.params.name + ' is male' + result);
    } else {
        res.send(req.params.name + ' is  female' + result);
    }


    // res.send('respond with a resource' + req.params);
});

module.exports = router;