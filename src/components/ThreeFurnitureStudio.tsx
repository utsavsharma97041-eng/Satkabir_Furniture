import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Sliders,
} from 'lucide-react';

interface ThreeFurnitureStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySpecs?: (specs: any) => void;
}

export const ThreeFurnitureStudio: React.FC<ThreeFurnitureStudioProps> = ({
  isOpen,
  onClose,
  onApplySpecs,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodedVal, setExplodedVal] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeFinish, setActiveFinish] = useState<'Honey Teak' | 'Rich Walnut' | 'Mahogany' | 'Natural Teak'>('Honey Teak');
  const [wireframe, setWireframe] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mutable refs to prevent React state tearing down Three.js canvas
  const stateRef = useRef({
    exploded: 0,
    finish: 'Honey Teak',
    wireframe: false,
  });

  stateRef.current.exploded = explodedVal;
  stateRef.current.finish = activeFinish;
  stateRef.current.wireframe = wireframe;

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5ede1);
    scene.fog = new THREE.FogExp2(0xf5ede1, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.0);

    // 2. Renderer with ACESFilmic & SRGBColorSpace
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Procedural Studio RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0xd4a373, 1.2);
    scene.add(hemiLight);

    // 5. Contact Shadow & Ground Studio Floor
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xecd9c1,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0;
    scene.add(ground);

    // Circular contact shadow decal
    const shadowGeo = new THREE.PlaneGeometry(4.2, 3.8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(40, 20, 10, 0.45)');
    grad.addColorStop(1, 'rgba(40, 20, 10, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01;
    scene.add(contactShadow);

    // 6. COMPOSITE 3D FURNITURE MODEL (Maharaja King Bed: 8 Distinct Procedural Parts)
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);

    // Procedural Wood Grain Texture Generator
    const createWoodTexture = (baseHex: string, grainHex: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = grainHex;
      for (let i = 0; i < 40; i++) {
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        const y = Math.random() * 256;
        ctx.ellipse(128, y, 140, 3 + Math.random() * 6, Math.PI / 16, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const finishColors: Record<string, { base: string; grain: string; rough: number; colorHex: number }> = {
      'Honey Teak': { base: '#c28e46', grain: '#7a4e16', rough: 0.35, colorHex: 0xc28e46 },
      'Rich Walnut': { base: '#5a3825', grain: '#2c170d', rough: 0.4, colorHex: 0x5a3825 },
      'Mahogany': { base: '#44211a', grain: '#1d0a07', rough: 0.25, colorHex: 0x44211a },
      'Natural Teak': { base: '#d49b4f', grain: '#8c551c', rough: 0.3, colorHex: 0xd49b4f },
    };

    const currentFin = finishColors[stateRef.current.finish] || finishColors['Honey Teak'];
    const woodTexture = createWoodTexture(currentFin.base, currentFin.grain);

    // Material Library
    const woodMat = new THREE.MeshStandardMaterial({
      color: currentFin.colorHex,
      map: woodTexture,
      roughness: currentFin.rough,
      metalness: 0.08,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.92,
    });

    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x134e3f, // Emerald
      roughness: 0.85,
      metalness: 0.05,
    });

    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf9,
      roughness: 0.95,
      metalness: 0.0,
    });

    // PART 1: Main Base Plinth / Storage Box
    const baseGeo = new THREE.BoxGeometry(2.4, 0.4, 2.0);
    const baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.position.set(0, 0.2, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    furnitureGroup.add(baseMesh);

    // PART 2: Hydraulic Lifting Sub-frame (Separates in exploded view)
    const hydraulicFrameGeo = new THREE.BoxGeometry(2.35, 0.08, 1.95);
    const hydraulicFrameMesh = new THREE.Mesh(hydraulicFrameGeo, brassMat);
    hydraulicFrameMesh.position.set(0, 0.44, 0);
    hydraulicFrameMesh.castShadow = true;
    furnitureGroup.add(hydraulicFrameMesh);

    // PART 3: Quilted King Mattress
    const mattressGeo = new THREE.BoxGeometry(2.3, 0.3, 1.9);
    const mattressMesh = new THREE.Mesh(mattressGeo, mattressMat);
    mattressMesh.position.set(0, 0.63, 0);
    mattressMesh.castShadow = true;
    furnitureGroup.add(mattressMesh);

    // PART 4: Dual Plush Pillows
    const pillowGeo = new THREE.BoxGeometry(0.75, 0.12, 0.45);
    const pillowL = new THREE.Mesh(pillowGeo, mattressMat);
    pillowL.position.set(-0.55, 0.84, -0.6);
    pillowL.castShadow = true;
    furnitureGroup.add(pillowL);

    const pillowR = new THREE.Mesh(pillowGeo, mattressMat);
    pillowR.position.set(0.55, 0.84, -0.6);
    pillowR.castShadow = true;
    furnitureGroup.add(pillowR);

    // PART 5: Solid Timber Headboard Frame
    const headboardGeo = new THREE.BoxGeometry(2.5, 1.4, 0.15);
    const headboardMesh = new THREE.Mesh(headboardGeo, woodMat);
    headboardMesh.position.set(0, 0.9, -1.05);
    headboardMesh.castShadow = true;
    furnitureGroup.add(headboardMesh);

    // PART 6: Velvet Tufted Headboard Cushion Panel
    const cushionPanelGeo = new THREE.BoxGeometry(2.2, 1.05, 0.06);
    const cushionPanelMesh = new THREE.Mesh(cushionPanelGeo, velvetMat);
    cushionPanelMesh.position.set(0, 0.95, -0.95);
    cushionPanelMesh.castShadow = true;
    furnitureGroup.add(cushionPanelMesh);

    // PART 7: Brass Inlay Trim Top Crown
    const crownGeo = new THREE.BoxGeometry(2.52, 0.06, 0.18);
    const crownMesh = new THREE.Mesh(crownGeo, brassMat);
    crownMesh.position.set(0, 1.63, -1.05);
    crownMesh.castShadow = true;
    furnitureGroup.add(crownMesh);

    // PART 8: Four Solid Corner Tapered Feet
    const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.18, 12);
    const legPositions = [
      [-1.15, 0.09, -0.95],
      [1.15, 0.09, -0.95],
      [-1.15, 0.09, 0.95],
      [1.15, 0.09, 0.95],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, brassMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      furnitureGroup.add(leg);
    });

    // 7. Interactive Orbit Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.2;
    let currentRotationY = 0.4;
    let currentRotationX = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.2, Math.min(0.8, targetRotationX + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3.0, Math.min(8.5, camera.position.z + e.deltaY * 0.004));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.2, Math.min(0.8, targetRotationX + deltaY * 0.008));
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop with Exponential Damping
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // Smooth camera orbit rotation with damping
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 12, dt);
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 12, dt);

      const radius = camera.position.length();
      camera.position.x = radius * Math.sin(currentRotationY) * Math.cos(currentRotationX);
      camera.position.y = Math.max(0.8, radius * Math.sin(currentRotationX) + 1.2);
      camera.position.z = radius * Math.cos(currentRotationY) * Math.cos(currentRotationX);
      camera.lookAt(0, 0.8, 0);

      // Smooth Exploded View Layer Interpolation
      const expl = stateRef.current.exploded;
      mattressMesh.position.y = THREE.MathUtils.damp(mattressMesh.position.y, 0.63 + expl * 0.7, 10, dt);
      pillowL.position.y = THREE.MathUtils.damp(pillowL.position.y, 0.84 + expl * 1.0, 10, dt);
      pillowR.position.y = THREE.MathUtils.damp(pillowR.position.y, 0.84 + expl * 1.0, 10, dt);
      hydraulicFrameMesh.position.y = THREE.MathUtils.damp(hydraulicFrameMesh.position.y, 0.44 + expl * 0.35, 10, dt);
      cushionPanelMesh.position.z = THREE.MathUtils.damp(cushionPanelMesh.position.z, -0.95 + expl * 0.4, 10, dt);
      crownMesh.position.y = THREE.MathUtils.damp(crownMesh.position.y, 1.63 + expl * 0.5, 10, dt);

      // Wireframe toggle update
      woodMat.wireframe = stateRef.current.wireframe;
      velvetMat.wireframe = stateRef.current.wireframe;
      mattressMat.wireframe = stateRef.current.wireframe;

      // Update finish color if changed
      const fInfo = finishColors[stateRef.current.finish];
      if (fInfo) {
        woodMat.color.setHex(fInfo.colorHex);
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      baseGeo.dispose();
      headboardGeo.dispose();
      mattressGeo.dispose();
      cushionPanelGeo.dispose();
      woodMat.dispose();
      brassMat.dispose();
      velvetMat.dispose();
      mattressMat.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8f5] flex flex-col overflow-hidden select-none">
      {/* 100% Unobstructed Three.js 3D Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge (Minimal top-left footprint) */}
      <div className="relative z-10 p-4 sm:p-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#dec099] shadow-sm pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#301a11]">
              Three.js 3D Craftsmanship Studio
            </h2>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Procedural PBR Model • Click & Drag to Orbit • Scroll to Zoom
          </p>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-stone-700 border border-stone-200 shadow-sm transition"
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-stone-700 border border-stone-200 shadow-sm transition"
            title="Close 3D Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Collapsible Ergonomic Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-5 inset-x-0 flex flex-col items-center justify-end z-20 pointer-events-none px-4">
        {/* Dock Collapse / Expand Button */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-2 px-3 py-1 rounded-full bg-white/90 text-stone-700 text-xs font-semibold shadow-md border border-[#dec099] hover:bg-white transition flex items-center gap-1 pointer-events-auto cursor-pointer"
        >
          {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isDockCollapsed ? 'Show 3D Controls' : 'Hide Controls'}</span>
        </button>

        {/* Floating Dock Surface */}
        {!isDockCollapsed && (
          <div className="w-full max-w-3xl bg-white/95 border border-[#dec099] rounded-2xl p-4 shadow-xl pointer-events-auto transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Exploded View Slider (5 cols) */}
              <div className="sm:col-span-5 bg-[#faf7f2] p-3 rounded-xl border border-stone-200">
                <div className="flex justify-between items-center text-xs font-bold text-[#683d28] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#b98144]" />
                    Exploded Assembly View:
                  </span>
                  <span className="font-mono text-[#7e4b2c]">{Math.round(explodedVal * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedVal}
                  onChange={(e) => setExplodedVal(parseFloat(e.target.value))}
                  className="w-full accent-[#7e4b2c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                  <span>Assembled Bed</span>
                  <span>Full Joinery Anatomy</span>
                </div>
              </div>

              {/* Finish Swatches (4 cols) */}
              <div className="sm:col-span-4 bg-[#faf7f2] p-3 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-[#683d28] block mb-1.5">
                  Timber Polish Finishes:
                </span>
                <div className="flex gap-2">
                  {[
                    { id: 'Honey Teak', color: '#c28e46' },
                    { id: 'Rich Walnut', color: '#5a3825' },
                    { id: 'Mahogany', color: '#44211a' },
                    { id: 'Natural Teak', color: '#d49b4f' },
                  ].map((fin) => (
                    <button
                      key={fin.id}
                      onClick={() => setActiveFinish(fin.id as any)}
                      className={`flex-1 py-1.5 px-1 rounded-lg border text-[10px] font-semibold transition ${
                        activeFinish === fin.id
                          ? 'border-[#7e4b2c] bg-white ring-2 ring-[#7e4b2c]/30 text-[#7e4b2c]'
                          : 'border-stone-200 bg-white/70 text-stone-600'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full mx-auto mb-0.5 border border-black/20"
                        style={{ backgroundColor: fin.color }}
                      />
                      <span className="truncate block text-center">{fin.id.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles (3 cols) */}
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                    wireframe
                      ? 'bg-[#7e4b2c] text-white border-[#7e4b2c]'
                      : 'bg-[#faf7f2] hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{wireframe ? 'Solid PBR Mode' : 'CAD Wireframe'}</span>
                </button>
                <button
                  onClick={() => {
                    setExplodedVal(0);
                    setActiveFinish('Honey Teak');
                    setWireframe(false);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium flex items-center justify-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Camera & View</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
