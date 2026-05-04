class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, leftKey, rightKey, shootKey, playerSpeed, maxBullets, bulletSpeed, shootSfx) {
        super(scene, x, y, texture, frame);
        
        this.left = leftKey;
        this.right = rightKey;
        this.shootKey = shootKey;
        this.speed = playerSpeed;
        this.bullets = [];
        this.maxBullets = maxBullets;
        this.bulletSpeed = bulletSpeed;
        this.shootSfx = shootSfx;

        scene.add.existing(this);

        return this;
    }

    update(time, delta) {
        let dt = delta / 16.66;
        if (this.left.isDown) {
            if (this.x > (this.displayWidth / 2)) {
                this.x -= this.speed * dt;
            }  
        }

        if (this.right.isDown) {
            if (this.x < this.scene.cameras.main.width - (this.displayWidth / 2)) {
                this.x += this.speed * dt;
            }  
        }

        // prevent player from moving off screen
        let halfWidth = this.displayWidth / 2;
        if (this.x < halfWidth) {
            this.x = halfWidth;
        } else if (this.x > this.scene.cameras.main.width - halfWidth) {
            this.x = this.scene.cameras.main.width - halfWidth;
        }

        // shooting
        if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
            if (this.bullets.length < this.maxBullets) {
                this.bullets.push(this.scene.add.sprite(this.x, this.y - (this.displayHeight/2), "bullet"));
                this.shootSfx.play();
            }
        }

        // bullet movement
        for (let bullet of this.bullets) {
            bullet.y -= this.bulletSpeed * dt;
        }

        // filter/remove bullets offscreen
        this.bullets = this.bullets.filter(bullet => bullet.y > -bullet.displayHeight);
    }
}