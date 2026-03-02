'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CARD_IMAGES } from '@/features/transforming-cards/constants';
import {
  Camera,
  CardData,
  Particle,
  Particles,
  Renderer,
  Scene,
} from '@/features/transforming-cards/types';
import {
  createAsciiUpdateInterval,
  generateCode,
} from '@/features/transforming-cards/utils';
import Controls from './Controls';
import SpeedIndicator from './SpeedIndicator';
import Footer from './Footer';

export default function TransformingCards() {
  //   STATE
  const [isAnimating, setIsAnimating] = useState(true);
  const [velocity, setVelocity] = useState(120);
  const [cards, setCards] = useState<CardData[]>([]);

  //   REFS
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const speedValueRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef(0);
  const velocityRef = useRef(120);
  const directionRef = useRef(-1);
  const isAnimatingRef = useRef(true);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const mouseVelocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const scanningActiveRef = useRef(false);
  const updateCardClippingRef = useRef<(() => void) | null>(null);

  // EFFECTS
  useEffect(() => {
    const cardsCount = 30;
    const newCards: CardData[] = [];

    for (let i = 0; i < cardsCount; i++) {
      newCards.push({
        id: i,
        imageUrl: CARD_IMAGES[i % CARD_IMAGES.length],
        asciiCode: generateCode(66, 19),
      });
    }

    setCards(newCards);
  }, []);

  useEffect(() => {
    if (!cardLineRef.current || !containerRef.current) return;

    const friction = 0.98;
    const minVelocity = 60;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (isAnimatingRef.current && !isDraggingRef.current) {
        if (velocityRef.current > minVelocity) {
          velocityRef.current *= friction;
        } else {
          velocityRef.current = Math.max(minVelocity, velocityRef.current);
        }

        positionRef.current +=
          velocityRef.current * directionRef.current * deltaTime;
        updateCardPosition();
        updateSpeedIndicator();
      } else if (isDraggingRef.current) {
        // During drag, only update clipping (position is updated in onDrag)
        updateCardClipping();
      }

      requestAnimationFrame(animate);
    };

    const updateCardPosition = () => {
      if (!cardLineRef.current || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const cardLineWidth = cardLineRef.current.scrollWidth;

      if (positionRef.current < -cardLineWidth) {
        positionRef.current = containerWidth;
      } else if (positionRef.current > containerWidth) {
        positionRef.current = -cardLineWidth;
      }

      cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;
      updateCardClipping();
    };

    const updateSpeedIndicator = () => {
      if (speedValueRef.current) {
        speedValueRef.current.textContent = Math.round(
          velocityRef.current
        ).toString();
      }
    };

    const updateCardClipping = () => {
      const scannerX = window.innerWidth / 2;
      const scannerWidth = 8;
      const scannerLeft = scannerX - scannerWidth / 2;
      const scannerRight = scannerX + scannerWidth / 2;

      let anyScanningActive = false;

      document.querySelectorAll('.card-wrapper').forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const cardLeft = rect.left;
        const cardRight = rect.right;
        const cardWidth = rect.width;

        const normalCard = wrapper.querySelector('.card-normal') as HTMLElement;
        const asciiCard = wrapper.querySelector('.card-ascii') as HTMLElement;

        if (cardLeft < scannerRight && cardRight > scannerLeft) {
          anyScanningActive = true;

          const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
          const scannerIntersectRight = Math.min(
            scannerRight - cardLeft,
            cardWidth
          );

          const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
          const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

          normalCard.style.setProperty('--clip-right', `${normalClipRight}%`);
          asciiCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);

          if (
            !wrapper.hasAttribute('data-scanned') &&
            scannerIntersectLeft > 0
          ) {
            wrapper.setAttribute('data-scanned', 'true');

            const scanEffect = document.createElement('div');
            scanEffect.className = 'scan-effect';
            wrapper.appendChild(scanEffect);

            setTimeout(() => {
              if (scanEffect.parentNode) {
                scanEffect.parentNode.removeChild(scanEffect);
              }
            }, 600);
          }
        } else {
          if (cardRight < scannerLeft) {
            normalCard.style.setProperty('--clip-right', '100%');
            asciiCard.style.setProperty('--clip-left', '100%');
          } else if (cardLeft > scannerRight) {
            normalCard.style.setProperty('--clip-right', '0%');
            asciiCard.style.setProperty('--clip-left', '0%');
          }
          wrapper.removeAttribute('data-scanned');
        }
      });

      scanningActiveRef.current = anyScanningActive;
    };

    // Store in ref so it can be accessed from onDrag handler
    updateCardClippingRef.current = updateCardClipping;

    // Initial position - second card centered
    positionRef.current = containerRef.current.offsetWidth / 2 - 660;

    lastTimeRef.current = performance.now();
    requestAnimationFrame(animate);

    // Create ASCII update interval
    const asciiIntervalId = createAsciiUpdateInterval();

    return () => {
      clearInterval(asciiIntervalId);
    };
  }, []);

  // HANDLERS
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    isAnimatingRef.current = false;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    lastMouseXRef.current = clientX;
    mouseVelocityRef.current = 0;

    if (cardLineRef.current) {
      const transform = window.getComputedStyle(cardLineRef.current).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        positionRef.current = matrix.m41;
      }
      cardLineRef.current.style.animation = 'none';
      cardLineRef.current.classList.add('dragging');
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current || !cardLineRef.current) return;

    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastMouseXRef.current;

    positionRef.current += deltaX;
    mouseVelocityRef.current = deltaX * 60;
    lastMouseXRef.current = clientX;

    cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;

    // Update card clipping immediately during drag
    if (updateCardClippingRef.current) {
      updateCardClippingRef.current();
    }
  };

  const endDrag = () => {
    if (!isDraggingRef.current || !cardLineRef.current) return;

    isDraggingRef.current = false;
    cardLineRef.current.classList.remove('dragging');

    const minVelocity = 30;
    if (Math.abs(mouseVelocityRef.current) > minVelocity) {
      velocityRef.current = Math.abs(mouseVelocityRef.current);
      directionRef.current = mouseVelocityRef.current > 0 ? 1 : -1;
      setVelocity(velocityRef.current);
    } else {
      velocityRef.current = 120;
      setVelocity(120);
    }

    isAnimatingRef.current = true;
    setIsAnimating(true);

    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDrag(e);
    const handleTouchMove = (e: TouchEvent) => onDrag(e);
    const handleMouseUp = () => endDrag();
    const handleTouchEnd = () => endDrag();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const toggleAnimation = () => {
    isAnimatingRef.current = !isAnimatingRef.current;
    setIsAnimating(isAnimatingRef.current);
  };

  const resetPosition = () => {
    if (containerRef.current) {
      positionRef.current = containerRef.current.offsetWidth - 560;
      velocityRef.current = 120;
      directionRef.current = -1;
      isAnimatingRef.current = true;

      setVelocity(120);
      setIsAnimating(true);

      if (cardLineRef.current) {
        cardLineRef.current.style.animation = 'none';
        cardLineRef.current.style.transform = `translateX(${positionRef.current}px)`;
        cardLineRef.current.classList.remove('dragging');
      }
    }
  };

  const changeDirection = () => {
    directionRef.current *= -1;
  };

  useEffect(() => {
    if (!particleCanvasRef.current) return;

    let scene: Scene | undefined;
    let camera: Camera | undefined;
    let renderer: Renderer | undefined;
    let particles: Particles | undefined;
    let animationId: number;

    const initThreeJS = async () => {
      try {
        const THREE = await import('three');

        scene = new THREE.Scene() as unknown as Scene;
        const cam = new THREE.OrthographicCamera(
          -window.innerWidth / 2,
          window.innerWidth / 2,
          125,
          -125,
          1,
          1000
        );
        cam.position.z = 100;
        camera = cam as unknown as Camera;

        const rend = new THREE.WebGLRenderer({
          canvas: particleCanvasRef.current!,
          alpha: true,
          antialias: true,
        });
        rend.setSize(window.innerWidth, 250);
        rend.setClearColor(0x000000, 0);
        renderer = rend as unknown as Renderer;

        // Create particles
        const particleCount = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
          positions[i * 3 + 2] = 0;

          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;

          const orbitRadius = Math.random() * 200 + 100;
          sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;
          velocities[i] = Math.random() * 60 + 30;
        }

        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const alphas = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
          alphas[i] = (Math.random() * 8 + 2) / 10;
        }
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

        // Create gradient texture
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d')!;
        const half = canvas.width / 2;
        const gradient = ctx.createRadialGradient(
          half,
          half,
          0,
          half,
          half,
          half
        );
        gradient.addColorStop(0.025, '#fff');
        gradient.addColorStop(0.1, 'hsl(217, 61%, 33%)');
        gradient.addColorStop(0.25, 'hsl(217, 64%, 6%)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(half, half, half, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: texture },
            size: { value: 15.0 },
          },
          vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            varying vec3 vColor;
            uniform float size;
            
            void main() {
              vAlpha = alpha;
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vAlpha;
            varying vec3 vColor;
            
            void main() {
              gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        });

        const pts = new THREE.Points(geometry, material);
        particles = pts as unknown as Particles;
        scene.add(pts as unknown as never);

        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const alphas = particles.geometry.attributes.alpha.array;
            const time = Date.now() * 0.001;

            for (let i = 0; i < particleCount; i++) {
              positions[i * 3] += velocities[i] * 0.016;

              if (positions[i * 3] > window.innerWidth / 2 + 100) {
                positions[i * 3] = -window.innerWidth / 2 - 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
              }

              positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

              const twinkle = Math.floor(Math.random() * 10);
              if (twinkle === 1 && alphas[i] > 0) {
                alphas[i] -= 0.05;
              } else if (twinkle === 2 && alphas[i] < 1) {
                alphas[i] += 0.05;
              }
              alphas[i] = Math.max(0, Math.min(1, alphas[i]));
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.alpha.needsUpdate = true;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        animate();
      } catch {
        console.warn(
          'Three.js not available. Please install: npm install three @types/three'
        );
      }
    };

    initThreeJS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (particles && scene) {
        scene.remove(particles as unknown as never);
        particles.geometry.dispose();
        particles.material.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!scannerCanvasRef.current) return;

    const canvas = scannerCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    const w = window.innerWidth;
    const h = 300;
    canvas.width = w;
    canvas.height = h;

    const particles: Particle[] = [];
    let count = 0;

    // Dynamic particle system properties
    const baseIntensity = 0.8;
    const baseMaxParticles = 800;
    const baseFadeZone = 60;
    const scanTargetIntensity = 1.8;
    const scanTargetParticles = 2500;
    const scanTargetFadeZone = 35;
    const transitionSpeed = 0.05;

    let currentIntensity = baseIntensity;
    let currentMaxParticles = baseMaxParticles;
    let currentFadeZone = baseFadeZone;
    let intensity = baseIntensity;
    let maxParticles = baseMaxParticles;
    let fadeZone = baseFadeZone;

    const lightBarX = w / 2;
    const lightBarWidth = 3;
    let currentGlowIntensity = 1;

    // Create gradient cache
    const gradientCanvas = document.createElement('canvas');
    const gradientCtx = gradientCanvas.getContext('2d')!;
    gradientCanvas.width = 16;
    gradientCanvas.height = 16;
    const half = gradientCanvas.width / 2;
    const gradient = gradientCtx.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(196, 181, 253, 0.8)');
    gradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
    gradient.addColorStop(1, 'transparent');
    gradientCtx.fillStyle = gradient;
    gradientCtx.beginPath();
    gradientCtx.arc(half, half, half, 0, Math.PI * 2);
    gradientCtx.fill();

    const createParticle = () => {
      const intensityRatio = intensity / baseIntensity;
      const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
      const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

      return {
        x: lightBarX + (Math.random() - 0.5) * lightBarWidth,
        y: Math.random() * h,
        vx: (Math.random() * 0.8 + 0.2) * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        radius: (Math.random() * 0.6 + 0.4) * sizeMultiplier,
        alpha: Math.random() * 0.4 + 0.6,
        decay: (Math.random() * 0.02 + 0.005) * (2 - intensityRatio * 0.5),
        life: 1.0,
        time: 0,
        twinkleSpeed: (Math.random() * 0.06 + 0.02) * speedMultiplier,
        twinkleAmount: Math.random() * 0.15 + 0.1,
        originalAlpha: 0,
      };
    };

    for (let i = 0; i < baseMaxParticles; i++) {
      const particle = createParticle();
      particle.originalAlpha = particle.alpha;
      particles[count++] = particle;
    }

    const drawLightBar = () => {
      const targetGlowIntensity = scanningActiveRef.current ? 3.5 : 1;
      currentGlowIntensity +=
        (targetGlowIntensity - currentGlowIntensity) * transitionSpeed;

      const glowIntensity = currentGlowIntensity;
      const glow1Alpha = scanningActiveRef.current ? 1.0 : 0.8;
      const glow2Alpha = scanningActiveRef.current ? 0.8 : 0.6;
      const glow3Alpha = scanningActiveRef.current ? 0.6 : 0.4;

      ctx.globalCompositeOperation = 'lighter';

      // Core light
      const coreGradient = ctx.createLinearGradient(
        lightBarX - lightBarWidth / 2,
        0,
        lightBarX + lightBarWidth / 2,
        0
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      coreGradient.addColorStop(
        0.3,
        `rgba(255, 255, 255, ${0.9 * glowIntensity})`
      );
      coreGradient.addColorStop(
        0.5,
        `rgba(255, 255, 255, ${1 * glowIntensity})`
      );
      coreGradient.addColorStop(
        0.7,
        `rgba(255, 255, 255, ${0.9 * glowIntensity})`
      );
      coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalAlpha = 1;
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.roundRect(lightBarX - lightBarWidth / 2, 0, lightBarWidth, h, 15);
      ctx.fill();

      // First glow layer
      const glow1Gradient = ctx.createLinearGradient(
        lightBarX - lightBarWidth * 2,
        0,
        lightBarX + lightBarWidth * 2,
        0
      );
      glow1Gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
      glow1Gradient.addColorStop(
        0.5,
        `rgba(196, 181, 253, ${0.8 * glowIntensity})`
      );
      glow1Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.globalAlpha = glow1Alpha;
      ctx.fillStyle = glow1Gradient;
      ctx.beginPath();
      ctx.roundRect(lightBarX - lightBarWidth * 2, 0, lightBarWidth * 4, h, 25);
      ctx.fill();

      // Second glow layer
      const glow2Gradient = ctx.createLinearGradient(
        lightBarX - lightBarWidth * 4,
        0,
        lightBarX + lightBarWidth * 4,
        0
      );
      glow2Gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
      glow2Gradient.addColorStop(
        0.5,
        `rgba(139, 92, 246, ${0.4 * glowIntensity})`
      );
      glow2Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.globalAlpha = glow2Alpha;
      ctx.fillStyle = glow2Gradient;
      ctx.beginPath();
      ctx.roundRect(lightBarX - lightBarWidth * 4, 0, lightBarWidth * 8, h, 35);
      ctx.fill();

      // Third glow layer (only when scanning)
      if (scanningActiveRef.current) {
        const glow3Gradient = ctx.createLinearGradient(
          lightBarX - lightBarWidth * 8,
          0,
          lightBarX + lightBarWidth * 8,
          0
        );
        glow3Gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
        glow3Gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
        glow3Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.globalAlpha = glow3Alpha;
        ctx.fillStyle = glow3Gradient;
        ctx.beginPath();
        ctx.roundRect(
          lightBarX - lightBarWidth * 8,
          0,
          lightBarWidth * 16,
          h,
          45
        );
        ctx.fill();
      }

      // Fade at edges with mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 1;
      const verticalGradient = ctx.createLinearGradient(0, 0, 0, h);
      verticalGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      verticalGradient.addColorStop(fadeZone / h, 'rgba(255, 255, 255, 1)');
      verticalGradient.addColorStop(1 - fadeZone / h, 'rgba(255, 255, 255, 1)');
      verticalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = verticalGradient;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      // Update dynamic properties based on scanning state
      const targetIntensity = scanningActiveRef.current
        ? scanTargetIntensity
        : baseIntensity;
      const targetMaxParticles = scanningActiveRef.current
        ? scanTargetParticles
        : baseMaxParticles;
      const targetFadeZone = scanningActiveRef.current
        ? scanTargetFadeZone
        : baseFadeZone;

      currentIntensity +=
        (targetIntensity - currentIntensity) * transitionSpeed;
      currentMaxParticles +=
        (targetMaxParticles - currentMaxParticles) * transitionSpeed;
      currentFadeZone += (targetFadeZone - currentFadeZone) * transitionSpeed;

      intensity = currentIntensity;
      maxParticles = Math.floor(currentMaxParticles);
      fadeZone = currentFadeZone;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      drawLightBar();

      ctx.globalCompositeOperation = 'lighter';

      // Update and draw particles
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        if (!p) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.time++;
        p.alpha =
          p.originalAlpha * p.life +
          Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
        p.life -= p.decay;

        if (p.x > w + 10 || p.life <= 0) {
          const newParticle = createParticle();
          newParticle.originalAlpha = newParticle.alpha;
          Object.assign(p, newParticle);
        }

        if (p.life > 0) {
          let fadeAlpha = 1;
          if (p.y < fadeZone) {
            fadeAlpha = p.y / fadeZone;
          } else if (p.y > h - fadeZone) {
            fadeAlpha = (h - p.y) / fadeZone;
          }

          ctx.globalAlpha = p.alpha * fadeAlpha;
          ctx.drawImage(
            gradientCanvas,
            p.x - p.radius,
            p.y - p.radius,
            p.radius * 2,
            p.radius * 2
          );
        }
      }

      // Dynamic particle creation based on intensity
      const intensityRatio = intensity / baseIntensity;

      if (Math.random() < intensity && count < maxParticles) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particles[count++] = particle;
      }

      // Additional particle creation stages for high intensity
      if (
        intensityRatio > 1.1 &&
        Math.random() < (intensityRatio - 1.0) * 1.2
      ) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particles[count++] = particle;
      }

      if (
        intensityRatio > 1.3 &&
        Math.random() < (intensityRatio - 1.3) * 1.4
      ) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particles[count++] = particle;
      }

      if (
        intensityRatio > 1.5 &&
        Math.random() < (intensityRatio - 1.5) * 1.8
      ) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particles[count++] = particle;
      }

      if (
        intensityRatio > 2.0 &&
        Math.random() < (intensityRatio - 2.0) * 2.0
      ) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particles[count++] = particle;
      }

      // Remove excess particles
      if (count > maxParticles + 200) {
        const excessCount = Math.min(15, count - maxParticles);
        for (let i = 0; i < excessCount; i++) {
          delete particles[count - i - 1];
        }
        count -= excessCount;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="disappearing-cards-container">
      {/* Controls */}
      <Controls
        toggleAnimation={toggleAnimation}
        resetPosition={resetPosition}
        changeDirection={changeDirection}
        isAnimating={isAnimating}
      />

      {/* Speed Indicator */}
      <SpeedIndicator
        velocity={velocity}
        speedValueRef={speedValueRef as React.RefObject<HTMLSpanElement>}
      />

      {/* Main Container */}
      <div className="container" ref={containerRef}>
        <canvas ref={particleCanvasRef} id="particleCanvas" />
        <canvas ref={scannerCanvasRef} id="scannerCanvas" />
        <div className="scanner" />

        <div className="card-stream">
          <div
            ref={cardLineRef}
            className="card-line"
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            {cards.map(card => (
              <div key={card.id} className="card-wrapper">
                <div className="card card-normal">
                  <Image
                    width={400}
                    height={250}
                    className="card-image"
                    src={card.imageUrl}
                    alt="Credit Card"
                    priority={card.id < 5}
                    unoptimized
                  />
                </div>
                <div className="card card-ascii">
                  <div className="ascii-content">{card.asciiCode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
