import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RotateCw, Layers, Zap, Loader2 } from 'lucide-react';
import { initialMuscleData, getFatigueColor } from '../../data/muscleData';

// Palette Colors directly matching the User Reference Image:
const PALETTE = {
  sageGreen: 0x659a7c,    // Chest, Lats, Biceps, Rectus Femoris, Tibialis
  ochreTan: 0xbaa779,     // Deltoids, Forearm Extensors, Sartorius, Calves Lateral, Brow/Nose
  terracotta: 0xbe6c75,   // Serratus/Obliques, Vastus Lateralis, Forearm Flexors, Calves Medial
  boneBeige: 0xc4b197,    // Rectus Abdominis 8-pack, Trapezius diamond
  slateBlue: 0x748394,    // Triceps, Vastus Medialis teardrop, Hamstrings lateral, Cranium dome
  mauvePlum: 0xa66085,    // Gluteus Maximus & Medius
  deepFascia: 0x364354,   // Ligaments, deep tendons, small facial & plantar muscles
};

function classifyMuscle(meshName) {
  const n = meshName.toLowerCase();
  // Hide lines and fascia/membrane layers so underlying sculpted muscle bellies are visible (true Écorché)
  if (n.includes('-line') || n.includes('fascia') || n.includes('septum') || n.includes('retinaculum')) {
    return { id: null, color: null, hide: true };
  }

  // 1. CHEST
  if (n.includes('pectoral') || n.includes('pectineus')) {
    return { id: 'chest', color: PALETTE.sageGreen };
  }

  // 2. SHOULDERS
  if (n.includes('deltoid')) {
    if (n.includes('clavicular') || n.includes('anterior')) {
      return { id: 'shoulders', color: PALETTE.sageGreen };
    }
    if (n.includes('spinal') || n.includes('posterior')) {
      return { id: 'shoulders', color: PALETTE.slateBlue };
    }
    return { id: 'shoulders', color: PALETTE.ochreTan };
  }

  // 3. BICEPS & BRACHIALIS
  if (n.includes('biceps_brachii') || n.includes('coracobrachialis')) {
    return { id: 'biceps', color: PALETTE.sageGreen };
  }
  if (n.includes('brachialis')) {
    return { id: 'biceps', color: PALETTE.terracotta };
  }

  // 4. TRICEPS
  if (n.includes('triceps') || n.includes('anconeus')) {
    return { id: 'triceps', color: PALETTE.slateBlue };
  }

  // 5. FOREARMS & HANDS
  if (n.includes('brachioradialis')) {
    return { id: 'forearms', color: PALETTE.sageGreen };
  }
  if (n.includes('pronator') || n.includes('flexor_carpi') || n.includes('flexor_digitorum') || n.includes('palmaris')) {
    return { id: 'forearms', color: PALETTE.terracotta };
  }
  if (n.includes('extensor_carpi') || n.includes('extensor_digitorum') || n.includes('supinator') || n.includes('abductor_pollicis') || n.includes('antebrachial')) {
    return { id: 'forearms', color: PALETTE.ochreTan };
  }

  // 6. ABDOMEN (RECTUS ABDOMINIS & APONEUROSIS - BONE BEIGE)
  if (
    n.includes('rectus_abdominis') ||
    n.includes('pyramidalis') ||
    n.includes('linea_alba') ||
    n.includes('abdominal_oblique_muscle001') ||
    n.includes('abdominal_oblique_muscle002')
  ) {
    return { id: 'abs', color: PALETTE.boneBeige };
  }

  // 7. SERRATUS & OBLIQUES (TERRACOTTA)
  if (n.includes('serratus') || n.includes('oblique') || n.includes('transversus_abdominis') || n.includes('intercostal')) {
    return { id: 'obliques', color: PALETTE.terracotta };
  }

  // 8. LATS & SCAPULARS
  if (n.includes('latissimus_dorsi') || n.includes('infraspinatus') || n.includes('teres_major') || n.includes('teres_minor') || n.includes('subscapularis') || n.includes('supraspinatus')) {
    return { id: 'lats', color: PALETTE.sageGreen };
  }

  // 9. TRAPEZIUS & POSTERIOR NECK / SPINE
  if (n.includes('trapezius')) {
    return { id: 'traps', color: PALETTE.boneBeige };
  }
  if (n.includes('rhomboid') || n.includes('levator_scapulae') || n.includes('splenius') || n.includes('erector_spinae') || n.includes('longissimus') || n.includes('iliocostalis') || n.includes('spinalis') || n.includes('multifidus')) {
    return { id: 'traps', color: PALETTE.ochreTan };
  }

  // 10. GLUTEALS
  if (n.includes('gluteus_maximus')) {
    return { id: 'glutes', color: PALETTE.mauvePlum };
  }
  if (n.includes('gluteus_medius') || n.includes('gluteus_minimus') || n.includes('tensor_fasciae_latae') || n.includes('piriformis') || n.includes('obturator') || n.includes('gemellus')) {
    return { id: 'glutes', color: PALETTE.ochreTan };
  }

  // 11. QUADRICEPS (3-COLOR SEGMENTATION)
  if (n.includes('rectus_femoris')) {
    return { id: 'quads', color: PALETTE.sageGreen };
  }
  if (n.includes('vastus_lateralis')) {
    return { id: 'quads', color: PALETTE.terracotta };
  }
  if (n.includes('vastus_medialis')) {
    return { id: 'quads', color: PALETTE.slateBlue };
  }
  if (n.includes('sartorius')) {
    return { id: 'quads', color: PALETTE.ochreTan };
  }
  if (n.includes('vastus_intermedius') || n.includes('gracilis') || n.includes('adductor')) {
    return { id: 'quads', color: PALETTE.sageGreen };
  }

  // 12. HAMSTRINGS
  if (n.includes('biceps_femoris')) {
    return { id: 'hamstrings', color: PALETTE.slateBlue };
  }
  if (n.includes('semitendinosus') || n.includes('semimembranosus')) {
    return { id: 'hamstrings', color: PALETTE.sageGreen };
  }

  // 13. CALVES & SHIN
  if (n.includes('lateral_head_of_gastrocnemius')) {
    return { id: 'calves', color: PALETTE.ochreTan };
  }
  if (n.includes('medial_head_of_gastrocnemius') || n.includes('gastrocnemius')) {
    return { id: 'calves', color: PALETTE.terracotta };
  }
  if (n.includes('tibialis_anterior') || n.includes('tibialis')) {
    return { id: 'calves', color: PALETTE.sageGreen };
  }
  if (n.includes('soleus') || n.includes('fibularis') || n.includes('peroneus') || n.includes('plantaris') || n.includes('popliteus')) {
    return { id: 'calves', color: PALETTE.slateBlue };
  }

  // 14. HEAD & CRANIAL FACETS
  if (n.includes('occipital') || n.includes('temporoparietalis') || n.includes('epicranius') || n.includes('auricular')) {
    return { id: 'traps', color: PALETTE.slateBlue };
  }
  if (n.includes('frontalis') || n.includes('nasalis') || n.includes('procerus') || n.includes('zygomaticus') || n.includes('corrugator')) {
    return { id: 'traps', color: PALETTE.ochreTan };
  }
  if (n.includes('orbicularis') || n.includes('masseter') || n.includes('buccinator') || n.includes('mentalis') || n.includes('depressor') || n.includes('levator_labii')) {
    return { id: 'traps', color: PALETTE.sageGreen };
  }
  if (n.includes('sternocleidomastoid') || n.includes('sternohyoid') || n.includes('omohyoid') || n.includes('scalene')) {
    return { id: 'traps', color: PALETTE.sageGreen };
  }

  // Default deep connective tissues / intrinsic hands / feet
  return { id: 'other', color: PALETTE.deepFascia };
}

export default function Avatar3D({ onSelectMuscle, selectedMuscleId }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [colorMode, setColorMode] = useState('ecorche'); // 'ecorche' | 'fatigue'
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [activeView, setActiveView] = useState('fte');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const muscleMeshesRef = useRef({});
  const muscleObjectsListRef = useRef([]);
  const targetRotationYRef = useRef(0);
  const targetCameraYRef = useRef(0.0);
  const isDraggingRef = useRef(false);
  const previousTouchRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.022);
    sceneRef.current = scene;

    // --- 2. CAMERA SETUP (Heroic Anatomical Framing) ---
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    // Perfect distance for 1.7m real human height centered at origin
    camera.position.set(0, 0.0, aspect < 1 ? 5.6 : 4.4);
    camera.lookAt(0, 0.0, 0);
    cameraRef.current = camera;

    // --- 3. RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 4. LIGHTING SYSTEM (Artistic Studio Sculptural Lighting) ---
    const ambientLight = new THREE.AmbientLight(0x384457, 2.5);
    scene.add(ambientLight);

    // Key Light (Warm soft directional from front-right)
    const keyLight = new THREE.DirectionalLight(0xfff7ee, 3.2);
    keyLight.position.set(3.5, 4.5, 4.5);
    scene.add(keyLight);

    // Fill Light (Cool slate from front-left)
    const fillLight = new THREE.DirectionalLight(0xa5c4e8, 2.0);
    fillLight.position.set(-3.5, 2.5, 3.5);
    scene.add(fillLight);

    // Rim Lights (Edge definition for anatomical muscle planes)
    const rimBack1 = new THREE.DirectionalLight(0xccff00, 2.0);
    rimBack1.position.set(-3.0, 3.0, -3.5);
    scene.add(rimBack1);

    const rimBack2 = new THREE.DirectionalLight(0x00f0ff, 2.2);
    rimBack2.position.set(3.0, 1.0, -3.5);
    scene.add(rimBack2);

    const rimBackViolet = new THREE.DirectionalLight(0xa855f7, 2.8);
    rimBackViolet.position.set(2.5, 2.0, -3.0);
    scene.add(rimBackViolet);

    const topRim = new THREE.DirectionalLight(0xffffff, 1.3);
    topRim.position.set(0, 5.0, 0);
    scene.add(topRim);

    // Ground Cyber-Pedestal (Stepped tiers matching Image 1 & 2)
    const pedestalGroup = new THREE.Group();

    // 1. Lower Stepped Obsidian Tier
    const baseCylinderGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 64);
    const baseCylinderMat = new THREE.MeshStandardMaterial({
      color: 0x060a1c,
      roughness: 0.25,
      metalness: 0.85
    });
    const baseCylinder = new THREE.Mesh(baseCylinderGeo, baseCylinderMat);
    baseCylinder.position.y = -1.38;
    pedestalGroup.add(baseCylinder);

    // 2. Upper Stepped Obsidian Tier
    const stepCylinderGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.06, 64);
    const stepCylinderMat = new THREE.MeshStandardMaterial({
      color: 0x0c1438,
      roughness: 0.2,
      metalness: 0.9
    });
    const stepCylinder = new THREE.Mesh(stepCylinderGeo, stepCylinderMat);
    stepCylinder.position.y = -1.33;
    pedestalGroup.add(stepCylinder);

    // 3. Glowing Neon Rings (Cyan, Violet, Indigo)
    const ringGeo1 = new THREE.RingGeometry(1.15, 1.20, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -1.29;
    pedestalGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(1.48, 1.54, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -1.29;
    pedestalGroup.add(ring2);

    const ringGeo3 = new THREE.RingGeometry(1.68, 1.72, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x6366f1, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.x = Math.PI / 2;
    ring3.position.y = -1.34;
    pedestalGroup.add(ring3);

    const gridHelper = new THREE.PolarGridHelper(1.85, 16, 6, 48, 0x00f0ff, 0x162448);
    gridHelper.position.y = -1.35;
    pedestalGroup.add(gridHelper);
    scene.add(pedestalGroup);

    // Holographic Upward Beam from Pedestal
    const pedestalUpLight = new THREE.PointLight(0x00f0ff, 3.5, 4.0);
    pedestalUpLight.position.set(0, -1.2, 0);
    scene.add(pedestalUpLight);

    // Floating Stardust Particles (Matching the cosmic atmosphere of Image 1 & 2)
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const rad = 0.9 + Math.random() * 1.6;
      const ang = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(ang) * rad;
      particlePositions[i * 3 + 1] = -1.2 + Math.random() * 2.8;
      particlePositions[i * 3 + 2] = Math.sin(ang) * rad;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.028,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 5. LOAD GENUINE 3D HUMAN ANATOMY GLB MESH ---
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;
    scene.add(avatarGroup);

    const muscleMeshes = {};
    const muscleObjectsList = [];

    const loadModel = async () => {
      try {
        setIsLoading(true);
        if (MeshoptDecoder.ready) {
          await MeshoptDecoder.ready;
        }

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);

        loader.load(
          '/models/muscles.glb',
          (gltf) => {
            const model = gltf.scene;

            // Compute exact real-world dimensions and center
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Scale to comfortable ~2.5 units total height
            const targetHeight = 2.5;
            const scaleFactor = targetHeight / (size.y || 1.71);
            model.scale.setScalar(scaleFactor);

            // Center model at origin inside oriented wrapper
            const wrapper = new THREE.Group();
            model.position.x = -center.x * scaleFactor;
            model.position.y = -center.y * scaleFactor;
            model.position.z = -center.z * scaleFactor;
            wrapper.add(model);
            wrapper.rotation.y = 0; // Face forward to camera in FTE view
            avatarGroup.add(wrapper);

            // Traverse and apply Écorché anatomical materials matching the user reference
            model.traverse((child) => {
              if (child.isMesh) {
                const classification = classifyMuscle(child.name || '');

                if (classification.hide) {
                  child.visible = false;
                  return;
                }

                const muscleId = classification.id;
                const ecorcheHex = classification.color || PALETTE.deepFascia;
                const muscleInfo = initialMuscleData[muscleId];

                const initialColor = colorMode === 'ecorche'
                  ? ecorcheHex
                  : (muscleInfo ? getFatigueColor(muscleInfo.fatigue).hex : ecorcheHex);

                // High-quality sculptural material
                const mat = new THREE.MeshStandardMaterial({
                  color: initialColor,
                  roughness: 0.35,
                  metalness: 0.06,
                  emissive: initialColor,
                  emissiveIntensity: 0.22,
                  side: THREE.DoubleSide,
                });

                child.material = mat;
                child.castShadow = true;
                child.receiveShadow = true;

                if (muscleId && muscleId !== 'other') {
                  child.userData = {
                    muscleId,
                    ecorcheHex,
                    originalName: child.name,
                  };
                  muscleObjectsList.push(child);

                  if (!muscleMeshes[muscleId]) {
                    muscleMeshes[muscleId] = [];
                  }
                  muscleMeshes[muscleId].push(child);
                } else {
                  child.userData = {
                    muscleId: 'other',
                    ecorcheHex,
                  };
                }
              }
            });

            muscleMeshesRef.current = muscleMeshes;
            muscleObjectsListRef.current = muscleObjectsList;
            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.error('Error loading muscles.glb:', err);
            setIsLoading(false);
          }
        );
      } catch (e) {
        console.error('Meshopt / Loader error:', e);
        setIsLoading(false);
      }
    };

    loadModel();

    // --- 6. RAYCASTING & TOUCH / MOUSE CONTROLS ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (clientX, clientY) => {
      isDraggingRef.current = true;
      previousTouchRef.current = { x: clientX, y: clientY };
      touchStartTimeRef.current = Date.now();
    };

    const handlePointerMove = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = clientX - previousTouchRef.current.x;
        const deltaY = clientY - previousTouchRef.current.y;

        targetRotationYRef.current += deltaX * 0.009;
        targetCameraYRef.current = THREE.MathUtils.clamp(
          targetCameraYRef.current - deltaY * 0.003,
          -0.7,
          1.0
        );

        previousTouchRef.current = { x: clientX, y: clientY };
      } else {
        // Desktop Hover detection
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(muscleObjectsListRef.current);
        if (intersects.length > 0) {
          const mId = intersects[0].object.userData.muscleId;
          if (mId && initialMuscleData[mId]) {
            setHoveredMuscle(initialMuscleData[mId]);
            container.style.cursor = 'pointer';
          }
        } else {
          setHoveredMuscle(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const handlePointerUp = (clientX, clientY) => {
      const touchDuration = Date.now() - touchStartTimeRef.current;
      isDraggingRef.current = false;

      // Tap selection (< 250ms)
      if (touchDuration < 250) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(muscleObjectsListRef.current);

        if (intersects.length > 0) {
          const mId = intersects[0].object.userData.muscleId;
          const muscleData = initialMuscleData[mId];
          if (onSelectMuscle && muscleData) {
            onSelectMuscle(muscleData);
          }
        }
      }
    };

    // Listeners
    const onMouseDown = (e) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = (e) => handlePointerUp(e.clientX, e.clientY);

    const onTouchStart = (e) => {
      if (e.touches.length === 1) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = (e) => {
      if (e.changedTouches.length === 1) handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // --- 7. RESIZE HANDLER ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.position.z = camera.aspect < 1 ? 5.6 : 4.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 8. ANIMATION LOOP ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when idle
      if (autoRotate && !isDraggingRef.current) {
        targetRotationYRef.current += 0.004;
      }

      // Smooth damping
      avatarGroup.rotation.y = THREE.MathUtils.lerp(avatarGroup.rotation.y, targetRotationYRef.current, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraYRef.current, 0.08);
      camera.lookAt(0, 0.0, 0);

      // Rotating ground rings & particle drift
      ring1.rotation.z = elapsedTime * 0.18;
      ring2.rotation.z = -elapsedTime * 0.12;
      ring3.rotation.z = elapsedTime * 0.08;
      particleSystem.rotation.y = elapsedTime * 0.04;

      // Emissive highlights & pulsing for selected and hovered muscle groups
      muscleObjectsListRef.current.forEach((mesh) => {
        const isSelected = selectedMuscleId === mesh.userData.muscleId;
        const isHovered = hoveredMuscle && hoveredMuscle.id === mesh.userData.muscleId;

        if (isSelected) {
          const pulse = 0.8 + Math.sin(elapsedTime * 7) * 0.45;
          mesh.material.emissiveIntensity = 1.2 + pulse;
        } else if (isHovered) {
          mesh.material.emissiveIntensity = 0.9;
        } else {
          mesh.material.emissiveIntensity = 0.22;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, colorMode, selectedMuscleId]);

  // Update material colors when colorMode changes ('ecorche' vs 'fatigue')
  useEffect(() => {
    if (!muscleObjectsListRef.current) return;
    muscleObjectsListRef.current.forEach((mesh) => {
      const muscleId = mesh.userData.muscleId;
      const data = initialMuscleData[muscleId];

      const targetHex = colorMode === 'ecorche'
        ? (mesh.userData.ecorcheHex || (data ? data.ecorcheHex : PALETTE.sageGreen))
        : (data ? getFatigueColor(data.fatigue).hex : PALETTE.sageGreen);

      mesh.material.color.setHex(targetHex);
      mesh.material.emissive.setHex(targetHex);
    });
  }, [colorMode]);

  // Camera presets matching the user's reference image
  const setFrontView = () => {
    setActiveView('fte');
    setAutoRotate(false);
    targetRotationYRef.current = 0;
    targetCameraYRef.current = 0.0;
  };

  const setQuarterView = () => {
    setActiveView('3/4');
    setAutoRotate(false);
    targetRotationYRef.current = 0.65; // ~37 degrees perspective
    targetCameraYRef.current = 0.0;
  };

  const setBackView = () => {
    setActiveView('dor');
    setAutoRotate(false);
    targetRotationYRef.current = Math.PI; // 180 degrees back view
    targetCameraYRef.current = 0.0;
  };

  const setSideView = () => {
    setActiveView('per');
    setAutoRotate(false);
    targetRotationYRef.current = Math.PI * 0.5; // 90 degrees profile
    targetCameraYRef.current = 0.0;
  };

  return (
    <div className="avatar-3d-wrapper">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
        className="touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Sci-Fi Holographic HUD Corner Brackets */}
      <div className="hud-bracket hud-bracket-tl" />
      <div className="hud-bracket-tr" />
      <div className="hud-bracket-bl" />
      <div className="hud-bracket-br" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#040714]/85 backdrop-blur-md">
          <Loader2 size={36} className="text-[#00f0ff] animate-spin mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#00f0ff] font-mono">
            Sincronizando Écorché Anatómico 3D...
          </span>
        </div>
      )}

      {/* Floating HUD Controls (Top Right) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`btn-icon ${autoRotate ? 'active' : ''}`}
          title={autoRotate ? 'Pausar Giro 360°' : 'Activar Giro Automático 360°'}
        >
          <RotateCw size={18} className={autoRotate ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={() => setColorMode(colorMode === 'ecorche' ? 'fatigue' : 'ecorche')}
          className={`btn-icon ${colorMode === 'ecorche' ? 'active' : ''}`}
          title={colorMode === 'ecorche' ? 'Cambiar a Mapa de Fatiga' : 'Cambiar a Écorché Artístico'}
        >
          <Layers size={18} />
        </button>

        <div className="h-px bg-white/10 my-1" />

        {/* 4 Views Matching the User Reference Image */}
        <button
          onClick={setFrontView}
          className={`btn-icon text-xs font-bold ${activeView === 'fte' ? 'active' : ''}`}
          title="Vista Frontal (Frente)"
        >
          FTE
        </button>

        <button
          onClick={setQuarterView}
          className={`btn-icon text-xs font-bold ${activeView === '3/4' ? 'active' : ''}`}
          title="Vista Perspectiva (Tres Cuartos)"
        >
          3/4
        </button>

        <button
          onClick={setBackView}
          className={`btn-icon text-xs font-bold ${activeView === 'dor' ? 'active' : ''}`}
          title="Vista Dorsal (Espalda)"
        >
          DOR
        </button>

        <button
          onClick={setSideView}
          className={`btn-icon text-xs font-bold ${activeView === 'per' ? 'active' : ''}`}
          title="Vista Perfil (Lateral)"
        >
          PER
        </button>
      </div>

      {/* Top Left Badge & Mode Indicator — Cyber Telemetry */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1433]/90 backdrop-blur-xl border border-white/15 text-xs shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: colorMode === 'ecorche' ? '#00f0ff' : '#ccff00' }} />
          <span className="font-semibold uppercase tracking-wider text-white font-mono text-[11px]">
            {colorMode === 'ecorche' ? 'AI Écorché // 661 Músculos' : 'AI Biometría // Fatiga Live'}
          </span>
        </div>
        <p className="text-[10px] text-[var(--cyber-cyan)] font-mono mt-1 pl-1 flex items-center gap-1.5 opacity-90">
          <span className="inline-block w-1 h-1 bg-[var(--cyber-cyan)] rounded-full"></span>
          {isMobile ? 'Toca cualquier músculo para inspeccionar' : 'Rotar 360° • Clic para ver volumen y series'}
        </p>
      </div>

      {/* Bottom Floating Legend (Anatomical Color Code or Fatigue Gauge) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex justify-center">
        {colorMode === 'ecorche' ? (
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 text-xs overflow-x-auto max-w-full">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#659a7c' }}></span>
              <span className="text-slate-300">Pecho / Cuádriceps</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c4b197' }}></span>
              <span className="text-slate-300">Abdomen / Trapecio</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#baa779' }}></span>
              <span className="text-slate-300">Hombros / Brazos</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#be6c75' }}></span>
              <span className="text-slate-300">Serratos / Oblicuos</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a66085' }}></span>
              <span className="text-slate-300">Glúteos</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#748394' }}></span>
              <span className="text-slate-300">Tríceps / Isquios</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00]"></span>
              <span className="text-slate-300">Óptimo (0-40%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb703]"></span>
              <span className="text-slate-300">Medio (40-75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f]"></span>
              <span className="text-slate-300">Fatiga Alta (&gt;75%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip (Desktop Only) */}
      {!isMobile && hoveredMuscle && (
        <div className="absolute top-16 left-4 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-2 rounded-xl shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#ccff00]" />
            <span className="text-xs font-bold text-white">{hoveredMuscle.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300">
            <span>Fatiga: <strong style={{ color: getFatigueColor(hoveredMuscle.fatigue).css }}>{hoveredMuscle.fatigue}%</strong></span>
            <span>Series: <strong>{hoveredMuscle.weeklySets}/{hoveredMuscle.targetSets}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
