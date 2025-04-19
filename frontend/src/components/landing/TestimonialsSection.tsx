import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Web Development Student',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'LearnBeyond has completely transformed how I approach learning to code. The real-time chat with my tutor meant I never got stuck for long, and the AI-generated transcripts made it so easy to review complex concepts later. I landed my first developer job within 3 months!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Wong',
    role: 'Data Science Professional',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'As someone transitioning careers, I needed a flexible but comprehensive learning platform. The quality of courses here is exceptional, and the interactive exercises provided just the right level of challenge. The community of learners also adds tremendous value.',
    rating: 5
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Digital Marketing Specialist',
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'I\'ve tried many online learning platforms, but LearnBeyond stands out for its modern approach and engaging content. The progress tracking keeps me motivated, and I love being able to chat with my instructors in real-time whenever I have questions.',
    rating: 4
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'University Professor',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'As an educator myself, I\'m impressed by the pedagogical thought that went into designing this platform. The combination of AI tools and human instruction creates a learning experience that\'s both efficient and personalized. I now recommend it to all my students.',
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from students who have transformed their learning journey with us.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div 
            className="testimonial-slider overflow-hidden"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <div className="flex items-center justify-center">
              <button 
                onClick={handlePrev}
                className="absolute left-0 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                  />
                  
                  <div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={18} 
                          className={`${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-lg mb-6 italic">
                      "{testimonials[activeIndex].content}"
                    </p>
                    
                    <div>
                      <p className="font-bold text-xl">{testimonials[activeIndex].name}</p>
                      <p className="text-blue-300">{testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleNext}
                className="absolute right-0 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;