// Name: Kieran Chu

class MonsterMovement extends Phaser.Scene {
    constructor() {
        super("monsterMovementScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.monsterX = window.innerWidth / 2;
        this.monsterY = window.innerHeight - 100;

    }


    preload(){
        this.load.setPath("./assets/Transparent/");
        this.load.image("monster", "tile_0343.png");
        this.load.image("bullet", "tile_0221.png");
        document.getElementById('description').innerHTML = '<h2>MonsterMovement.js<br>A - move left // D - move right</h2>'
    }
        
    create(){
        let my = this.my;
        my.sprite.monster = this.add.sprite(this.monsterX, this.monsterY, "monster");
        my.sprite.monster.scale = 2;
        my.sprite.monster.setOrigin(0.5, 1);
        
        my.sprite.bullet = this.add.sprite(this.monsterX, this.monsterY - my.sprite.monster.displayHeight, "bullet");
        my.sprite.bullet.setVisible(false);


        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta){
        let my = this.my;

        if (this.keyA.isDown) {
            my.sprite.monster.x -= 5 * (delta / 16.66);  
        }  
        if (this.keyD.isDown) {
            my.sprite.monster.x += 5 * (delta / 16.66); 
        }

        // prevent monster from moving off screen
        let halfWidth = my.sprite.monster.displayWidth / 2;
        if (my.sprite.monster.x < halfWidth) {
            my.sprite.monster.x = halfWidth;
        } else if (my.sprite.monster.x > this.game.config.width - halfWidth) {
            my.sprite.monster.x = this.game.config.width - halfWidth;
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !my.sprite.bullet.visible) {
            my.sprite.bullet.x = my.sprite.monster.x;
            my.sprite.bullet.y = my.sprite.monster.y - my.sprite.monster.displayHeight;
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