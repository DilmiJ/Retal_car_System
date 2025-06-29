import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Simple 3D Car Model Component
const CarModel = ({ color = '#ff6b6b', animationPhase = 'parking', ...props }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;

      // Different animations based on phase
      switch (animationPhase) {
        case 'driving-in':
          // Car drives in from the right with smooth deceleration
          const driveProgress = Math.min(1, time * 0.8);
          const easeOut = 1 - Math.pow(1 - driveProgress, 3);
          groupRef.current.position.x = 8 - (easeOut * 8);
          groupRef.current.rotation.y = 0;
          // Add slight bouncing effect when driving
          groupRef.current.position.y = Math.sin(time * 8) * 0.05;
          break;

        case 'parking':
          // Car is parked and gently floating
          groupRef.current.position.x = 0;
          groupRef.current.position.y = Math.sin(time * 2) * 0.1;
          groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
          // Add subtle rocking motion
          groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
          break;

        case 'driving-away':
          // Car drives away to the left with acceleration
          const awayProgress = Math.min(1, time * 0.6);
          const easeIn = Math.pow(awayProgress, 2);
          groupRef.current.position.x = -(easeIn * 10);
          groupRef.current.rotation.y = 0;
          // Add speed effect
          groupRef.current.position.y = Math.sin(time * 10) * 0.03;
          break;

        default:
          groupRef.current.position.y = Math.sin(time * 2) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Car Body */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car Roof */}
      <mesh position={[0, 1.2, 0]} scale={[0.8, 0.6, 0.9]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-1.3, -0.2, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.3, -0.2, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1.3, -0.2, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.3, -0.2, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[1.8, 0.3, 0.6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.8, 0.3, -0.6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.5, 1.2, 0]} scale={[0.6, 0.5, 0.85]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Road/Parking Space Component
const ParkingSpace = () => {
  return (
    <group>
      {/* Road Surface */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Parking Lines */}
      <mesh position={[0, -1.49, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -1.49, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[3, -1.49, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[4, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-3, -1.49, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[4, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particlesRef = useRef();
  const particleCount = 50;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#3b82f6" transparent opacity={0.6} />
    </points>
  );
};

// Main 3D Scene Component
const Car3DScene = ({ className = "", carColor = "#3b82f6" }) => {
  const [animationPhase, setAnimationPhase] = useState('driving-in');
  const containerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));

      // Animation phases based on scroll position
      if (scrollProgress < 0.3) {
        setAnimationPhase('driving-in');
      } else if (scrollProgress < 0.7) {
        setAnimationPhase('parking');
      } else {
        setAnimationPhase('driving-away');
      }
    };

    // Initial animation sequence - car drives in and parks
    setTimeout(() => setAnimationPhase('parking'), 2000);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStatusText = () => {
    switch (animationPhase) {
      case 'driving-in':
        return '🚗 Car arriving...';
      case 'parking':
        return '🅿️ Car parked - Scroll to see it leave!';
      case 'driving-away':
        return '👋 Car leaving...';
      default:
        return '🚗 Ready';
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`w-full h-full relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Parking Space */}
        <ParkingSpace />

        {/* 3D Car Model */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <CarModel color={carColor} animationPhase={animationPhase} />
        </PresentationControls>

        {/* Floating Particles */}
        <FloatingParticles />
        
        {/* Ground Shadow */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4.5}
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* Status Indicator */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm font-medium">{getStatusText()}</p>
      </div>

      {/* Scroll Hint */}
      {animationPhase === 'parking' && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/80 text-white px-4 py-2 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm font-medium">↓ Scroll down to see the car leave ↓</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Car3DScene;
