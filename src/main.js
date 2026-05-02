// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// BuildAMonster
//
// A template for building a monster using a series of assets from
// a sprite atlas.
// 
// Art assets from Kenny Assets "Monster Builder Pack" set:
// https://kenney.nl/assets/monster-builder-pack

"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: webkitURL ? window.innerWidth : 800,  // use full window width on mobile, fixed width on desktop
    height: webkitURL ? window.innerHeight : 600, // use full window height on mobile, fixed height on desktop
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MonsterMovement]
}

const game = new Phaser.Game(config);