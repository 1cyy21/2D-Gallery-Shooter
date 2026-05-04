// Name: Kieran Chu

class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("GalleryShooter");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.JerboX = window.innerWidth / 5.5;
        this.JerboY = window.innerHeight - 50;

        this.my.sprite.bullet = [];
        this.maxBullets = 10;
        this.Score = 0; 

    }


    preload(){
        this.load.setPath("./assets/gameassets");
        this.load.image("Jerbo", "tile_0260.png");
        this.load.image("bullet", "tile_0221.png");
        this.load.image("enemy1", "tile_0343.png");
        this.load.image("enemy2", "tile_0363.png");

        this.load.image("enemy1_dead", "tile_0344.png");
        this.load.image("dead_anim_1", "tile_0022.png");
        this.load.image("dead_anim_2", "tile_0021.png");
        this.load.image("dead_anim_3", "tile_0020.png");


        this.load.audio("shoot_sfx", "laserRetro_002.ogg");
    }
        
    create(){
        let my = this.my;

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerSpeed = 5;

        this.shootSfx = this.sound.add("shoot_sfx", {
            volume: 0.05
        });

        this.anims.create({
            key: "dead_enemy1",
            frames: [
                {key: "dead_anim_1"},
                {key: "dead_anim_2"},
                {key: "dead_anim_3"},
                {key: "enemy1_dead"}
            ],
            frameRate: 5,
            hideOnComplete: true
        });

        my.sprite.Jerbo = new Player(this, this.JerboX, this.JerboY, "Jerbo", 0, this.left, this.right, this.shoot, this.playerSpeed);
        my.sprite.Jerbo.scale = 2.5;
        this.bulletSpeed = 10;

        my.sprite.enemy = this.add.sprite(this.game.config.width/2, this.game.config.height - 40, "enemy1");
        my.sprite.enemy.scale = 2.5;
        my.sprite.enemy.score = 50;



    }

    update(time, delta){
        let my = this.my;
        let dt = delta / 16.66; 
        my.sprite.Jerbo.update(time, delta);

        // shooting
        if (Phaser.Input.Keyboard.JustDown(this.shoot)) {
            if(my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(my.sprite.Jerbo.x, my.sprite.Jerbo.y - (my.sprite.Jerbo.displayHeight/2), "bullet"));
                this.shootSfx.play();
            }
        }
        
        // bullet movement
        for(let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }

        // filter/remove bullets offscreen
        my.sprite.bullet = my.sprite.bullet.filter(bullet => bullet.y > -bullet.displayHeight);

        // collision 
        for(let bullet of my.sprite.bullet){
            if (this.collides(my.sprite.enemy, bullet)){ 
                // animation
                this.dead_enemy1 = this.add.sprite(my.sprite.enemy.x, my.sprite.enemy.y, "dead_anim_1").setScale(2.5).play("dead_enemy1");

                bullet.y = -100;
                my.sprite.enemy.visible = false;
                my.sprite.enemy.x = -100

                // update score


                // collision sound


                // enemy reappear aft animation
                this.dead_enemy1.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy.visible = true;
                    this.my.sprite.enemy.x = Math.random()*this.game.config.width;
                }, this);


            }
        }
    

    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}

