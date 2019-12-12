// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

viewer = pannellum.viewer('panorama', ﻿{
  "panorama": "pano.jpg",
  "autoLoad": true,
  "showControls": false
});
let video;
let poseNet;
let poses = [];
var leftEyePosition;
var previousEyePosition = 900;
var initialize = false;
var initialEye;
var actualEye;
var initialEyeVertical;
var actualEyeVertical;

function setup() {
  createCanvas(1920, 1080);
  video = createCapture(VIDEO);
  video.size(width, height);
  document.getElementById("defaultCanvas0").style.transform = "scaleX(-1)";
  document.getElementById("defaultCanvas0").style.height = "100vh";
  document.getElementById("defaultCanvas0").style.width = "100%";

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  console.log("robim kameru");
  video.hide();
}


function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  //drawSkeleton();
}
// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  if(poses.length > 0){
    // For each pose detected, loop through all the keypoints
    let pose = poses[0].pose;
    if(pose.keypoints[0].score > 0.8){
      actualEye = pose.keypoints[0].position.x;
      actualEyeVertical = pose.keypoints[0].position.y;
      /*if(initialize == false){
        initialEye = actualEye;
        initialEyeVertical = actualEyeVertical;
        initialize = true;
      }*/
      if(actualEye > 1 && actualEye < 1920){
        var newValue = (actualEye-960)*(0.035);
        viewer.setYaw(newValue, 100);
      }
      if(actualEyeVertical > 1 && actualEyeVertical < 1080){
        var newValue = (actualEyeVertical-540)*(0.035);
        viewer.setPitch(newValue, 100);
      }
     // viewer.setPitch(actualEyeVertical);
      /*if((initialEye - actualEye) > 100 ){
        viewer.setYaw(viewer.getYaw() - 10);
        initialEye = actualEye;
      }
      if((actualEye - initialEye) > 100){
        viewer.setYaw(viewer.getYaw() + 10);
        initialEye = actualEye;
      }
      if((initialEyeVertical - actualEyeVertical) > 50){
        viewer.setPitch(viewer.getPitch() - 10);
        initialEyeVertical = actualEyeVertical;
      }
      if((actualEyeVertical - initialEyeVertical) > 50){
        viewer.setPitch(viewer.getPitch() + 10);
        initialEyeVertical = actualEyeVertical;
      }*/
    }
    /*for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }*/
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
