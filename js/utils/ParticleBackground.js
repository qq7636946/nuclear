/* =========================================
   PARTICLE BACKGROUND CLASS (Three.js)
   ========================================= */
class ParticleBackground {
    constructor() {
        this.container = document.getElementById('bg-canvas');
        if (!this.container || typeof THREE === 'undefined') return;

        // Mobile Optimization: Check if we should render
        if (window.innerWidth <= 1120) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050505, 0.05);
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 2.8;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.particlesMesh = null;
        this.coreParticlesMesh = null;
        this.clock = new THREE.Clock();
        this.mouseX = 0;
        this.mouseY = 0;
        this.params = { scatter: 0 };
        this.particlesCount = 2000;

        // Arrays for particle data
        this.initialPosArray = new Float32Array(this.particlesCount * 3);
        this.randomSpreadArray = new Float32Array(this.particlesCount * 3);

        this.initParticles();
        this.initEvents();

        // Start loop
        this.animate();
    }

    createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2, false);
        ctx.closePath();

        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    initParticles() {
        // Outer sphere system
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(this.particlesCount * 3);
        const colorArray = new Float32Array(this.particlesCount * 3);
        const colorBottom = new THREE.Color(0x515151);
        const colorMiddle = new THREE.Color(0x1d1d1d);
        const colorTop = new THREE.Color(0xb3b3b3);

        for (let i = 0; i < this.particlesCount; i++) {
            const radius = 1.3 + (Math.random() - 0.5) * 0.5;
            const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
            const phi = THREE.MathUtils.randFloatSpread(360);

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;

            this.initialPosArray[i * 3] = x;
            this.initialPosArray[i * 3 + 1] = y;
            this.initialPosArray[i * 3 + 2] = z;

            this.randomSpreadArray[i * 3] = (Math.random() - 0.5) * 2.0;
            this.randomSpreadArray[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
            this.randomSpreadArray[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

            // Color gradient logic
            let normalizedY = (y + 1.5) / 3;
            normalizedY = Math.max(0, Math.min(1, normalizedY));
            let mixedColor;
            if (normalizedY < 0.45) {
                const t = normalizedY / 0.45;
                mixedColor = colorBottom.clone().lerp(colorMiddle, t * t);
            } else {
                const t = (normalizedY - 0.45) / 0.55;
                mixedColor = colorMiddle.clone().lerp(colorTop, t);
            }
            colorArray[i * 3] = mixedColor.r;
            colorArray[i * 3 + 1] = mixedColor.g;
            colorArray[i * 3 + 2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            map: this.createCircleTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, material);
        this.scene.add(this.particlesMesh);

        // Core system
        this.coreCount = 2000;
        const coreGeometry = new THREE.BufferGeometry();
        const corePosArray = new Float32Array(this.coreCount * 3);
        const coreColorArray = new Float32Array(this.coreCount * 3);
        this.coreInitialPosArray = new Float32Array(this.coreCount * 3);
        this.coreRandomSpreadArray = new Float32Array(this.coreCount * 3);
        const coreColor = new THREE.Color(0xffffff);

        for (let i = 0; i < this.coreCount; i++) {
            const radius = 0.78 * Math.cbrt(Math.random());
            const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
            const phi = THREE.MathUtils.randFloatSpread(360);

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            corePosArray[i * 3] = x;
            corePosArray[i * 3 + 1] = y;
            corePosArray[i * 3 + 2] = z;

            this.coreInitialPosArray[i * 3] = x;
            this.coreInitialPosArray[i * 3 + 1] = y;
            this.coreInitialPosArray[i * 3 + 2] = z;

            this.coreRandomSpreadArray[i * 3] = (Math.random() - 0.5) * 1.5;
            this.coreRandomSpreadArray[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            this.coreRandomSpreadArray[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

            coreColorArray[i * 3] = coreColor.r;
            coreColorArray[i * 3 + 1] = coreColor.g;
            coreColorArray[i * 3 + 2] = coreColor.b;
        }

        coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePosArray, 3));
        coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColorArray, 3));

        const coreMaterial = new THREE.PointsMaterial({
            size: 0.012,
            map: this.createCircleTexture(),
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.coreParticlesMesh = new THREE.Points(coreGeometry, coreMaterial);
        this.scene.add(this.coreParticlesMesh);
    }

    initEvents() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX / window.innerWidth - 0.5;
            this.mouseY = event.clientY / window.innerHeight - 0.5;
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth === 0 || window.innerHeight === 0) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    render() {
        if (!this.renderer) return;
        if (window.innerWidth <= 1120) return;

        const elapsedTime = this.clock.getElapsedTime();
        const scrollScatter = this.params.scatter;
        const scatterVal = scrollScatter;
        const breatheStrength = 0.02 * (1 - scatterVal * 0.5);
        const breathe = 0.8 + Math.sin(elapsedTime * 0.5) * breatheStrength;
        const easeProgress = Math.pow(scatterVal, 2.5);

        // Update Outer
        if (this.particlesMesh) {
            this.particlesMesh.rotation.y = elapsedTime * 0.08 + (scatterVal * 1.5);
            this.particlesMesh.rotation.y += this.mouseX * 0.05;
            this.particlesMesh.rotation.x = -elapsedTime * 0.02 + (this.mouseY * 0.05);

            const positions = this.particlesMesh.geometry.attributes.position.array;
            const initialPositions = this.initialPosArray;
            const randomSpreads = this.randomSpreadArray;
            const count = this.particlesCount;
            const scatterIntensity = 6.0;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const ix = initialPositions[i3]; const iy = initialPositions[i3 + 1]; const iz = initialPositions[i3 + 2];
                const rx = randomSpreads[i3]; const ry = randomSpreads[i3 + 1]; const rz = randomSpreads[i3 + 2];

                const explosionFactor = easeProgress * scatterIntensity;
                const noiseFactor = easeProgress * 3.0;
                const riseFactor = easeProgress * 2.0;

                positions[i3] = (ix * breathe) + (ix * explosionFactor) + (rx * noiseFactor);
                positions[i3 + 1] = (iy * breathe) + (iy * explosionFactor) + (ry * noiseFactor) + (Math.abs(ry) * riseFactor);
                positions[i3 + 2] = (iz * breathe) + (iz * explosionFactor) + (rz * noiseFactor);
            }
            this.particlesMesh.geometry.attributes.position.needsUpdate = true;
        }

        // Update Core
        if (this.coreParticlesMesh) {
            this.coreParticlesMesh.rotation.y = -elapsedTime * 0.1 + (scatterVal * 0.5);
            this.coreParticlesMesh.rotation.z = elapsedTime * 0.05;

            const corePositions = this.coreParticlesMesh.geometry.attributes.position.array;
            const coreInitial = this.coreInitialPosArray;
            const coreSpread = this.coreRandomSpreadArray;
            const coreCount = this.coreCount;
            const coreScatterIntensity = 8.0;

            for (let i = 0; i < coreCount; i++) {
                const i3 = i * 3;
                const ix = coreInitial[i3]; const iy = coreInitial[i3 + 1]; const iz = coreInitial[i3 + 2];
                const rx = coreSpread[i3]; const ry = coreSpread[i3 + 1]; const rz = coreSpread[i3 + 2];

                const explosionFactor = easeProgress * coreScatterIntensity;
                const noiseFactor = easeProgress * 2.0;
                const riseFactor = easeProgress * 1.5;

                corePositions[i3] = (ix * breathe) + (ix * explosionFactor) + (rx * noiseFactor);
                corePositions[i3 + 1] = (iy * breathe) + (iy * explosionFactor) + (ry * noiseFactor) + (Math.abs(ry) * riseFactor);
                corePositions[i3 + 2] = (iz * breathe) + (iz * explosionFactor) + (rz * noiseFactor);
            }
            this.coreParticlesMesh.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
}

// Attach to window
window.ParticleBackground = ParticleBackground;
