import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas fill the hero section
    const resizeCanvas = () => {
      if (heroRef.current) {
        canvas.width = heroRef.current.offsetWidth;
        canvas.height = heroRef.current.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Particle[] = [];
    const particleCount = 100;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect particles with lines
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            if (ctx) {
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - distance/1000})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
      }
    }

    animate();

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Learn Beyond <span className="text-blue-400">Limits</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join the next generation of learning where AI-powered education meets real-time collaboration. Discover, create, and share knowledge like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/courses" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Explore Courses
              <ArrowRight className="ml-2" size={20} />
            </Link>
            
            <Link 
              to="/signup" 
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Become a Tutor
            </Link>
          </div>
          
          <div className="flex justify-center space-x-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="text-blue-200 mt-2">Courses</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50k+</div>
              <div className="text-blue-200 mt-2">Students</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white">100+</div>
              <div className="text-blue-200 mt-2">Expert Tutors</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="text-white/70 text-sm mb-2">Scroll Down</div>
        <div className="w-8 h-8 border-b-2 border-r-2 border-white/70 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default HeroSection;