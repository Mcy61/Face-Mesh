let video;
let predictions = []; //like the name tells, it predicts

//face
let list_face_X = [];
let list_face_Y = [];

//mouth
let list_mouth_X = [];
let list_mouth_Y = [];

//right eye
let list_R_eye_X = [];
let list_R_eye_Y = [];

//left eye
let list_L_eye_X = [];
let list_L_eye_Y = [];

//lips
let list_lips_X = [];
let list_lips_Y = [];

//complete face
let list_comp_face_X = [];
let list_comp_face_Y = [];

//triangle
let tria_x = []; //for the triangle
let tria_y = [];
let cor = []; //coordinates
const lenght_trias = 732; //see --> txt data coordinates_tria.txt
let count = 0;
let r_tone = []; //tone saving (color)
let g_tone = [];
let b_tone = [];

let color_hex = "#000000";

//colors for all structures
let color_face = [];
let color_mouth = [];
let color_R_eye = [];
let color_L_eye = [];
let color_Lips = [];
let color_correct_face = []; //meaning --> the face without the eyes and mouth

//for the intensity of the colors
let inten0 = 0;
let inten1 = 0;
let inten2 = 0;
let inten3 = 0;
let inten4 = 0;
let inten5 = 0;
let inten6 = 0;

function setup() { //Setup/Initialization of the webcam/Facemesh
  //createCanvas(1280, 960); //changed
  //videoGround = createCapture(VIDEO);
  createCanvas(1280, 960); //changed
  video = createCapture(VIDEO); 
  const facemesh = ml5.facemesh(video, modelReady); //default
  facemesh.on('predict', gotResults); //function from ml5
  video.hide(HSB);
  //We use the HSB (Hue, Saturation, Brightness) color mode to control the brightness more precisely which will get useful later in the code 
  noStroke(); //clearly
}

//draw function
function draw() {
    background(220);
    image(video, 0, 0, width, height);
    // draw will show us all the points, ok?
    //in draw keypoints there will be the face detection and a change on the face structure

    //draw_all_Triangles();
    //drawKeypoints();
    //draw_all_Triangles();
    selecting();
}

function label_setting(){
  const intensity = [document.getElementById('meinRang1').value,
                 document.getElementById('meinRang2').value,
                 document.getElementById('meinRang3').value,
                 document.getElementById('meinRang4').value,
                 document.getElementById('meinRang5').value,
                 document.getElementById('meinRang6').value,
                 document.getElementById('meinRang7').value]; //intensity ... for the colors

  const element = [document.getElementById('Rang1'),
                   document.getElementById('Rang2'),
                   document.getElementById('Rang3'),
                   document.getElementById('Rang4'),
                   document.getElementById('Rang5'),
                   document.getElementById('Rang6'),
                   document.getElementById('Rang7')];

  for (let i = 0; i < element.length; i++) {
    element[i].textContent = intensity[i] + "%";
  }

  const values = [intensity[0]/100,
                  intensity[1]/100,
                  intensity[2]/100,
                  intensity[3]/100,
                  intensity[4]/100,
                  intensity[5]/100,
                  intensity[6]/100];

  return [values];
}

function selecting(){
  //deleting the values, if not, the function will not work to your desire
  color_face = [];
  color_mouth = [];
  color_R_eye = [];
  color_L_eye = [];
  color_Lips = [];
  color_correct_face = [];
  const [inten] = label_setting();
  const [hx] = getColor();
  
  const check = [document.getElementById('check1').checked,
                 document.getElementById('check2').checked, 
                 document.getElementById('check3').checked,
                 document.getElementById('check4').checked,
                 document.getElementById('check5').checked,
                 document.getElementById('check6').checked,
                 document.getElementById('check7').checked];
  if (check[0] == true){ //Face_mask
    const [r1, g1, b1] = turnColor_correct(hx[0]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr1, gg1, bb1] = rgb_light(r1, g1, b1, 50); //with hsv and light effect
    color_face.push(rr1);
    color_face.push(gg1);
    color_face.push(bb1);
    //console.log(bb1);
    inten0 = inten[0];
    drawFace(0); 
  }

  if (check[1] == true){ //Lips
    const [r2, g2, b2] = turnColor_correct(hx[1]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr2, gg2, bb2] = rgb_light(r2, g2, b2, 50); //with hsv and light effect
    color_Lips.push(rr2);
    color_Lips.push(gg2);
    color_Lips.push(bb2);
    inten1 = inten[1];
    drawFace(4);
  }

  if (check[2] == true){ //Mouth
    const [r3, g3, b3] = turnColor_correct(hx[2]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr3, gg3, bb3] = rgb_light(r3, g3, b3, 50); //with hsv and light effect  
    color_mouth.push(rr3);
    color_mouth.push(gg3);
    color_mouth.push(bb3);
    inten2 = inten[2];
    drawFace(3);   
  }

  if (check[3] == true){ //Left Eye
    const [r4, g4, b4] = turnColor_correct(hx[3]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr4, gg4, bb4] = rgb_light(r4, g4, b4, 50); //with hsv and light effect  
    color_L_eye.push(rr4);
    color_L_eye.push(gg4);
    color_L_eye.push(bb4);
    inten3 = inten[3];
    drawFace(1); 
  }

  if (check[4] == true){ //Right Eye
    const [r5, g5, b5] = turnColor_correct(hx[4]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr5, gg5, bb5] = rgb_light(r5, g5, b5, 50); //with hsv and light effect  
    color_R_eye.push(rr5);
    color_R_eye.push(gg5);
    color_R_eye.push(bb5);
    inten4 = inten[4];
    drawFace(2);   
  }

  if (check[5] == true){ //Normal Face
    const [r6, g6, b6] = turnColor_correct(hx[5]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
    const [rr6, gg6, bb6] = rgb_light(r6, g6, b6, 50); //with hsv and light effect  
    color_correct_face.push(rr6);
    color_correct_face.push(gg6);
    color_correct_face.push(bb6);
    inten5 = inten[5];
    drawFace(5);
  }
  if (check[6] == true){ //Normal Face
      inten6 = inten[6];
      draw_all_Triangles();
  }
}

function modelReady(){
    console.log("Model is ready!");
}

function gotResults(results) {
    predictions = results;
}

function drawKeypoints() { //all ellipse
  //here we will connect all the important points
  
  //this line from 38 till 47 is from p5
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh; //scaledMesh --> scaling auf ein standard model/input

    console.log("Alle points" + keypoints.length);

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(255, 255, 255);
      ellipse(x*2, y*2, 5, 5); //*2 because, the video has the double with/height than previous
    }
  }
  
}

function Output(){ //Output, meaning the arrays from the mash
  //Coordinates for the face outline:
  //these coordinates are visible at the mash.map jpg file
  const face_outline = [150, 149, 176, 148, 152, 377,
                        400, 378, 379, 365, 397, 288,
                        361, 323, 454, 356, 389, 251, 
                        284, 332, 297, 338, 10, 109, 
                        67, 103, 54, 21, 162, 127, 
                        234, 93, 132, 58, 172, 136];
                        
  //now that we don't include the eyes for the coloring, we well exclude those eyes.

  //we will take innerest part of the eyes, ok?
  //from the perspective of me, when i am looking the picture
  const left_eye_outline = [33, 246, 161, 160, 159, 158, 
                            157, 173, 133, 155, 154, 153,
                            145, 144, 163, 7];

  const right_eye_outline = [362, 398, 384, 385, 386, 387,
                             388, 466, 263, 249, 390, 373,
                             374, 380, 381, 382];

  //the mouth design
  const mouth_outline = [17, 314, 405, 321, 375, 291, 409, 
                         270, 269, 267, 0, 37, 39, 40, 185,
                         61, 146, 91, 181, 84];

  //the lips will only be colored
  const lips_outline = [17, 314, 317, 14, 87, 178, 88, 95,
                        78, 191, 80, 81, 82, 13, 312, 311,
                        310, 415, 308, 324, 318, 402, 317, //everything but not the insides of the lips 
                        314, 405, 321, 375, 291, 409, 
                        270, 269, 267, 0, 37, 39, 40, 185,
                        61, 146, 91, 181, 84];

  //the complete face
  const complete_face_outline = [150, 149, 176, 148, 152, 377,
                                 400, 378, 379, 365, 397, 288,
                                 361, 323, 454, 356, 389, 251, 
                                 284, 332, 297, 338, 10, 109, 
                                 67, 103, 54, 21, 162,

                                 33, 246, 161, 160, 159, 158, // left eye top
                                 157, 173, 133,
                                 
                                 362, 398, 384, 385, 386, 387,   // right eye top
                                 388, 466, 263, 249, 390, 373,
                                 
                                 270, 409, 291, 375, 321, 405, 314, // Mouth
                                 17, 84, 181, 91, 146, 61, 185, 40,
                                 39, 37, 0, 267, 269, 270,
                                 
                                 373,                           // right eye bottom
                                 374, 380, 381, 382, 362,
                                 
                                 133, 155, 154, 153,        // Left eye bottom
                                 145, 144, 163, 7, 33,
                                 
                                 162,
                                 
                                 127, 
                                 234, 93, 132, 58, 172, 136];
              
  //return my values
  return [face_outline, left_eye_outline, right_eye_outline, mouth_outline, lips_outline, complete_face_outline];
}

function drawFace(number){

  const [face, L_eye, R_eye, mouth, lips, complete_face] = Output();
  
  if (number == 0){
    //face
    const [l_x, l_y] = get_XY(face);
    list_face_X = l_x;
    list_face_Y = l_y;
    polygon(0, list_face_X, list_face_Y);
  }

  if (number == 1){
    //left eye
    const [l_x, l_y] = get_XY(L_eye);
    list_L_eye_X = l_x;
    list_L_eye_Y = l_y;
    polygon(1, list_L_eye_X, list_L_eye_Y);
  }

  if (number == 2){
    //right eye
    const [l_x, l_y] = get_XY(R_eye);
    list_R_eye_X = l_x;
    list_R_eye_Y = l_y;
    polygon(2, list_R_eye_X, list_R_eye_Y);
  }

  if (number == 3){
    //mouth
    const [l_x, l_y] = get_XY(mouth);
    list_mouth_X = l_x;
    list_mouth_Y = l_y;
    polygon(3, list_mouth_X, list_mouth_Y);
  }

  if (number == 4){
    //lips
    const [l_x, l_y] = get_XY(lips);
    list_lips_X = l_x;
    list_lips_Y = l_y;
    polygon(4, list_lips_X, list_lips_Y);
  }

  if (number == 5){
    //complete face
    const [l_x, l_y] = get_XY(complete_face);
    list_comp_face_X = l_x;
    list_comp_face_Y = l_y;
    polygon(5, list_comp_face_X, list_comp_face_Y);
  }
}
function draw_all_Triangles(){
  const timeout = setTimeout(triangles_temps(), 5000);
}

function triangles_temps(){
  tria(10,151,108);
  tria(108,10,109);
  tria(108,69,109);
  tria(67,69,109);
  tria(104,67,69);
  tria(103,104,67);
  tria(68,103,104);
  tria(68,103,54);
  tria(54,68,71);
  tria(54,71,21);
  tria(21,71,139);
  tria(21,139,162);
  tria(139,162,34);
  tria(127,34,162);
  tria(227,127,34);
  tria(234,227,127);
  tria(137,234,227);
  tria(93,137,234);
  tria(177,137,93);
  tria(132,177,93);
  tria(58,177,132);
  tria(215,177,58);
  tria(58,215,172);
  tria(138,172,215);
  tria(136,172,138);
  tria(135,136,138);
  tria(150,135,136);
  tria(169,150,135);
  tria(149,169,150);
  tria(170,149,169);
  tria(140,149,170);
  tria(176,140,149);
  tria(171,140,176);
  tria(148,171,176);
  tria(152,171,148);
  tria(175,152,171);
  tria(396,175,152);
  tria(377,396,152);
  tria(400,377,396);
  tria(369,396,400);
  tria(378,369,400);
  tria(395,378,369);
  tria(394,378,395);
  tria(379,394,378);
  tria(364,394,379);
  tria(365,364,379);
  tria(367,365,364);
  tria(397,365,367);
  tria(435,397,367);
  tria(288,397,435);
  tria(401,288,435);
  tria(361,288,401);
  tria(323,361,401);
  tria(366,323,401);
  tria(454,366,323);
  tria(447,454,366);
  tria(356,454,447);
  tria(264,356,447);
  tria(389,356,264);
  tria(368,389,264);
  tria(251,389,368);
  tria(301,251,368);
  tria(284,251,301);
  tria(298,284,301);
  tria(332,284,298);
  tria(333,298,332);
  tria(297,333,332);
  tria(299,297,333);
  tria(338,299,297);
  tria(337,338,299);
  tria(10,338,337);
  tria(151,10,337);	// Outline finished
  tria(151,9,107);
  tria(108,151,107);
  tria(66,108,107);
  tria(69,66,108);
  tria(105,69,66);
  tria(104,105,69);
  tria(63,104,105);
  tria(68,63,104);
  tria(70,68,63);
  tria(71,70,68);
  tria(156,70,71);
  tria(139,71,156);
  tria(143,156,139);
  tria(34,143,139);
  tria(116,143,34);
  tria(227,116,34);
  tria(123,227,116);
  tria(137,123,227);
  tria(147,123,137);
  tria(177,147,137);
  tria(213,177,147);
  tria(215,213,177);
  tria(192,213,215);
  tria(138,192,215);
  tria(135,192,138);
  tria(214,135,192);
  tria(210,214,135);
  tria(169,210,135);
  tria(170,210,169);
  tria(211,170,210);
  tria(32,170,211);
  tria(140,32,170);
  tria(208,140,32);
  tria(171,208,140);
  tria(175,208,171);
  tria(199,175,208);
  tria(428,175,199);
  tria(396,428,175);
  tria(369,396,428);
  tria(262,369,428);
  tria(395,369,262);
  tria(431,395,262);
  tria(430,395,431);
  tria(394,430,395);
  tria(364,394,430);
  tria(434,364,430);
  tria(416,364,434);
  tria(367,416,364);
  tria(435,367,416);
  tria(433,435,416);
  tria(401,435,433);
  tria(376,401,433);
  tria(366,401,376);
  tria(352,366,376);
  tria(447,366,352);
  tria(345,447,352);
  tria(264,447,345);
  tria(372,264,345);
  tria(368,264,372);
  tria(383,372,368);
  tria(301,368,383);
  tria(300,301,383);
  tria(298,301,300);
  tria(293,298,300);
  tria(333,298,293);
  tria(334,333,293);
  tria(299,333,334);
  tria(296,299,334);
  tria(337,299,296);
  tria(336,337,296);
  tria(151,337,336);
  tria(9,151,336);	// Outline 2 finished
  tria(9,8,55);
  tria(107,55,9);
  tria(65,55,107);
  tria(66,65,107);
  tria(52,66,65);
  tria(105,52,66);
  tria(53,105,52);
  tria(63,53,105);
  tria(46,53,63);
  tria(70,46,63);
  tria(124,70,46);
  tria(156,124,70);
  tria(35,124,156);
  tria(143,35,156);
  tria(111,35,143);
  tria(116,111,143);
  tria(117,116,111);
  tria(123,116,117);
  tria(50,123,117);
  tria(187,50,123);
  tria(147,187,123);
  tria(192,147,187);
  tria(213,192,147);
  tria(207,187,192);
  tria(214,207,192);
  tria(216,214,207);
  tria(212,216,214);
  tria(210,212,214);
  tria(202,210,212);
  tria(211,210,202);
  tria(204,211,202);
  tria(194,204,211);
  tria(32,194,211);
  tria(201,194,32);
  tria(208,201,32);
  tria(200,208,201);
  tria(199,200,208);
  tria(428,199,200);
  tria(421,428,200);
  tria(262,428,421);
  tria(418,262,421);
  tria(431,262,418);
  tria(424,431,418);
  tria(422,431,424);
  tria(430,431,422);
  tria(432,430,422);
  tria(434,430,432);
  tria(436,434,432);
  tria(427,434,436);
  tria(416,434,427);
  tria(411,416,427);
  tria(433,376,416);
  tria(376,416,411);
  tria(352,376,411);
  tria(280,411,352);
  tria(346,352,280);
  tria(345,352,346);
  tria(340,346,345);
  tria(372,345,340);
  tria(265,372,340);
  tria(383,372,265);
  tria(353,383,265);
  tria(300,353,383);
  tria(276,353,300);
  tria(293,276,300);
  tria(283,293,276);
  tria(334,283,293);
  tria(282,334,283);
  tria(296,334,282);
  tria(295,296,282);
  tria(336,296,295);
  tria(285,336,295);
  tria(9,285,336);
  tria(8,9,285);		// Outline 3 finished
  tria(193,168,8);
  tria(55,8,193);
  tria(221,55,193);
  tria(222,55,221);
  tria(65,55,222);
  tria(52,65,222);
  tria(223,222,52);
  tria(224,223,52);
  tria(53,52,224);
  tria(225,53,224);
  tria(46,225,53);
  tria(113,46,225);
  tria(124,113,46);
  tria(226,113,124);
  tria(35,124,226);
  tria(31,226,35);
  tria(111,31,35);
  tria(117,111,31);
  tria(228,117,31);
  tria(118,228,117);
  tria(50,118,117);
  tria(101,50,118);
  tria(205,101,50);
  tria(187,205,50);
  tria(207,205,187);
  tria(206,207,205);
  tria(216,206,207);
  tria(92,216,206);
  tria(186,216,92);
  tria(212,186,216);
  tria(57,212,186);
  tria(43,57,212);
  tria(202,43,212);
  tria(106,43,202);
  tria(204,106,202);
  tria(182,106,204);
  tria(194,182,204);
  tria(201,194,182);
  tria(83,201,182);
  tria(200,201,83);
  tria(18,200,83);
  tria(313,200,18);
  tria(421,313,200);
  tria(406,421,313);
  tria(418,406,421);
  tria(424,418,406);
  tria(335,424,406);
  tria(422,335,424);
  tria(273,422,335);
  tria(432,422,273);
  tria(287,273,432);
  tria(410,287,432);
  tria(436,432,410);
  tria(322,410,436);
  tria(426,436,322);
  tria(427,426,436);
  tria(425,427,426);
  tria(411,427,425);
  tria(280,411,425);
  tria(330,280,425);
  tria(347,280,330);
  tria(346,347,280);
  tria(448,346,347);
  tria(261,448,346);
  tria(340,346,261);
  tria(265,340,261);
  tria(446,265,261);
  tria(353,446,265);
  tria(342,353,446);
  tria(276,342,353);
  tria(445,276,342);
  tria(283,445,276);
  tria(444,283,445);
  tria(282,444,283);
  tria(443,282,444);
  tria(442,443,282);
  tria(295,442,282);
  tria(285,295,442);
  tria(441,285,442);
  tria(417,441,285);
  tria(8,285,417);
  tria(168,8,417);		// Outline 4 finished
  tria(6,168,122);
  tria(193,122,168);
  tria(245,122,193);
  tria(189,245,193);
  tria(221,189,193);
  tria(56,221,189);
  tria(222,221,56);
  tria(28,56,222);
  tria(223,222,28);
  tria(27,28,223);
  tria(29,27,223);
  tria(224,29,223);
  tria(30,29,224);
  tria(225,30,224);
  tria(247,30,225);
  tria(113,247,225);
  tria(130,113,247);
  tria(226,113,130);
  tria(25,130,226);
  tria(31,25,226);
  tria(228,31,25);
  tria(110,25,228);
  tria(229,110,228);
  tria(118,229,228);
  tria(119,229,118);
  tria(101,119,118);
  tria(100,119,101);
  tria(36,100,101);
  tria(205,36,101);
  tria(206,205,36);
  tria(203,206,36);
  tria(165,203,206);
  tria(92,165,206);
  tria(39,92,165);
  tria(40,39,92);
  tria(186,92,40);
  tria(185,186,40);
  tria(57,185,186);
  tria(61,57,185);
  tria(146,61,57);
  tria(43,146,57);
  tria(91,43,146);
  tria(106,91,43);
  tria(182,106,91);
  tria(181,182,91);
  tria(84,182,181);
  tria(83,84,182);
  tria(18,84,83);
  tria(17,18,84);
  tria(314,18,17);
  tria(313,18,314);
  tria(406,313,314);
  tria(405,406,314);
  tria(321,406,405);
  tria(335,321,406);
  tria(273,321,335);
  tria(375,321,273);
  tria(287,273,375);
  tria(291,375,287);
  tria(409,291,287);
  tria(410,409,287);
  tria(270,409,410);
  tria(322,270,410);
  tria(269,270,322);
  tria(391,322,269);
  tria(426,322,391);
  tria(423,426,391);
  tria(266,426,423);
  tria(425,266,426);
  tria(330,266,425);
  tria(329,330,266);
  tria(348,330,329);
  tria(347,348,330);
  tria(449,347,348);
  tria(448,449,347);
  tria(339,449,448);
  tria(255,339,448);
  tria(261,448,255);
  tria(446,261,255);
  tria(359,446,255);
  tria(342,359,446);
  tria(467,342,359);
  tria(445,467,342);
  tria(260,445,467);
  tria(444,260,445);
  tria(259,444,260);
  tria(443,259,444);
  tria(257,443,259);
  tria(258,257,443);
  tria(442,443,258);
  tria(286,258,442);
  tria(441,286,442);
  tria(413,441,286);
  tria(417,441,413);
  tria(465,413,417);
  tria(351,465,417);
  tria(168,417,351);
  tria(6,168,351);		// Outline 5 finished
  tria(36,142,100);					// Start lines across face
  tria(126,100,142);
  tria(209,126,142);
  tria(198,209,126);
  tria(217,126,198);
  tria(174,217,198);
  tria(236,174,198);
  tria(196,174,236);
  tria(3,196,236);
  tria(197,3,196);
  tria(195,197,3);
  tria(248,195,197);
  tria(419,248,197);
  tria(456,248,419);
  tria(399,456,419);
  tria(420,456,399);
  tria(437,399,420);
  tria(355,437,420);
  tria(429,355,420);
  tria(371,355,429);
  tria(329,371,355);
  tria(266,329,371);		// Line 1 finished
  tria(39,165,167);
  tria(37,39,167);
  tria(164,167,37);
  tria(0,164,37);
  tria(267,164,0);
  tria(393,267,164);
  tria(269,267,393);
  tria(391,269,393);		// Line 2 finished
  tria(203,98,165);
  tria(167,165,98);
  tria(97,98,167);
  tria(164,167,97);
  tria(2,164,97);
  tria(326,2,164);
  tria(393,326,164);
  tria(327,393,326);
  tria(391,327,393);
  tria(423,391,327);
  tria(358,327,423);
  tria(266,358,423);
  tria(371,358,266);
  tria(429,371,358);
  tria(279,429,358);
  tria(420,279,429);
  tria(360,420,279);
  tria(363,420,360);
  tria(456,363,420);
  tria(281,456,363);
  tria(248,281,456);
  tria(195,248,281);
  tria(5,281,195);
  tria(51,5,195);
  tria(3,195,51);
  tria(236,51,3);
  tria(134,51,236);
  tria(198,236,134);
  tria(131,198,134);
  tria(49,131,198);
  tria(209,198,49);
  tria(129,49,209);
  tria(142,209,129);
  tria(36,142,129);
  tria(203,36,129);
  tria(98,203,129);		// Line 3 finished
  tria(6,197,196);
  tria(122,196,6);
  tria(188,122,196);
  tria(174,188,196);
  tria(114,174,188);
  tria(217,114,174);
  tria(47,114,217);
  tria(126,47,217);
  tria(100,47,126);
  tria(120,100,47);
  tria(119,120,100);
  tria(230,120,119);
  tria(229,230,119);
  tria(24,229,230);
  tria(110,24,229);
  tria(23,24,230);
  tria(231,230,23);
  tria(22,231,23);
  tria(232,231,22);
  tria(26,22,232);
  tria(112,26,232);
  tria(233,232,112);
  tria(243,112,233);
  tria(244,243,233);
  tria(128,233,244);
  tria(245,128,244);
  tria(114,128,245);
  tria(188,114,245);
  tria(122,188,245);		// left line finished
  tria(6,197,419);
  tria(351,6,419);
  tria(412,419,351);
  tria(399,412,419);
  tria(343,399,412);
  tria(437,343,399);
  tria(277,343,437);
  tria(355,277,437);
  tria(329,277,355);
  tria(349,329,277);
  tria(348,349,329);
  tria(450,348,449);
  tria(450,348,349);
  tria(254,449,450);
  tria(339,449,254);
  tria(253,450,254);
  tria(451,253,450);
  tria(252,451,253);
  tria(452,451,252);
  tria(256,452,252);
  tria(341,256,452);
  tria(453,341,452);
  tria(463,341,453);
  tria(464,463,453);
  tria(357,464,453);
  tria(465,464,357);
  tria(343,357,465);
  tria(412,465,343);
  tria(351,465,412);		// right line finished
  tria(47,114,121);
  tria(128,121,114);
  tria(232,128,121);
  tria(233,128,232);
  tria(231,232,121);
  tria(230,231,120);
  tria(231,120,121);
  tria(121,120,47);
  tria(244,245,189);
  tria(190,244,189);
  tria(243,244,190);
  tria(173,243,190);
  tria(133,173,243);
  tria(157,173,190);
  tria(56,157,190);
  tria(189,56,190);
  tria(158,157,56);
  tria(28,56,158);
  tria(159,28,158);
  tria(27,28,159);
  tria(29,27,159);
  tria(160,29,159);
  tria(30,29,160);
  tria(161,30,160);
  tria(247,30,161);
  tria(246,247,161);
  tria(33,247,246);
  tria(130,33,247);
  tria(25,130,33);
  tria(7,33,25);
  tria(110,7,25);
  tria(163,110,7);
  tria(144,110,163);
  tria(24,144,110);
  tria(23,24,144);
  tria(145,144,23);
  tria(153,145,23);
  tria(22,153,23);
  tria(154,153,22);
  tria(26,22,154);
  tria(155,154,26);
  tria(112,26,155);
  tria(133,155,112);
  tria(243,112,133);		// Left eye finished
  tria(452,453,357);
  tria(350,452,357);
  tria(343,350,357);
  tria(277,350,343);
  tria(349,350,277);
  tria(451,349,350);
  tria(452,350,451);
  tria(450,451,349);
  tria(465,464,413);
  tria(414,413,464);
  tria(286,413,414);
  tria(463,464,414);
  tria(362,398,463);
  tria(398,463,414);
  tria(384,398,414);
  tria(286,384,414);
  tria(385,384,286);
  tria(258,286,385);
  tria(386,385,258);
  tria(257,386,258);
  tria(259,386,257);
  tria(387,259,386);
  tria(260,387,259);
  tria(388,260,387);
  tria(467,388,260);
  tria(466,467,388);
  tria(263,467,466);
  tria(359,263,467);
  tria(255,263,359);
  tria(249,263,255);
  tria(339,249,255);
  tria(390,249,339);
  tria(373,390,339);
  tria(254,373,339);
  tria(253,373,254);
  tria(374,373,253);
  tria(380,374,253);
  tria(252,380,253);
  tria(381,252,380);
  tria(256,381,252);
  tria(382,256,381);
  tria(341,382,256);
  tria(362,382,341);
  tria(463,341,362);		// Right eye finished
  tria(129,102,49);					// Start Nose
  tria(48,49,102);
  tria(131,49,48);
  tria(115,131,48);
  tria(220,115,131);
  tria(134,220,131);
  tria(45,134,220);
  tria(51,45,134);
  tria(5,45,51);
  tria(4,5,45);
  tria(275,4,5);
  tria(281,275,5);
  tria(363,275,281);
  tria(440,275,363);
  tria(360,363,440);
  tria(344,360,440);
  tria(278,360,344);
  tria(279,278,360);
  tria(331,278,279);
  tria(358,331,279);
  tria(294,331,358);
  tria(327,294,358);
  tria(460,294,327);
  tria(326,460,327);
  tria(328,326,460);
  tria(462,328,326);
  tria(370,462,326);
  tria(2,326,370);
  tria(94,370,2);
  tria(141,94,2);
  tria(97,141,2);
  tria(242,97,141);
  tria(99,97,242);
  tria(240,99,97);
  tria(98,97,240);
  tria(64,240,98);
  tria(129,64,98);
  tria(102,64,129);	// Nose Outline 1
  tria(102,48,64);
  tria(219,48,64);
  tria(235,219,64);
  tria(240,235,64);
  tria(75,235,240);
  tria(99,240,75);
  tria(60,99,75);
  tria(20,60,99);
  tria(242,20,99);
  tria(238,20,242);
  tria(241,242,238);
  tria(141,242,241);
  tria(125,241,141);
  tria(94,141,125);
  tria(19,125,94);
  tria(354,19,94);
  tria(370,354,94);
  tria(461,354,370);
  tria(462,370,461);
  tria(458,461,462);
  tria(250,458,462);
  tria(328,250,462);
  tria(290,328,250);
  tria(305,328,290);
  tria(460,305,328);
  tria(455,460,305);
  tria(294,455,460);
  tria(439,455,294);
  tria(278,294,439);
  tria(331,294,278);
  tria(344,439,278);
  tria(438,344,439);
  tria(440,438,344);
  tria(457,440,438);
  tria(274,457,440);
  tria(275,274,440);
  tria(1,274,275);
  tria(1,4,275);
  tria(45,1,4);
  tria(44,45,1);
  tria(220,44,45);
  tria(237,220,44);
  tria(218,237,220);
  tria(115,218,220);
  tria(219,115,218);
  tria(48,219,115);		// Nose Outline 2
  tria(59,219,235);
  tria(75,59,235);
  tria(166,219,59);
  tria(75,166,59);
  tria(60,166,75);
  tria(218,219,166);
  tria(79,218,166);
  tria(60,79,166);
  tria(20,79,60);
  tria(239,79,218);
  tria(238,20,79);
  tria(239,79,238);
  tria(237,218,239);
  tria(241,238,239);
  tria(237,239,241);
  tria(44,237,241);
  tria(125,241,44);
  tria(19,125,44);
  tria(1,19,44);
  tria(274,1,19);
  tria(354,274,19);
  tria(461,274,354);
  tria(457,461,274);
  tria(459,457,461);
  tria(458,461,459);
  tria(438,459,457);
  tria(309,438,459);
  tria(458,459,309);
  tria(250,458,309);
  tria(392,309,438);
  tria(439,392,438);
  tria(289,392,439);
  tria(455,289,439);
  tria(305,289,455);
  tria(392,305,289);
  tria(290,392,305);
  tria(309,290,392);
  tria(250,309,290);
}

function getRandomInt(max) { //create a random number
  return Math.floor(Math.random() * max);
}

function tria(cor1, cor2, cor3){ //the creation of a triange, with 3 coordinates
  if (count < lenght_trias){
    if (count == 0){ //resetting the values
      r_tone = [];
      g_tone = [];
      b_tone = [];
      tria_x = [];  
      tria_y = [];
    }
    
    count++;

  cor = [cor1, cor2, cor3];
  const [l_x, l_y] = get_XY(cor);

  tria_x.push(l_x);
  tria_y.push(l_y);

  //console.log(tria_x[0]);
  const [hx] = getColor();
  const [r, g, b] = turnColor_correct(hx[6]); //get the rgb colors, which were hex colors before, but are now turned to rgb colors
  const[r_n, g_n, b_n] = rgb_light(r, g, b, getRandomInt(60) - 30); //with hsv and light effect, 60 max and min -30

  //saving the coordinates
  r_tone.push(r_n);
  g_tone.push(g_n);
  b_tone.push(b_n);
  
  }
  else
  {
  count = 0;

  r_n = get_middle_color(r_tone);
  g_n = get_middle_color(g_tone);
  b_n = get_middle_color(b_tone);
  
  for (let i = 0; i < tria_x.length; i++) {
    let tria_temp_x = tria_x[i];
    let tria_temp_y = tria_y[i];
    
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(tria_temp_x[0]*2, tria_temp_y[0]*2);
    for (let z = 1; z < tria_temp_x.length; z++){
      ctx.lineTo(tria_temp_x[z]*2, tria_temp_y[z]*2);
    }
    ctx.Style = 
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten6})`;
    ctx.fill();
    ctx.closePath();
    }
  }
}

function get_middle_color(array_color)
{
  let temp = 0;
  for (let i = 0; i < array_color.length; i++) {
    temp += array_color[i];
    
  }
  color_x = temp / array_color.length;

  return color_x;
}
function get_XY(ob){ //object coordinates ... object coor
  let list_x = [];
  let list_y = [];

  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    for (let j = 0; j < ob.length; j += 1) {

      if (j == 0){
        list_x = [];
        list_y = [];
      }

      const [x, y] = keypoints[ob[j]];

      list_x.push(x);
      list_y.push(y);
    }
    break;
  }
  return [list_x, list_y];
}

function rgb_light(r, g, b, light)
{
  let [h, s, v] = rgb_to_hsv(r, g, b);
  
  if (v + light > 99)
    {
      v = 100;
    } else if (v + light < 1)
    {
      v = 0;
    } else
    {
      v = v + light;
    }

  const[r_n, g_n, b_n] = hsv_to_rgb(h, s, v); //n ... new

  return [r_n, g_n, b_n];
}

function polygon(start, cor_X, cor_Y){
  if (start == 0){ //face outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }
    const r_n = color_face[0]
    const g_n = color_face[1]
    const b_n = color_face[2];
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten0})`;
    ctx.fill();
    ctx.closePath();
  }

  if (start == 1){ //left eye outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }

    const r_n = color_L_eye[0];
    const g_n = color_L_eye[1];
    const b_n = color_L_eye[2];
    console.log(r_n);
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten3})`;
    ctx.fill();

    ctx.closePath();
  }

  if (start == 2){ //right eye outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }

    const r_n = color_R_eye[0];
    const g_n = color_R_eye[1];
    const b_n = color_R_eye[2];
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten4})`;
    ctx.fill();
    ctx.closePath();
  }

  if (start == 3){ //mouth outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }

    const r_n = color_mouth[0];
    const g_n = color_mouth[1];
    const b_n = color_mouth[2];
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten2})`;
    ctx.fill();
    ctx.closePath();
  }

  if (start == 4){ //lips outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }

    const r_n = color_Lips[0];
    const g_n = color_Lips[1];
    const b_n = color_Lips[2];
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten1})`;
    ctx.fill();
    ctx.closePath();
  }

  if (start == 5){ //complete face outline
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(cor_X[0]*2, cor_Y[0]*2);

    for (let i = 1; i < cor_X.length; i++){
      ctx.lineTo(cor_X[i]*2,cor_Y[i]*2); //ICH HASSE MAL 2/I HATE TO MULTIPLY BY 2
    }

    const r_n = color_correct_face[0];
    const g_n = color_correct_face[1];
    const b_n = color_correct_face[2];
    ctx.fillStyle = `rgba(${r_n}, ${g_n}, ${b_n}, ${inten5})`;
    ctx.fill();
    ctx.closePath();
  }
}

function turnColor_correct(color){
const rgb_color = hexToRgb(color);
return rgb_color;
}

function getColor(){ 
  const color_hex = [document.getElementById('col_1').value, //F_mask
                 document.getElementById('col_2').value, //lip
                 document.getElementById('col_3').value, //Mouth
                 document.getElementById('col_4').value, //Left Eye
                 document.getElementById('col_5').value, //Right Eye
                 document.getElementById('col_6').value, //Normal Face
                 document.getElementById('col_7').value]; //Normal Face
  
  return [color_hex];
}

function hexToRgb(hex_color) { //this function is from the internet --> it turns hex --> rgba, quite usefull
  const bigint = parseInt(hex_color.slice(1), 16); 
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

//Expanded Part - from the internet

//h ... hue -> 0 ... 360
//s ... saturation -> 0 ... 100
//v ... value (brightness) -> 0 ... 100
function rgb_to_hsv (r, g, b) { 
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  h = Math.round(h * 360);
  s = percentRoundFn(s * 100);
  v = percentRoundFn(v * 100);

  return [h,s,v];
}

function hsv_to_rgb(hh, ss, bb) {

  var rgb = { };
  var h = Math.round(hh);
  var s = Math.round(ss * 255 / 100);
  var v = Math.round(bb * 255 / 100);

      if (s == 0) {

      rgb.r = rgb.g = rgb.b = v;
      } else {
      var t1 = v;
      var t2 = (255 - s) * v / 255;
      var t3 = (t1 - t2) * (h % 60) / 60;

          if (h == 360) h = 0;

              if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
              else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
              else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
              else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
              else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
              else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
              else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
      }
    r = Math.round(rgb.r);
    g = Math.round(rgb.g);
    b = Math.round(rgb.b);

    return [r,g,b];
}