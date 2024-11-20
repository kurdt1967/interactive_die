import * as THREE from 'three';
import { TextureLoader } from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Load textures for the die's faces
const textureLoader = new THREE.TextureLoader();
const dieFaces = [
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf6FXM1O4Ur-9Fi-4oChf0h7gbnqJpV4ARDQ&usqp=CAU.png'), // Face 1
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYx-1v_Yjp8GeC_xCeGvrEZTy35f3kc1xMAuaFdT8rlztHX2NyKBK5PA1x&s=10.png'), // Face 2
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBJtCJwZgX5vM3yFNvVQQYWTCVnSx6jHgQlA&usqp=CAU.png'), // Face 3
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNR0VeXrkisctMvCq042Zk64UINJo4p-i0SV3fH3lIb2bXnlSB-jh2Cr9t&s=10.png'), // Face 4
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWQxxVCisNHKc9Oxp7kEGt5zf7YSXRNpiB47QN2dkjgY1kMtWLhT96KfjA&s=10.png'), // Face 5
    textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUS4HPp7Ang0NXNQ9b0AT7jadGBqbjyiDRhoEZKb7VmBBqz9w9RC8lNWI&s=10.png')  // Face 6
];

// Die geometry and material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = dieFaces.map(
    (texture) => new THREE.MeshBasicMaterial({ map: texture })
);
const die = new THREE.Mesh(geometry, materials);
scene.add(die);


// Random die Roll function
const rollDie = () => {
    // Randomly select a rotation for each face of the die
    const result = Math.floor(Math.random() * 6) + 1;
    console.log("Die Result:", result);

    // Reset rotation and position for clean start
    die.rotation.set(0, 0, 0);
    die.position.set(0, -2, 0); // Start below the ground level for the jump animation

    // Apply random rotations for the animation
    const randomX = Math.random() * Math.PI * 2; // Random rotation for X-axis
    const randomY = Math.random() * Math.PI * 2; // Random rotation for Y-axis
    const randomZ = Math.random() * Math.PI * 2; // Random rotation for Z-axis

    // Animate the die
    const duration = 2; // seconds
    const startTime = performance.now();

    const startY = -2; // Starting height
    const peakY = 2; // Peak height during jump

    // Function to animate the die
    const animate = (time) => {
        const elapsed = (time - startTime) / 1000;

        if(elapsed < duration) {
            const progress = elapsed / duration;

            // Apply rotations
            die.rotation.x = randomX * progress;
            die.rotation.y = randomY * progress;
            die.rotation.z = randomZ * progress;

            // Simulate jump (parabolic motion)
            die.position.y = startY + (peakY - startY) * Math.sin(progress * Math.PI);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        } else {
            // Final rotation and position when the animation ends
            die.rotation.x = randomX;
            die.rotation.y = randomY;
            die.rotation.z = randomZ;
            die.position.y = startY;

            // Adjust the final face based on the result
            let finalRotation;
            switch(result) {
                case 1:
                    finalRotation = new THREE.Euler(0, 0, 0);
                    break;
                case 2:
                    finalRotation = new THREE.Euler(Math.PI, 0, 0);
                    break;
                case 3:
                    finalRotation = new THREE.Euler(Math.PI / 2, 0, 0);
                    break;
                case 4:
                    finalRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
                    break;
                case 5:
                    finalRotation = new THREE.Euler(0, Math.PI / 2, 0);
                    break;
                case 6:
                    finalRotation = new THREE.Euler(0, -Math.PI / 2, 0);
                    break;
                default:
                    finalRotation = new THREE.Euler(0, 0, 0);
                    break;
            }

            die.rotation.copy(finalRotation);

            renderer.render(scene, camera);
        }
    };

    requestAnimationFrame(animate);
};

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Resize Handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});

// Interaction handling (Click or Touch)
canvas.addEventListener('click', rollDie);
canvas.addEventListener('touchstart', rollDie);

// Initial Render
renderer.render(scene, camera);