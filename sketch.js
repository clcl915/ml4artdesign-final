// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
DCGAN example
=== */

let dcgan;
let button;
let charRNN;
let modelIsLoaded = false;
let predictionIsRunning = false;
let lastSeedText = '';
let randomIndex = 0;
let runwayimage = document.getElementById("runwayImg")

function preload(){

  dcgan = ml5.DCGAN('model/SmoothedGenerator_8000_tfjs/manifest.json');

}

function setup() {
  charRNN = ml5.charRNN('./model/all-pokemon-names', modelReady);
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("dcganGenerated")
  // Button to generate an image
  button = createButton('generate');
  button.parent("dcganGenerated")
  button.mousePressed(generate);
  // generate an image on load
  generate()
}

function generate() {
  // Generate function receives a callback for when image is ready
  dcgan.generate(displayImage);
}

function displayImage(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  image(result.image, 0, 0, 400, 400);
  // getRandomImage();

}

function getRandomImage (){
  let runwayimage = document.getElementById("runwayImg")
  randomIndex = Math.floor(Math.random() * 100);
  if (randomIndex < 10){
    console.log(randomIndex)
    document.getElementById("runwayImg").src = "runway-images/img00000000" + randomIndex + ".png"
  }
  else{
    document.getElementById("runwayImg").src = "runway-images/img0000000" + randomIndex + ".png"
  }
}
function draw() {
  if (modelIsLoaded && !predictionIsRunning) {
    // let's only run interference when the text is different from last time
    let seedText = select('#seed').value();
    if (seedText != lastSeedText) {
      predict(seedText);
    }
  }
}
function modelReady() {
  select('#prediction').html('Model Loaded');
  modelIsLoaded = true;
}

function predict(seed) {
  // get the desired temperature and length from sliders
  let temperature = 0.51;
  console.log(temperature)
  let length = 20;
  console.log(length)
  let options = {
    seed: seed.toLowerCase(),  // not entirely sure why, following ml5 example
    temperature: temperature,
    length: length
  };

  charRNN.generate(options, donePredicting);
  select('#prediction').html('Predicting...');
  predictionIsRunning = true;
  lastSeedText = seed;
}

function donePredicting(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    var words= result.sample.split(',')
    console.log(words)
    select('#prediction').html(words[1]);
  }
  predictionIsRunning = false;
}

// force a re-predict when any slider gets moved
function rerunPrediction() {
  lastSeedText = '';
}
