"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  
    },
    width: 480,  
    height: 720, 
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [GalleryShooter]
}

const game = new Phaser.Game(config);