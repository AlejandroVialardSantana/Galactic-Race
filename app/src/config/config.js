const config = {
    scene: {
      backgroundColor: 0x4c4c4c,
    },
    camera: {
      fov: 75,
      near: 0.1,
      far: 1050,
      position: { x: 0, y: 70, z: 90 },
    },
    lights: {
      ambient: { color: 0xccddee, intensity: 0.35 },
      point: { color: 0xffffff, intensity: 0.3, position: { x: 2, y: 3, z: 4 } },
    },
    spaceship: {
      travelTime: 40,
    },
  };
  
  export { config };