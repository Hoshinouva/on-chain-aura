import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AuraProfile } from '@/lib/aura-engine';

const vertexShader = `
uniform float uTime;
uniform float uEnergy;
uniform float uArchetypePhase;

varying vec2 vUv;
varying float vNoise;

// Simplex 3D Noise 
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  
  // Base noise for the shape distortion
  float noiseFreq = 1.5 + (uEnergy * 2.0); // Higher energy = smaller, more erratic bumps
  float noiseAmp = 0.2 + (uEnergy * 0.3);
  
  // Time multiplier based on energy
  float t = uTime * (0.2 + uEnergy);
  
  // Calculate noise based on position and time
  vec3 noisePos = vec3(position.x * noiseFreq + t, position.y * noiseFreq + t, position.z * noiseFreq);
  float n = snoise(noisePos) * noiseAmp;
  
  // Archetype modifier (Age)
  // chain_elder (smooth) vs restless_degen (jagged)
  // We use uArchetypePhase: 0.0 = Degen, 0.5 = Nomad, 1.0 = Elder
  float smoothFactor = mix(1.0, 0.2, uArchetypePhase); // Less smooth for Degen
  
  vNoise = n;
  
  // Displace vertex
  vec3 newPosition = position + normal * (n * smoothFactor);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uColorCore;
uniform vec3 uColorEdge;
uniform float uTime;
uniform float uEnergy;

varying vec2 vUv;
varying float vNoise;

void main() {
  // Base color mix based on noise and UVs
  float mixVal = vNoise * 2.0 + vUv.y;
  
  // Pulse effect based on energy and time
  float pulse = sin(uTime * (1.0 + uEnergy * 2.0)) * 0.1 + 0.9;
  
  // Interpolate between core and edge colors
  vec3 color = mix(uColorCore, uColorEdge, mixVal * pulse);
  
  // Add an inner glow near edges
  float edgeGlow = 1.0 - smoothstep(0.0, 0.8, vUv.y);
  color += uColorCore * (edgeGlow * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface AuraOrbProps {
  profile: AuraProfile;
}

export function AuraOrb({ profile }: AuraOrbProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Map profile values to shader uniforms
  const uniforms = useMemo(() => {
    // Convert hex to THREE.Color
    const coreColor = new THREE.Color(profile.colors.core);
    const edgeColor = new THREE.Color(profile.colors.edge);
    
    // Normalize energy from 0-100 to 0.0-1.0
    const normalizedEnergy = profile.energyLevel / 100;
    
    // Map archetype to a smoothness phase
    let archetypePhase = 0.5; // Nomad default
    if (profile.archetypeId === 'restless_degen') archetypePhase = 0.0;
    if (profile.archetypeId === 'chain_elder') archetypePhase = 1.0;

    return {
      uTime: { value: 0 },
      uColorCore: { value: coreColor },
      uColorEdge: { value: edgeColor },
      uEnergy: { value: normalizedEnergy },
      uArchetypePhase: { value: archetypePhase }
    };
  }, [profile]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Calculate bloom intensity based on energy (0.3 to 2.0 scale as defined)
  const energyRatio = profile.energyLevel / 100;
  const bloomIntensity = 0.3 + (energyRatio * 1.7); 

  return (
    <>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={bloomIntensity} 
          mipmapBlur 
        />
      </EffectComposer>
    </>
  );
}
