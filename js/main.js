window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('office', 'assets/office.jpg');
    game.load.image('desk', 'assets/desk.jpg');
    game.load.image('question', 'assets/question.png');
    game.load.spritesheet('guy', 'assets/guyinsuit.png', 30, 32);
    game.load.audio('pickup', 'assets/pickup.mp3');
    game.load.audio('dying', 'assets/dying.mp3');
    game.load.spritesheet('enemy', 'assets/enemy.png', 30, 50);
}

var player;
var platforms;
var cursors;

var questions;
var score = 0;
var pickup;
var enemy1; 
var enemy2;
var enemy3;
var dying; 
    
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, 600);
    //  A simple background for our game
    var sky = game.add.sprite(-150, -150, 'office');
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'desk');
    //platforms.create(400, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(10, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'desk');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1000, 300, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1100,100, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1700,350, 'desk');
    ledge.body.immovable = true;
 
    player = game.add.sprite(32, game.world.height - 150, 'guy');
    enemy1 = game.add.sprite(1500, game.world.height - 97, 'enemy');
    enemy2 = game.add.sprite(10, 216, 'enemy');
    enemy3 = game.add.sprite(1000, 270, 'enemy');
    
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(enemy1);
    game.physics.arcade.enable(enemy2);
    game.physics.arcade.enable(enemy3);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    enemy1.body.collideWorldBounds = true;
    enemy2.body.collideWorldBounds = true;
    enemy3.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [3, 4, 5], 13, true);
    player.animations.add('right', [6, 7, 8], 13, true);
    enemy1.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy1.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy2.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy2.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy3.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy3.animations.add('right1', [8, 9, 10, 11], 15, true);

    //  Finally some stars to collect
    questions = game.add.group();

    //  We will enable physics for any star that is created in this group
    questions.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var question = questions.create(i * 165, 0, 'question');

        //  Let gravity do its thing
        question.body.gravity.y = 300;
    }

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    pickup = game.add.audio('pickup');
    dying = game.add.audio('dying');
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(questions, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, questions, collectQs, null, this);
    game.physics.arcade.overlap(player, enemy1, Enemy1HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy2, Enemy2HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy3, Enemy3HitPlayer, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    enemy1.body.velocity.x = 0;
    enemy2.body.velocity.x = 0;
    enemy3.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
        enemy1.body.velocity.x = 75;
        enemy1.animations.play('right1');
        enemy2.body.velocity.x = 100;
        enemy2.animations.play('right1');
        enemy3.body.velocity.x = 50;
        enemy3.animations.play('right1');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        enemy1.body.velocity.x = -75;
        enemy1.animations.play('left1');
        enemy2.body.velocity.x = -100;
        enemy2.animations.play('left1');
        enemy3.body.velocity.x = -50;
        enemy3.animations.play('left1');
    }
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 0;
        enemy1.animations.stop();
        enemy1.frame = 0;
        enemy2.animations.stop();
        enemy2.frame = 0;
        enemy3.animations.stop();
        enemy3.frame = 0;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectQs (player, question) {
    
    // Removes the star from the screen
    question.kill();
    pickup.play();
    //  Add and update the score
    score += 10;
    if(score === 120)
    {
        game.add.text(game.world.centerX, game.world.centerY+125, 'Nice Job, you got all the questions \n and got the job!', {        fontSize: '32px',    fill: 'white' });
    }

}
function Enemy1HitPlayer(player,enemy1)
    {
        player.kill();
        dying.play();
        game.add.text(enemy1.x-50, enemy1.y-100, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
    }
function Enemy2HitPlayer(player,enemy2)
    {
        player.kill();
        dying.play();
        game.add.text(enemy2.x, enemy2.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' }); 
     
    }
function Enemy3HitPlayer(player,enemy3)
    {
        player.kill();
        dying.play();
        game.add.text(enemy3.x, enemy3.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
        
    }
};