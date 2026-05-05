class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, score, enemyGroup, startingGroup, cycleTime, enemyType) {
        super(scene, x, y, texture, frame);
        
        this.score = score;

        this.currentGroup = startingGroup;
        this.enemyGroup = enemyGroup;
        this.cycleTime = cycleTime;
        this.timer = 0;
        this.shootInterval = this.cycleTime; 
        this.appearShootDelay = 1500;
        this.shootTimer = this.shootInterval - this.appearShootDelay;
        this.enemyType = enemyType;

        this.setVisible(this.enemyGroup == this.currentGroup);

        this.descentTween = scene.tweens.add({
            targets: this, 
            y: scene.cameras.main.height,
            duration: 30000,
            ease: 'Linear'
        });

        scene.add.existing(this);

        return this;
    }

    update(time, delta) {
        this.timer += delta;
        if(this.timer >= this.cycleTime){
            this.timer = 0; 
            this.currentGroup = (this.currentGroup + 1) % 2; 
            this.setVisible(this.enemyGroup == this.currentGroup);
            if (this.visible){
                this.shootTimer = this.shootInterval - this.appearShootDelay;
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