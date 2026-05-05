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

        // audio sfx
        this.load.audio("shoot_sfx", "laserRetro_002.ogg");
        this.load.audio("enemy_shoot_sfx", "laserSmall_000.ogg");
        this.load.audio("enemy_hit_sfx", "laserRetro_000.ogg");
        this.load.audio("player_hit_sfx", "laserRetro_001.ogg");
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
        this.wave = 1;
        this.waveTransition = false;

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

        // player hit sfx
        this.playerHitSfx = this.sound.add("player_hit_sfx", {
            volume: 0.1
        });

        // enemy shoot sfx
        this.enemyShootSfx = this.sound.add("enemy_shoot_sfx", {
            volume: 0.05
        });

        // enemy hit sfx
        this.enemyHitSfx = this.sound.add("enemy_hit_sfx", {
            volume: 0.05
        });
        
        // enemy 1 killed animation
        if (!this.anims.exists("dead_enemy1")){
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
        }

        // enemy 2 killed animation
        if (!this.anims.exists("dead_enemy2")){
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
        }
        
        // heart lost animation
        if (!this.anims.exists("heartlost")){
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
        }

        my.sprite.Jerbo = new Player(this, this.JerboX, this.JerboY, "Jerbo", 0, this.left, this.right, this.shoot, this.playerSpeed, 10, 10, this.shootSfx);
        my.sprite.Jerbo.scale = 2.5;

        // enemy spawn locations 
        my.sprite.enemies = [];
        this.enemy2num = 4;
        this.createEnemy1Wave();
        this.createEnemy2Wave(this.enemy2num);
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

        // enemy bullets & player collision
        for (let bullet of this.enemyBullets) {
            if (this.collides(my.sprite.Jerbo, bullet)) {
                bullet.y = this.cameras.main.height + 100; // remove bullet

                // play player hit sfx
                this.playerHitSfx.play();

                //update hearts
                this.loseLife();
            }
        }
        

        // bullet & enemy collision 
        for (let bi = my.sprite.Jerbo.bullets.length - 1; bi >= 0; bi--) {
            let bullet = my.sprite.Jerbo.bullets[bi];
            for (let ei = my.sprite.enemies.length - 1; ei >= 0; ei--) {
                let enemy = my.sprite.enemies[ei];
                if (enemy.visible && this.collides(enemy, bullet)) {
                    // play death animation through the scene animation manager
                    enemy.visible = true; 
                    enemy.play(enemy.deathAnim);
                    bullet.y = -100;
                    this.enemyHitSfx.play();

                    // update score
                    this.Score += enemy.score;
                    this.scoreText.setText(`Score: ${this.Score}`);

                    // remove the enemy from the active enemy list immediately
                    my.sprite.enemies.splice(ei, 1);
                    this.tweens.killTweensOf(enemy);

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
                this.playerHitSfx.play();
            }
        }

        if (my.sprite.enemies.length <= 0 && !this.waveTransition){
            this.startNextWave();

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
        }
        this.lives--;
        if (this.lives <= 0){
            this.scene.start("GameOver", {score: this.Score, wave: this.wave});
        }
    }

    createEnemy1Wave(){
        const screenW = this.cameras.main.width;
        const screenH = this.cameras.main.height;
        const columnGap = screenW / this.enemiesPerRow;
        const rowGap = (screenH/2) / (this.numRows + 1);

        for(let row = 0; row < this.numRows; row++){
            for (let col = 0; col < this.enemiesPerRow; col++){
                let x = (col + 0.5) * columnGap;
                let y =  rowGap * (row + 1);
                let startingGroup = row % 2; 
                let enemy = new Enemy(this, x, y, "enemy1", 0, 50, col % 2, startingGroup, 5000, 1, this.enemyShootSfx);
                enemy.scale = 2.5;
                enemy.shootTimer = Phaser.Math.Between(0, enemy.shootInterval - 500);
                this.my.sprite.enemies.push(enemy);
            }
        }
    }

    createEnemy2Wave(count){
        const screenW = this.cameras.main.width;
        const screenH = this.cameras.main.height;
        const rowGap = (screenH / 2) / (this.numRows + 1); 

        const spawnTop = rowGap * (this.numRows + 1);
        const spawnBot = this.JerboY - 200;
        const side = 40;

        for (let i = 0; i < count; i++){
            let x, y, tooClose;
            let attempts = 0;
            do {
                x = Phaser.Math.Between(side + 150, screenW - side - 150);
                y = Phaser.Math.Between(spawnTop, spawnBot);
                tooClose = this.my.sprite.enemies.some(e => Math.hypot(e.x - x, e.y - y) < 60);
                attempts++;
            } while (tooClose && attempts < 20);

            let enemy = new Enemy(this, x, y, "enemy2", 0, 100, 0, 0, 5000, 2, this.enemyShootSfx);
            enemy.scale = 2.5;
            enemy.shootTimer = Phaser.Math.Between(0, enemy.shootInterval);
            this.my.sprite.enemies.push(enemy);
        }
    }

    startNextWave(){
        this.waveTransition = true;

        for (let bullet of this.enemyBullets) bullet.destroy();
        this.enemyBullets = [];

        const centerX = this.cameras.main.width/2;
        const centerY = this.cameras.main.height/2;
        const style = {
            fontSize: '28px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff'
        };

        let clearedMsg = this.add.text(centerX, centerY - 20, `Wave ${this.wave} cleared!`, style).setOrigin(0.5);
        this.waveClearMsg = this.tweens.add({
            targets: clearedMsg, 
            y: "-=15",
            duration: 1500,
            yoyo: true, 
            repeat: -1
        });
        this.time.delayedCall(1500, () => {
            this.wave++;

            let nextMsg = this.add.text(clearedMsg.x, clearedMsg.y + 40, `Wave ${this.wave} start!`, style).setOrigin(0.5);
            this.nextWaveMsg = this.tweens.add({
                targets: nextMsg, 
                y: "+=15",
                duration: 1500,
                yoyo: true,
                repeat: -1
            });

            this.time.delayedCall(1500, () =>{
                nextMsg.destroy();
                clearedMsg.destroy();
                this.createEnemy1Wave();
                this.enemy2num++;
                this.createEnemy2Wave(this.enemy2num);
                this.waveTransition = false;
            });
        });
    }
}

