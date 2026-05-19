import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Preload } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedRings({ mousePosition }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, (mousePosition.current.y * Math.PI) / 10, 0.05);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (mousePosition.current.x * Math.PI) / 10, 0.05);
      ref.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={ref}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (Math.PI / 5) * i]}>
          <torusGeometry args={[3 + i * 0.8, 0.01 + i * 0.005, 16, 100]} />
          <meshStandardMaterial color={new THREE.Color('#b6c4ff').lerp(new THREE.Color('#32343f'), i / 5)} metalness={0.8} roughness={0.2} transparent opacity={0.3 - i * 0.05} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingBlobs({ mousePosition }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mousePosition.current.x * 0.5, 0.02);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -mousePosition.current.y * 0.5, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} position={[-3, 2, -5]}>
          <MeshDistortMaterial color="#0055ff" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0} metalness={0.9} roughness={0.1} distort={0.4} speed={2} transparent opacity={0.15} />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[4, -1, -8]}>
          <MeshDistortMaterial color="#11131c" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0} metalness={0.8} roughness={0.2} distort={0.3} speed={1.5} transparent opacity={0.4} />
        </Sphere>
      </Float>
    </group>
  );
}

function Particles() {
  const count = 500;
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#b6c4ff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function Scene({ mousePosition }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#004dea" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#001551" />
      <AnimatedRings mousePosition={mousePosition} />
      <FloatingBlobs mousePosition={mousePosition} />
      <Particles />
      <Environment preset="city" />
      <Preload all />
    </>
  );
}

export default function Background3D() {
  const mousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    mousePosition.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-container-lowest/80 to-background z-10" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
