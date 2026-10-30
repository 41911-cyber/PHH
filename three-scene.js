/**
 * ====================================================================
 * PORTFÓLIO PREMIUM - PABLO HENRICK ROCHA DA SILVA
 * Arquivo: three-scene.js
 * Descrição: Experiência tridimensional imersiva com Three.js e GSAP
 * ====================================================================
 */

class LuxuryThreeScene {
  constructor() {
    this.container = document.getElementById('webgl-container');
    if (!this.container || typeof THREE === 'undefined') {
      console.warn('Three.js ou container não encontrado.');
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Grupos e Objetos 3D
    this.mainGroup = null;
    this.sculptureCore = null;
    this.wireframeCore = null;
    this.orbitalRing1 = null;
    this.orbitalRing2 = null;
    this.orbitalRing3 = null;
    this.particles = null;
    this.mouseLight = null;

    // Coordenadas e Interação do Mouse
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.windowHalf = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    // Parâmetros de Tema
    this.isDarkMode = true;
    this.materials = [];

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.createSculpture();
    this.createOrbitalRings();
    this.createParticles();
    this.setupEvents();
    this.setupScrollAnimation();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    // Névoa sutil para profundidade cinematográfica
    this.scene.fog = new THREE.FogExp2(0x09090b, 0.035);
  }

  setupCamera() {
    const fov = window.innerWidth < 768 ? 55 : 45;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 7);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Inserir canvas no container
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Luz ambiente suave
    this.ambientLight = new THREE.AmbientLight(0x202026, 1.2);
    this.scene.add(this.ambientLight);

    // Luz principal direcional dourada / champagne
    this.keyLight = new THREE.DirectionalLight(0xf5dfb3, 2.8);
    this.keyLight.position.set(5, 6, 4);
    this.scene.add(this.keyLight);

    // Luz de preenchimento (rim light) tom frio e sofisticado
    this.rimLight = new THREE.DirectionalLight(0x7b92b2, 1.8);
    this.rimLight.position.set(-5, -4, -3);
    this.scene.add(this.rimLight);

    // Luz pontual dinâmica que segue a trajetória do mouse
    this.mouseLight = new THREE.PointLight(0xe5c384, 3, 12);
    this.mouseLight.position.set(0, 0, 3);
    this.scene.add(this.mouseLight);
  }

  createSculpture() {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // Geometria da escultura central: Icosaedro facetado sofisticado
    const geometry = new THREE.IcosahedronGeometry(1.6, 2);

    // Material com acabamento metálico e reflexos de titânio acetinado
    this.sculptureMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2026,
      metalness: 0.92,
      roughness: 0.22,
      wireframe: false,
      flatShading: true
    });
    this.materials.push(this.sculptureMaterial);

    this.sculptureCore = new THREE.Mesh(geometry, this.sculptureMaterial);
    this.mainGroup.add(this.sculptureCore);

    // Núcleo interno wireframe em ouro acetinado
    const wireframeGeo = new THREE.IcosahedronGeometry(1.64, 1);
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc59b48,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.materials.push(this.wireframeMaterial);

    this.wireframeCore = new THREE.Mesh(wireframeGeo, this.wireframeMaterial);
    this.mainGroup.add(this.wireframeCore);
  }

  createOrbitalRings() {
    // Material dos anéis orbitais com brilho ouro nobre
    this.ringMaterial1 = new THREE.MeshStandardMaterial({
      color: 0xd9b36c,
      metalness: 0.95,
      roughness: 0.15,
      side: THREE.DoubleSide
    });
    this.materials.push(this.ringMaterial1);

    this.ringMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x8e8e93,
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    this.materials.push(this.ringMaterial2);

    // Anel orbital 1
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 120);
    this.orbitalRing1 = new THREE.Mesh(ringGeo1, this.ringMaterial1);
    this.orbitalRing1.rotation.x = Math.PI / 3;
    this.orbitalRing1.rotation.y = Math.PI / 6;
    this.mainGroup.add(this.orbitalRing1);

    // Anel orbital 2
    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 16, 120);
    this.orbitalRing2 = new THREE.Mesh(ringGeo2, this.ringMaterial2);
    this.orbitalRing2.rotation.x = -Math.PI / 4;
    this.orbitalRing2.rotation.z = Math.PI / 4;
    this.mainGroup.add(this.orbitalRing2);

    // Anel orbital 3 (Aura externa delicada)
    const ringGeo3 = new THREE.TorusGeometry(2.9, 0.01, 16, 100);
    this.orbitalRing3 = new THREE.Mesh(ringGeo3, this.ringMaterial1);
    this.orbitalRing3.rotation.y = Math.PI / 2.5;
    this.mainGroup.add(this.orbitalRing3);
  }

  createParticles() {
    // Campo de partículas estelares/luxo flutuantes
    const particleCount = window.innerWidth < 768 ? 70 : 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 16;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;
      scales[i] = Math.random() * 0.8 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Shader ou material de partículas com brilho ouro
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0xe5c384,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    this.materials.push(this.particleMaterial);

    this.particles = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  setupEvents() {
    // Captura suave do mouse para controle de inércia
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - this.windowHalf.x) / this.windowHalf.x;
      this.mouse.targetY = (e.clientY - this.windowHalf.y) / this.windowHalf.y;
    });

    // Responsividade
    window.addEventListener('resize', () => {
      this.windowHalf.x = window.innerWidth / 2;
      this.windowHalf.y = window.innerHeight / 2;

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.fov = window.innerWidth < 768 ? 55 : 45;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Pausar renderização quando a aba estiver inativa para economizar GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.clock.stop();
      } else {
        this.clock.start();
      }
    });
  }

  setupScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Linha do tempo GSAP atrelada ao scroll da página
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });

    // Animações cinematográficas de acordo com as seções:
    // 1. Hero para Sobre: Escultura se move elegantemente para a direita
    tl.to(this.mainGroup.position, {
      x: window.innerWidth > 992 ? 2.2 : 0,
      y: -0.4,
      z: -0.8,
      duration: 2,
      ease: 'power2.inOut'
    }, 0)
    .to(this.mainGroup.rotation, {
      x: Math.PI * 0.8,
      y: Math.PI * 0.6,
      duration: 2,
      ease: 'power2.inOut'
    }, 0);

    // 2. Sobre para Habilidades: Move-se para a esquerda e recua ligeiramente
    tl.to(this.mainGroup.position, {
      x: window.innerWidth > 992 ? -2.4 : 0,
      y: 0.2,
      z: -1.5,
      duration: 2,
      ease: 'power2.inOut'
    }, 2)
    .to(this.mainGroup.rotation, {
      x: Math.PI * 1.5,
      y: Math.PI * 1.8,
      z: Math.PI * 0.3,
      duration: 2,
      ease: 'power2.inOut'
    }, 2);

    // 3. Habilidades para Projetos: Abre anéis orbitais e centraliza no fundo
    tl.to(this.mainGroup.position, {
      x: 0,
      y: -0.5,
      z: -3,
      duration: 2.5,
      ease: 'power2.inOut'
    }, 4)
    .to(this.orbitalRing1.scale, {
      x: 1.6,
      y: 1.6,
      z: 1.6,
      duration: 2.5
    }, 4)
    .to(this.orbitalRing2.scale, {
      x: 1.8,
      y: 1.8,
      z: 1.8,
      duration: 2.5
    }, 4);

    // 4. Projetos para Experiências e Formação: Rotação suave contínua
    tl.to(this.mainGroup.position, {
      x: window.innerWidth > 992 ? 2.5 : 0,
      y: 0.4,
      z: -1.8,
      duration: 2.5,
      ease: 'power2.inOut'
    }, 6.5)
    .to(this.mainGroup.rotation, {
      x: Math.PI * 2.2,
      y: Math.PI * 2.6,
      duration: 2.5
    }, 6.5);

    // 5. Galeria para Contato: Centraliza majestoso com aura de ouro
    tl.to(this.mainGroup.position, {
      x: 0,
      y: 0,
      z: -0.5,
      duration: 3,
      ease: 'power2.out'
    }, 9)
    .to(this.mainGroup.rotation, {
      x: Math.PI * 3.0,
      y: Math.PI * 3.4,
      duration: 3
    }, 9)
    .to(this.orbitalRing1.scale, { x: 1, y: 1, z: 1, duration: 3 }, 9)
    .to(this.orbitalRing2.scale, { x: 1, y: 1, z: 1, duration: 3 }, 9);
  }

  setTheme(isDark) {
    this.isDarkMode = isDark;
    if (this.isDarkMode) {
      this.scene.fog.color.setHex(0x09090b);
      this.sculptureMaterial.color.setHex(0x1f2026);
      this.sculptureMaterial.metalness = 0.92;
      this.ambientLight.color.setHex(0x202026);
      this.keyLight.color.setHex(0xf5dfb3);
      this.rimLight.color.setHex(0x7b92b2);
      this.particleMaterial.color.setHex(0xe5c384);
      this.particleMaterial.opacity = 0.7;
    } else {
      // Tema Claro (Alabastro / Titânio e Ouro Envelhecido)
      this.scene.fog.color.setHex(0xf7f6f2);
      this.sculptureMaterial.color.setHex(0xd4cdc3);
      this.sculptureMaterial.metalness = 0.65;
      this.ambientLight.color.setHex(0xdfd9ce);
      this.keyLight.color.setHex(0xb5893a);
      this.rimLight.color.setHex(0x94a3b8);
      this.particleMaterial.color.setHex(0xb5893a);
      this.particleMaterial.opacity = 0.45;
    }
  }

  // Interação magnética ao passar o mouse em botões importantes
  burstReaction() {
    if (!this.mainGroup) return;
    gsap.to(this.mainGroup.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Interpolação suave (lerp) das coordenadas do mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Rotação autônoma contínua suave da escultura
    if (this.sculptureCore && this.wireframeCore) {
      this.sculptureCore.rotation.y += 0.003;
      this.sculptureCore.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      
      this.wireframeCore.rotation.y -= 0.004;
      this.wireframeCore.rotation.z = Math.cos(elapsedTime * 0.4) * 0.1;
    }

    // Movimentação orbital independente dos anéis
    if (this.orbitalRing1) {
      this.orbitalRing1.rotation.z += 0.006;
      this.orbitalRing1.rotation.y += 0.003;
    }
    if (this.orbitalRing2) {
      this.orbitalRing2.rotation.x += 0.005;
      this.orbitalRing2.rotation.z -= 0.004;
    }
    if (this.orbitalRing3) {
      this.orbitalRing3.rotation.y += 0.004;
      this.orbitalRing3.rotation.x -= 0.002;
    }

    // Flutuação sutil de respiração do grupo 3D
    if (this.mainGroup) {
      this.mainGroup.position.y += Math.sin(elapsedTime * 1.2) * 0.0015;
      
      // Inclinação proporcional ao movimento do mouse (Efeito de profundidade e parallax)
      this.mainGroup.rotation.y += (this.mouse.x * 0.45 - this.mainGroup.rotation.y) * 0.05;
      this.mainGroup.rotation.x += (-this.mouse.y * 0.45 - this.mainGroup.rotation.x) * 0.05;
    }

    // Luz pontual acompanha o cursor no espaço 3D
    if (this.mouseLight) {
      this.mouseLight.position.x = this.mouse.x * 4.5;
      this.mouseLight.position.y = -this.mouse.y * 4.5;
    }

    // Leve rotação do campo de partículas
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.02;
      this.particles.rotation.x = elapsedTime * 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instanciação global segura quando o DOM estiver pronto
window.luxuryThreeInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.luxuryThreeInstance = new LuxuryThreeScene();
  } catch (error) {
    console.error('Erro ao inicializar Three.js Scene:', error);
  }
});

