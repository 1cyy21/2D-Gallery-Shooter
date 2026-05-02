// Name: Kieran Chu

class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("GalleryShooter");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.JerboX = window.innerWidth / 5.5;
        this.JerboY = window.innerHeight - 50;

        this.my.sprite.bullet = [];
        this.maxBullets = 10;

    }


    preload(){
        this.load.setPath("./assets/Transparent/");
        this.load.image("Jerbo", "tile_0343.png");
        this.load.image("bullet", "tile_0221.png");
    }
        
    create(){
        let my = this.my;

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerSpeed = 5;

        my.sprite.Jerbo = new Player(this, this.JerboX, this.JerboY, "Jerbo", 0, this.left, this.right, this.shoot, this.playerSpeed);
        my.sprite.Jerbo.scale = 2.5;
        this.bulletSpeed = 10;
    }

    update(time, delta){
        let my = this.my;
        let dt = delta / 16.66; 
        my.sprite.Jerbo.update(time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.shoot)) {
            if(my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(my.sprite.Jerbo.x, my.sprite.Jerbo.y - (my.sprite.Jerbo.displayHeight/2), "bullet"));
            }
        }
        
        for(let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }

        my.sprite.bullet = my.sprite.bullet.filter(bullet => bullet.y > -bullet.displayHeight);
    

    }
}