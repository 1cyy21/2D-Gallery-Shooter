// Name: Kieran Chu

class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("GalleryShooter");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.JerboX = window.innerWidth / 2;
        this.JerboY = window.innerHeight - 50;

    }


    preload(){
        this.load.setPath("./assets/Transparent/");
        this.load.image("Jerbo", "tile_0343.png");
        this.load.image("bullet", "tile_0221.png");
    }
        
    create(){
        let my = this.my;
        my.sprite.Jerbo = this.add.sprite(this.JerboX, this.JerboY, "Jerbo");
        my.sprite.Jerbo.scale = 2;
        my.sprite.Jerbo.setOrigin(0.5, 1);
        
        my.sprite.bullet = this.add.sprite(this.JerboX, this.JerboY - my.sprite.Jerbo.displayHeight, "bullet");
        my.sprite.bullet.setVisible(false);


        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta){
        let my = this.my;

        if (this.keyA.isDown) {
            my.sprite.Jerbo.x -= 5 * (delta / 16.66);  
        }  
        if (this.keyD.isDown) {
            my.sprite.Jerbo.x += 5 * (delta / 16.66); 
        }

        // prevent monster from moving off screen
        let halfWidth = my.sprite.Jerbo.displayWidth / 2;
        if (my.sprite.Jerbo.x < halfWidth) {
            my.sprite.Jerbo.x = halfWidth;
        } else if (my.sprite.Jerbo.x > this.game.config.width - halfWidth) {
            my.sprite.Jerbo.x = this.game.config.width - halfWidth;
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !my.sprite.bullet.visible) {
            my.sprite.bullet.x = my.sprite.Jerbo.x;
            my.sprite.bullet.y = my.sprite.Jerbo.y - my.sprite.Jerbo.displayHeight;
            my.sprite.bullet.setVisible(true);
        }

        if (my.sprite.bullet.visible) {
            my.sprite.bullet.y -= 10 * (delta / 16.66);
            if (my.sprite.bullet.y < 0) {
                my.sprite.bullet.setVisible(false);
            }
        }

    

    }
}