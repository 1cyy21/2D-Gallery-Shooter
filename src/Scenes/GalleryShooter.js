// Name: Kieran Chu

class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("GalleryShooter");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.enemiesPerRow = 6;
        this.numRows = 4;

    }


    preload(){
        this.load.setPath("./assets/gameassets");
        this.load.image("Jerbo", "tile_0260.png");
        this.load.image("bullet", "tile_0221.png");
        this.load.image("enemy1", "tile_0343.png");
        this.load.image("enemy2", "tile_0363.png");

        // enemy 1 animations
        this.load.image("enemy1_dead", "tile_0344.png");
        this.load.image("dead_anim_1", "tile_0022.png");
        this.load.image("dead_anim_2", "tile_0021.png");
        this.load.image("dead_anim_3", "tile_0020.png");

        // enemy 2 animations
        this.load.image("enemy2_dead_1", "tile_0364.png");
        this.load.image('enemy2_dead_2', 'tile_0365.png');

        // health animations
        this.load.image("heart_anim_1", "tile_0042.png");
        this.load.image("heart_anim_2", "tile_0041.png");
        this.load.image("heart_anim_3", "tile_0040.png");


        this.load.audio("shoot_sfx", "laserRetro_002.ogg");
    }
        
    create(){
        let my = this.my;

        this.JerboX = window.innerWidth / 5.5;
        this.JerboY = window.innerHeight - 50;

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerSpeed = 5;

        this.Score = 0;
        this.lives = 3; 
        this.hearts = [];
        this.enemyBullets = [];

        // score display
        this.scoreText = this.add.text(this.cameras.main.width - 10, 10, `Score: ${this.Score}`, {
            fontSize: '16px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(1, 0); 

        // heart display
        for (let i = 0; i < this.lives; i++){
            let heartLogo = this.add.sprite((this.cameras.main.width - 475) + i * 35, 35, "heart_anim_1");
            heartLogo.setScale(2);
            heartLogo.setOrigin(0, 1);
            this.hearts.push(heartLogo);
        }

        // shoot sfx
        this.shootSfx = this.sound.add("shoot_sfx", {
            volume: 0.05
        });
        
        // enemy 1 killed animation
        this.anims.create({
            key: "dead_enemy1",
            frames: [
                {key: "dead_anim_1"},
                {key: "dead_anim_2"},
                {key: "dead_anim_3"},
                {key: "enemy1_dead"}
            ],
            frameRate: 10,
            hideOnComplete: true
        });

        // enemy 2 killed animation
        this.anims.create({
            key: "dead_enemy2",
            frames: [
                {key: "dead_anim_1"},
                {key: "dead_anim_2"},
                {key: "dead_anim_3"},
                {key: "enemy2_dead_1"},
                {key: "enemy2_dead_2"}
            ],
            frameRate: 10, 
            hideOnComplete: true
        });
        
        // heart lost animation
        this.anims.create({
            key: "heartlost",
            frames: [
                {key: "heart_anim_1"},
                {key: "heart_anim_2"},
                {key: "heart_anim_3"}
            ],
            frameRate: 10,
            hideOnComplete: true
        });

        my.sprite.Jerbo = new Player(this, this.JerboX, this.JerboY, "Jerbo", 0, this.left, this.right, this.shoot, this.playerSpeed, 10, 10, this.shootSfx);
        my.sprite.Jerbo.scale = 2.5;

        // enemy spawn locations 
        my.sprite.enemies = [];
        this.createEnemyWave(my.sprite.enemies, this.enemiesPerRow, this.numRows);
    }

    update(time, delta){
        let my = this.my;
        let dt = delta / 16.66; 
        my.sprite.Jerbo.update(time, delta);
        // update enemies
        for (let enemy of my.sprite.enemies) {
            enemy.update(time, delta);
        }
        
        // move enemy bullets
        for (let bullet of this.enemyBullets) {
            bullet.y += bullet.velocityY * dt;
        }

        // filter enemy bullets offscreen
        this.enemyBullets = this.enemyBullets.filter(bullet => bullet.y < this.cameras.main.height + bullet.displayHeight);

        // collision with enemy bullets and player
        for (let bullet of this.enemyBullets) {
            if (this.collides(my.sprite.Jerbo, bullet)) {
                bullet.y = this.cameras.main.height + 100; // remove bullet
                //update hearts
                this.loseLife();
            }
        }
        

        // collision 
        for (let bi = my.sprite.Jerbo.bullets.length - 1; bi >= 0; bi--) {
            let bullet = my.sprite.Jerbo.bullets[bi];
            for (let ei = my.sprite.enemies.length - 1; ei >= 0; ei--) {
                let enemy = my.sprite.enemies[ei];
                if (enemy.visible && this.collides(enemy, bullet)) {
                    // play death animation through the scene animation manager
                    enemy.visible = true; 
                    enemy.play("dead_enemy1");
                    bullet.y = -100;

                    // update score
                    this.Score += enemy.score;
                    this.scoreText.setText(`Score: ${this.Score}`);

                    // remove the enemy from the active enemy list immediately
                    my.sprite.enemies.splice(ei, 1);
                    if (enemy.descentTween){
                        enemy.descentTween.stop();
                    }

                    // destroy the sprite when animation completes
                    enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        enemy.destroy();
                    }, this);

                    break; 
                } 
            }
        }

        // if enemy reaches player
        for (let ei = my.sprite.enemies.length - 1; ei >= 0; ei--){
            let enemy = my.sprite.enemies[ei];
            if (enemy.visible && enemy.y >= my.sprite.Jerbo.y){
                my.sprite.enemies.splice(ei, 1);
                if (enemy.descentTween) enemy.descentTween.stop();
                enemy.destroy();
                this.loseLife();
            }
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    loseLife(){
        if (this.hearts.length > 0){
            let lastHeart = this.hearts.pop();
            lastHeart.play("heartlost");
            lastHeart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => 
                lastHeart.destroy()
            );
            this.lives--;
            if (this.lives <= 0){
                this.scene.start("GameOver", { score : this.Score});
            }
        }
    }

    createEnemyWave(enemyArray, enemiesPerRow, numRows){
        const screenW = this.cameras.main.width;
        const screenH = this.cameras.main.height;
        const columnGap = screenW / this.enemiesPerRow;
        const rowGap = (screenH/2) / (this.numRows + 1);

        for(let row = 0; row < this.numRows; row++){
            for (let col = 0; col < this.enemiesPerRow; col++){
                let x = (col + 0.5) * columnGap;
                let y =  rowGap * (row + 1);
                let startingGroup = row % 2; 
                let enemy = new Enemy(this, x, y, "enemy1", 0, 50, col % 2, startingGroup, 5000, 1);
                enemy.scale = 2.5;
                enemyArray.push(enemy);
            }
        }
    }
}

