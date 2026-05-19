import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedFabric() {
  const fabricRef = useRef();
  
  useFrame((state) => {
    if (fabricRef.current) {
      fabricRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 - 10;
    }
  });

  return (
    <mesh ref={fabricRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -10, -5]} scale={[60, 60, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <MeshDistortMaterial 
        color="#01030a" 
        emissive="#020410"
        envMapIntensity={1} 
        clearcoat={1} 
        clearcoatRoughness={0.1} 
        metalness={0.9} 
        roughness={0.1} 
        distort={0.3} 
        speed={1.5} 
      />
    </mesh>
  );
}

function CursorLight() {
  const lightRef = useRef();
  const { viewport, mouse } = useThree();
  
  useFrame(() => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    if (lightRef.current) {
      lightRef.current.position.lerp(new THREE.Vector3(x, y, 5), 0.05);
    }
  });

  return <pointLight ref={lightRef} intensity={8} color="#4d7cff" distance={30} decay={2} />;
}

export default function AnimeHero3D({ scrollYProgress }) {
  const group = useRef();
  const ringsRef = useRef();
  const orbsRef = useRef();
  
  const { camera } = useThree();

  // Create stable random positions for orbs to avoid re-renders
  const orbPositions = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5],
      scale: Math.random() * 1.5 + 0.5,
      intensity: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "#1442ff" : "#ffffff"
    }));
  }, []);

  useFrame((state, delta) => {
    const scroll = scrollYProgress ? scrollYProgress.get() : 0;
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    // Cinematic Camera Movement on Scroll
    const targetZ = THREE.MathUtils.lerp(10, scroll > 0.3 ? 2 : 10, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    if (group.current) {
      // Magnetic Mouse Parallax & Scroll Rotation
      const rotateTargetY = mouseX * 0.4 + scroll * Math.PI * 1.5;
      const rotateTargetX = -mouseY * 0.3 - scroll * Math.PI * 0.2;
      
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotateTargetY, 0.02);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotateTargetX, 0.02);
      
      // Depth shifting based on mouse (magnetic push/pull)
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, -mouseX * 3, 0.02);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -mouseY * 3, 0.02);
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const speed = 0.5 + scroll * 3;
        ring.rotation.z += delta * speed * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x += delta * speed * 0.4;
        ring.rotation.y += delta * speed * 0.2;
        ring.scale.setScalar(1 + scroll * 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05);
      });
    }
  });

  return (
    <>
      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#010104', 5, 40]} />
      <Environment preset="city" />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, -5]} intensity={1} color="#4d7cff" />
      <CursorLight />

      <group ref={group}>
        {/* Dynamic World Elements */}
        <AnimatedFabric />

        {/* Floating Glowing Orbs */}
        <group ref={orbsRef}>
          {orbPositions.map((orb, i) => (
            <Float key={i} speed={2} rotationIntensity={1.5} floatIntensity={3} position={orb.pos}>
              <mesh scale={orb.scale}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial 
                  color="#000000" 
                  emissive={orb.color} 
                  emissiveIntensity={orb.intensity} 
                  roughness={0.2} 
                  metalness={0.8} 
                />
              </mesh>
            </Float>
          ))}
        </group>

        {/* Animated Energy Rings */}
        <group ref={ringsRef} position={[0, 0, -2]}>
          {[1, 2, 3, 4, 5].map((i) => (
            <mesh key={i}>
              <torusGeometry args={[2 + i * 1.5, 0.01 + (i * 0.005), 32, 100]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive={i % 2 === 0 ? "#ffffff" : "#3a60ff"}
                emissiveIntensity={1.5}
                transparent 
                opacity={0.3 + (i * 0.1)} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          ))}
        </group>

        {/* Multi-layered Depth Particles */}
        <Sparkles count={500} scale={40} size={3} speed={1} opacity={0.2} color="#3a60ff" position={[0, 0, -10]} />
        <Sparkles count={300} scale={30} size={5} speed={2} opacity={0.4} color="#7aa2ff" position={[0, 0, -2]} />
        <Sparkles count={150} scale={20} size={8} speed={4} opacity={0.8} color="#ffffff" position={[0, 0, 5]} />
      </group>
    </>
  );
}
