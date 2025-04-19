"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

const SimpleFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Create a gradient background
    const bgTexture = createGradientTexture()
    scene.background = bgTexture

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

    // Create a rotating earth with better materials
    const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64)
    const earthMaterial = new THREE.MeshPhysicalMaterial({
      color: "#4d7cff",
      metalness: 0.1,
      roughness: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      emissive: "#1a4cff",
      emissiveIntensity: 0.2,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.position.set(0, 0, -3)
    earth.castShadow = true
    earth.receiveShadow = true
    scene.add(earth)

    // Create a transparent outer layer with a glow effect
    const outerGeometry = new THREE.SphereGeometry(1.55, 64, 64)
    const outerMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
    })
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial)
    outerSphere.position.set(0, 0, -3)
    scene.add(outerSphere)

    // Add a glow effect
    const glowGeometry = new THREE.SphereGeometry(1.7, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#4d7cff",
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    })
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
    glowSphere.position.set(0, 0, -3)
    scene.add(glowSphere)

    // Create feature cards with better materials
    const createFeatureCard = (x: number, y: number, z: number, color: string) => {
      const cardGeometry = new THREE.BoxGeometry(2, 1, 0.1)
      const cardMaterial = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.2,
        roughness: 0.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
      })
      const card = new THREE.Mesh(cardGeometry, cardMaterial)
      card.position.set(x, y, z)
      card.castShadow = true
      card.receiveShadow = true
      scene.add(card)
      return card
    }

    // Create feature cards
    const card1 = createFeatureCard(-3, 0, 0, "#4d7cff")
    const card2 = createFeatureCard(0, 0, 0, "#ff4d7c")
    const card3 = createFeatureCard(3, 0, 0, "#7cff4d")

    // Add particles for a more dynamic background
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: "#ffffff",
      transparent: true,
      opacity: 0.5,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Create a function to generate a gradient texture
    function createGradientTexture() {
      const canvas = document.createElement("canvas")
      canvas.width = 2
      canvas.height = 512

      const context = canvas.getContext("2d")
      if (!context) return new THREE.Color("#4d7cff")

      const gradient = context.createLinearGradient(0, 0, 0, 512)
      gradient.addColorStop(0, "#2a3baa")
      gradient.addColorStop(0.5, "#4d7cff")
      gradient.addColorStop(1, "#2a3baa")

      context.fillStyle = gradient
      context.fillRect(0, 0, 2, 512)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    // Mouse move event handler
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Intersection Observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
          } else {
            setInView(false)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      const time = Date.now() * 0.001 // Convert to seconds

      // Rotate earth
      earth.rotation.y += 0.005
      outerSphere.rotation.y += 0.003
      glowSphere.rotation.y += 0.002

      // Animate cards
      card1.position.y = Math.sin(time * 0.5) * 0.1
      card1.rotation.z = Math.sin(time * 0.3) * 0.05
      card1.rotation.y = Math.sin(time * 0.2) * 0.02

      card2.position.y = Math.sin((time + 1) * 0.5) * 0.1
      card2.rotation.z = Math.sin((time + 1) * 0.3) * 0.05
      card2.rotation.y = Math.sin((time + 1) * 0.2) * 0.02

      card3.position.y = Math.sin((time + 2) * 0.5) * 0.1
      card3.rotation.z = Math.sin((time + 2) * 0.3) * 0.05
      card3.rotation.y = Math.sin((time + 2) * 0.2) * 0.02

      // Animate particles
      particlesMesh.rotation.y = time * 0.03
      particlesMesh.rotation.x = time * 0.02

      // Respond to mouse movement
      camera.position.x += (mousePosition.x * 0.5 - camera.position.x) * 0.05
      camera.position.y += (mousePosition.y * 0.5 - camera.position.y) * 0.05
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()

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
    <div id="features" className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Our Features</span>
        </h2>
      </div>

      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="text-3xl mb-2 bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                📚
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Course Creation</h3>
              <p className="text-gray-600">
                Create engaging courses with our intuitive tools and templates. Add videos, quizzes, and assignments
                with ease.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>

            <div
              className={`bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="text-3xl mb-2 bg-pink-100 text-pink-600 w-12 h-12 rounded-full flex items-center justify-center">
                🤖
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">AI Transcription</h3>
              <p className="text-gray-600">
                Automatic transcription for all your educational videos. Save time and make your content accessible to
                everyone.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-pink-500 to-red-600 rounded-full"></div>
            </div>

            <div
              className={`bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="text-3xl mb-2 bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center">
                💬
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Real-time Discussions</h3>
              <p className="text-gray-600">
                Engage with students in real-time collaborative discussions. Foster a community of learning and growth.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700">
          Get Started Today
        </button>
      </div>
    </div>
  )
}

export default SimpleFeatures
