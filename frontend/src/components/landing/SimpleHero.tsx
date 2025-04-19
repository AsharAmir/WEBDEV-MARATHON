"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

const SimpleHero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#5D87FF")

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)

    // Add a point light for more dynamic lighting
    const pointLight = new THREE.PointLight(0x4d7cff, 1, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    // Create 3D text for "EdTech"
    const createText = () => {
      const textGroup = new THREE.Group()

      // Create individual letters for more dynamic animation
      const letters = ["E", "d", "T", "e", "c", "h"]
      const colors = ["#5D87FF", "#4D7CFF", "#3D6CFF", "#2D5CFF", "#1D4CFF", "#0D3CFF"]

      letters.forEach((letter, index) => {
        const textGeometry = new THREE.BoxGeometry(0.8, 1, 0.2)
        const textMaterial = new THREE.MeshPhysicalMaterial({
          color: colors[index],
          metalness: 0.3,
          roughness: 0.4,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.position.x = (index - 2.5) * 1.2
        textMesh.position.y = 2
        textMesh.castShadow = true
        textMesh.userData = { originalY: 2, letterIndex: index }
        textGroup.add(textMesh)
      })

      scene.add(textGroup)
      return textGroup
    }

    // Create floating books with better materials
    const createBook = (x: number, y: number, z: number, color: string) => {
      const bookGroup = new THREE.Group()

      // Book base
      const bookGeometry = new THREE.BoxGeometry(1, 0.1, 1.4)
      const bookMaterial = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
      })
      const book = new THREE.Mesh(bookGeometry, bookMaterial)
      book.castShadow = true
      book.receiveShadow = true
      bookGroup.add(book)

      // Book pages
      const pagesGeometry = new THREE.BoxGeometry(0.9, 0.1, 1.3)
      const pagesMaterial = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.5,
      })
      const pages = new THREE.Mesh(pagesGeometry, pagesMaterial)
      pages.position.y = 0.1
      pages.castShadow = true
      pages.receiveShadow = true
      bookGroup.add(pages)

      bookGroup.position.set(x, y, z)
      scene.add(bookGroup)

      return bookGroup
    }

    // Create floating orbs with glow effect
    const createGlowingOrb = (x: number, y: number, z: number, color: string, radius = 0.3) => {
      const orbGroup = new THREE.Group()

      // Core sphere
      const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
      const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.castShadow = true
      orbGroup.add(sphere)

      // Outer glow
      const glowGeometry = new THREE.SphereGeometry(radius * 1.5, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      orbGroup.add(glow)

      orbGroup.position.set(x, y, z)
      scene.add(orbGroup)

      return orbGroup
    }

    // Create a floating platform
    const createPlatform = () => {
      const platformGeometry = new THREE.CylinderGeometry(5, 5, 0.2, 32)
      const platformMaterial = new THREE.MeshPhysicalMaterial({
        color: "#3D6CFF",
        metalness: 0.2,
        roughness: 0.5,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        transparent: true,
        opacity: 0.7,
      })
      const platform = new THREE.Mesh(platformGeometry, platformMaterial)
      platform.position.y = -2
      platform.receiveShadow = true
      scene.add(platform)
      return platform
    }

    // Create interactive particles
    const createParticles = () => {
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = 2000
      const posArray = new Float32Array(particlesCount * 3)
      const scaleArray = new Float32Array(particlesCount)

      for (let i = 0; i < particlesCount * 3; i += 3) {
        // Create a sphere distribution
        const radius = 7
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        posArray[i] = radius * Math.sin(phi) * Math.cos(theta)
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
        posArray[i + 2] = radius * Math.cos(phi)

        // Random sizes for particles
        scaleArray[i / 3] = Math.random() * 2 + 0.5
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
      particlesGeometry.setAttribute("scale", new THREE.BufferAttribute(scaleArray, 1))

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: "#ffffff",
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      })

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particlesMesh)
      return particlesMesh
    }

    // Create objects
    const textGroup = createText()
    const book1 = createBook(-3, -1, -1, "#5D87FF")
    const book2 = createBook(-2.5, -1.5, 0, "#FF5D87")
    const book3 = createBook(3, -1, 1, "#87FF5D")
    const orb1 = createGlowingOrb(2, 0, 0, "#5D87FF")
    const orb2 = createGlowingOrb(-2, 1, -1, "#FF5D87")
    const orb3 = createGlowingOrb(0, -1, 2, "#87FF5D")
    const orb4 = createGlowingOrb(1.5, 1.5, -2, "#FFFF5D")
    const orb5 = createGlowingOrb(-1.5, 0.5, 1, "#5DFFFF")
    const platform = createPlatform()
    const particles = createParticles()

    // Mouse move event handler
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      const time = Date.now() * 0.001 // Convert to seconds

      // Animate 3D text
      textGroup.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const originalY = mesh.userData.originalY
        const letterIndex = mesh.userData.letterIndex

        // Wave animation for letters
        mesh.position.y = originalY + Math.sin(time * 1.5 + letterIndex * 0.5) * 0.1

        // Subtle rotation
        mesh.rotation.x = Math.sin(time * 0.5 + letterIndex) * 0.1
        mesh.rotation.y = Math.sin(time * 0.3 + letterIndex) * 0.1
      })

      // Animate books
      book1.position.y = -1 + Math.sin(time) * 0.1
      book1.rotation.z = Math.sin(time * 0.4) * 0.1
      book1.rotation.y = Math.sin(time * 0.2) * 0.05

      book2.position.y = -1.5 + Math.sin(time + 1) * 0.1
      book2.rotation.z = Math.sin((time + 1) * 0.4) * 0.1
      book2.rotation.y = Math.sin((time + 1) * 0.2) * 0.05

      book3.position.y = -1 + Math.sin(time + 2) * 0.1
      book3.rotation.z = Math.sin((time + 2) * 0.4) * 0.1
      book3.rotation.y = Math.sin((time + 2) * 0.2) * 0.05

      // Animate orbs
      orb1.position.y = Math.sin(time * 0.7) * 0.3
      orb1.rotation.y += 0.01

      orb2.position.y = 1 + Math.sin(time * 0.5) * 0.2
      orb2.rotation.x += 0.01

      orb3.position.y = -1 + Math.sin(time * 0.6) * 0.25
      orb3.rotation.z += 0.01

      orb4.position.y = 1.5 + Math.sin(time * 0.4) * 0.15
      orb4.rotation.y -= 0.01

      orb5.position.y = 0.5 + Math.sin(time * 0.8) * 0.2
      orb5.rotation.x -= 0.01

      // Animate platform
      platform.rotation.y = time * 0.1

      // Animate particles - respond to mouse movement
      particles.rotation.x += 0.0005
      particles.rotation.y += 0.0005

      // Subtle movement based on mouse position
      const particlePositions = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particlePositions.length; i += 3) {
        const x = particlePositions[i]
        const y = particlePositions[i + 1]
        const z = particlePositions[i + 2]

        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z)

        // Move particles slightly based on mouse position
        particlePositions[i] += mousePosition.x * 0.001 * (7 / distance)
        particlePositions[i + 1] += mousePosition.y * 0.001 * (7 / distance)
      }
      particles.geometry.attributes.position.needsUpdate = true

      // Respond to mouse movement - camera parallax effect
      camera.position.x += (mousePosition.x * 0.3 - camera.position.x) * 0.05
      camera.position.y += (mousePosition.y * 0.3 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      // Animate point light
      pointLight.position.x = Math.sin(time * 0.7) * 3
      pointLight.position.y = Math.cos(time * 0.5) * 3
      pointLight.position.z = Math.sin(time * 0.3) * 3 + 3

      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()
    setLoaded(true)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          }
        }
      })
    }
  }, [])

  return (
    <div id="home" className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />

      {loaded && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="animate-fadeIn">
            <h1
              className="text-6xl font-bold text-white mb-4 opacity-0 animate-fadeIn"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              EdTech
            </h1>
            <p
              className="text-xl text-white mb-8 opacity-0 animate-fadeIn"
              style={{ animationDelay: "1.5s", animationFillMode: "forwards" }}
            >
              Seamless Learning Experience
            </p>
            <div
              className="flex gap-4 justify-center opacity-0 animate-fadeIn"
              style={{ animationDelay: "2s", animationFillMode: "forwards" }}
            >
              <button className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started
              </button>
              <button className="px-6 py-3 border-2 border-white hover:bg-white/10 text-white rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default SimpleHero
