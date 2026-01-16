'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const carouselItems = [
  {
    id: 1,
    title: 'Akasa Air',
    subtitle: 'New year Flight deals',
    discount: 'Up to 20% Off',
    cta: 'Book your trip now',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=400&fit=crop',
    bgColor: 'bg-blue-600'
  },
  {
    id: 2,
    title: 'Electronics Sale',
    subtitle: 'Best Deals on Electronics',
    discount: 'Up to 50% Off',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
    bgColor: 'bg-purple-600'
  },
  {
    id: 3,
    title: 'Fashion Week',
    subtitle: 'Latest Fashion Trends',
    discount: 'Up to 40% Off',
    cta: 'Explore Collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    bgColor: 'bg-pink-600'
  }
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % carouselItems.length
    goToSlide(newIndex)
  }

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-sm">
      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div
            key={item.id}
            className={`min-w-full h-full ${item.bgColor} relative flex items-center justify-center`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="relative z-10 text-white text-center px-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{item.title}</h2>
              <p className="text-lg md:text-xl mb-2">{item.subtitle}</p>
              <p className="text-2xl md:text-3xl font-semibold mb-4">{item.discount}</p>
              <button className="bg-flipkart-yellow text-flipkart-blue px-6 py-2 rounded-sm font-semibold hover:bg-yellow-400 transition">
                {item.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
