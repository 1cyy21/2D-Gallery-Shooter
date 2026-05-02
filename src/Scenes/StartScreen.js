// Name: Kieran Chu

class StartScreen extends Phaser.Scene {
    constructor() {
        super("StartScreen");
    }

    preload() {
        // No assets to preload for this simple screen
    }

    create() {
        let centerX = this.cameras.main.width / 2;
        let centerY = this.cameras.main.height / 2;

        // Title
        this.add.text(centerX, centerY - 150, "Jerbo's Training", {
            fontSize: '24px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Controls
        this.add.text(centerX, centerY - 50, 'Controls:', {
            fontSize: '20px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY, 'A/D: Move Left/Right', {
            fontSize: '16px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 30, 'Space: Shoot', {
            fontSize: '16px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Start button
        let startButton = this.add.text(centerX, centerY + 100, 'Start Game', {
            fontSize: '20px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GalleryShooter');
        });

        // Optional: Change color on hover
        startButton.on('pointerover', () => {
            startButton.setColor('#ffff00');
        });
        startButton.on('pointerout', () => {
            startButton.setColor('#ffffff');
        });
    }

    update() {
        // No updates needed
    }
}