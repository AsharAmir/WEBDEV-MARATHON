"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

const SimpleStats = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [inView, setInView] = useState(false)
  const [counters, setCounters] = useState({ students: 0, courses: 0, satisfaction: 0 })

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

    // Create stat cubes with better materials
    const createStatCube = (x: number, y: number, z: number, color: string) => {
      const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
      const cubeMaterial = new THREE.MeshPhysicalMaterial({
        color,
        transmission: 0.5,
        thickness: 0.5,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.2,
        ior: 1.5,
      })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(x, y, z)
      cube.castShadow = true
      cube.receiveShadow = true
      scene.add(cube)
      return cube
    }

    // Create stat cubes
    const cube1 = createStatCube(-4, 0, 0, "#4d7cff")
    const cube2 = createStatCube(0, 0, 0, "#ff4d7c")
    const cube3 = createStatCube(4, 0, 0, "#7cff4d")

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
            // Start counter animation when in view
            animateCounters()
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

    // Function to animate counters
    const animateCounters = () => {
      const duration = 2000 // ms
      const frameDuration = 1000 / 60 // 60fps
      const totalFrames = Math.round(duration / frameDuration)

      let frame = 0
      const countTo = {
        students: 10000,
        courses: 500,
        satisfaction: 98,
      }

      const counter = setInterval(() => {
        frame++

        const progress = frame / totalFrames

        setCounters({
          students: Math.floor(countTo.students * progress),
          courses: Math.floor(countTo.courses * progress),
          satisfaction: Math.floor(countTo.satisfaction * progress),
        })

        if (frame === totalFrames) {
          clearInterval(counter)
        }
      }, frameDuration)
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      const time = Date.now() * 0.001 // Convert to seconds

      // Animate cubes
      cube1.rotation.x = Math.sin(time * 0.3) * 0.1
      cube1.rotation.y = Math.sin(time * 0.2) * 0.1
      cube1.rotation.z = Math.sin(time * 0.4) * 0.1

      cube2.rotation.x = Math.sin((time + 1) * 0.3) * 0.1
      cube2.rotation.y = Math.sin((time + 1) * 0.2) * 0.1
      cube2.rotation.z = Math.sin((time + 1) * 0.4) * 0.1

      cube3.rotation.x = Math.sin((time + 2) * 0.3) * 0.1
      cube3.rotation.y = Math.sin((time + 2) * 0.2) * 0.1
      cube3.rotation.z = Math.sin((time + 2) * 0.4) * 0.1

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
    <div id="stats" className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">By the Numbers</span>
        </h2>
      </div>

      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {counters.students.toLocaleString()}+
              </div>
              <div className="text-xl text-blue-200 font-medium drop-shadow-md">Active Students</div>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
            </div>

            <div
              className={`text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {counters.courses.toLocaleString()}+
              </div>
              <div className="text-xl text-pink-200 font-medium drop-shadow-md">Courses Created</div>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full mx-auto"></div>
            </div>

            <div
              className={`text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{counters.satisfaction}%</div>
              <div className="text-xl text-green-200 font-medium drop-shadow-md">Satisfaction Rate</div>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10">
        <button className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          Join our growing community
        </button>
      </div>
    </div>
  )
}

export default SimpleStats
