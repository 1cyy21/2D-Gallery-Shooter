// Name: Kieran Chu

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create(data) {
        let score = data.score || 0;
        let wave = data.wave || 1; 
        let highscore = parseInt(localStorage.getItem("galleryShooterHighscore")) || 0;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("galleryShooterHighscore", highscore);
        }
        
        let bestWave = parseInt(localStorage.getItem("galleryShooterBestWave")) || 0; 
        if (wave > bestWave){
            bestWave = wave;
            localStorage.setItem("galleryShooterBestWave", bestWave);
        }


        let centerX = this.cameras.main.width / 2;
        let centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 120, "Game Over", {
            fontSize: '28px',
            fontFamily: '"Press Start 2P"',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 60, `Score: ${score}`, {
            fontSize: '20px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 20, `Highscore: ${highscore}`, {
            fontSize: '20px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 10, `Best Wave: ${bestWave}`, {
            fontSize: '16px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff'
        }).setOrigin(0.5);

        let restartButton = this.add.text(centerX, centerY + 60, 'Restart', {
            fontSize: '20px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 8 }
        }).setOrigin(0.5).setInteractive();

        let homeButton = this.add.text(centerX, centerY + 90, 'Return to Title', {
            fontSize: '20px',
            fontFamily: '"Press Start 2P"',
            color: '#ffffff',
            padding: {x: 10, y: 8}
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GalleryShooter');
        });

        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ffff00' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#ffffff' });
        });

        homeButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });

        homeButton.on('pointerover', () => {
            homeButton.setStyle({ fill: '#ffff00'});
        })

        homeButton.on('pointerout', () => {
            homeButton.setStyle({ fill: '#ffffff'});
        })
    }
}
