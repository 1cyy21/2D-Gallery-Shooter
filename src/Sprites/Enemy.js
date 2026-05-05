class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, score, enemyGroup, startingGroup, cycleTime, enemyType, shootSfx) {
        super(scene, x, y, texture, frame);
        
        this.score = score;

        this.currentGroup = startingGroup;
        this.enemyGroup = enemyGroup;
        this.cycleTime = cycleTime;
        this.timer = 0;
        this.shootInterval = this.cycleTime;
        this.appearShootDelay = 1500;
        // FOR ENEMIES TO SHOOT AT SAME TIME
        // this.shootTimer = this.shootInterval - this.appearShootDelay;
        this.shootTimer = Phaser.Math.Between(0, this.shootInterval);
        this.enemyType = enemyType;
        this.shootSfx = shootSfx;
        this.deathAnim = (enemyType == 2) ? "dead_enemy2" : "dead_enemy1";

        if (this.enemyType == 2){
            this.setVisible(true);
        } else {
            this.setVisible(this.enemyGroup == this.currentGroup);
        }

        // enemy path
        this.descentTween = scene.tweens.add({
            targets: this, 
            y: scene.cameras.main.height,
            duration: 30000,
            ease: 'Linear'
        });

        // enemy 2 path
        if(enemyType == 2){
            this.snakeTween = scene.tweens.add({
                targets: this, 
                x: {from: x - 150, to: x + 150},
                duration: Phaser.Math.Between(650, 800),
                ease: 'Sine.easeInOut',
                yoyo: true, 
                repeat: -1
            });
        }

        scene.add.existing(this);

        return this;
    }

    update(time, delta) {
        if (this.enemyType != 2){
            this.timer += delta;
            if(this.timer >= this.cycleTime){
                this.timer = 0; 
                this.currentGroup = (this.currentGroup + 1) % 2; 
                this.setVisible(this.enemyGroup == this.currentGroup);
                // FOR ALL ENEMIES TO SHOOT AT SAME TIME
                // if (this.visible){
                //     this.shootTimer = this.shootInterval - this.appearShootDelay;
                // } 
            }
        }

        // shooting
        if (this.visible) {
            this.shootTimer += delta;
            if (this.shootTimer >= this.shootInterval) {
                this.shootTimer -= this.shootInterval;
                let bullet = this.scene.add.sprite(this.x, this.y + this.displayHeight/2, "bullet");
                bullet.setScale(1);               
                bullet.setTint(0xff00ff);              
                bullet.velocityY = 5; 
                this.shootSfx.play();
                this.scene.enemyBullets.push(bullet);
            }
        }
    }

    die() {
        this.visible = false;
        this.x = -100;
        // animation in played in scene
    }
}