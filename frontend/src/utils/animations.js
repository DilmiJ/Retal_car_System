import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Animation configurations
export const animationConfig = {
  ease: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    elastic: "elastic.out(1, 0.3)",
    expo: "expo.out"
  },
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    verySlow: 2
  }
};

// Hero animations
export const heroAnimations = {
  // Animate hero text entrance
  animateHeroText: (selector) => {
    const tl = gsap.timeline();
    
    tl.from(`${selector} .hero-title`, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: animationConfig.ease.expo,
      stagger: 0.2
    })
    .from(`${selector} .hero-subtitle`, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: animationConfig.ease.smooth
    }, "-=0.6")
    .from(`${selector} .hero-cta`, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: animationConfig.ease.smooth,
      stagger: 0.1
    }, "-=0.4");
    
    return tl;
  },

  // Animate floating elements
  animateFloatingElements: (selector) => {
    gsap.to(`${selector} .floating-element`, {
      y: -20,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });
  },

  // Animate car model
  animateCarModel: (selector) => {
    const tl = gsap.timeline();
    
    tl.from(`${selector} .car-model`, {
      scale: 0.8,
      opacity: 0,
      rotationY: 45,
      duration: 1.5,
      ease: animationConfig.ease.expo
    })
    .to(`${selector} .car-model`, {
      rotationY: 360,
      duration: 20,
      ease: "none",
      repeat: -1
    });
    
    return tl;
  }
};

// Scroll animations
export const scrollAnimations = {
  // Parallax effect
  parallax: (selector, speed = 0.5) => {
    gsap.to(selector, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: selector,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  },

  // Fade in on scroll
  fadeInOnScroll: (selector, options = {}) => {
    const defaults = {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: animationConfig.ease.smooth
    };
    
    const config = { ...defaults, ...options };
    
    gsap.from(selector, {
      ...config,
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
  },

  // Scale on scroll
  scaleOnScroll: (selector, options = {}) => {
    const defaults = {
      scale: 0.8,
      duration: 1,
      ease: animationConfig.ease.expo
    };
    
    const config = { ...defaults, ...options };
    
    gsap.from(selector, {
      ...config,
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
  },

  // Stagger animation
  staggerOnScroll: (selector, options = {}) => {
    const defaults = {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: animationConfig.ease.smooth
    };
    
    const config = { ...defaults, ...options };
    
    gsap.from(selector, {
      ...config,
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }
};

// Page transitions
export const pageTransitions = {
  // Page enter animation
  pageEnter: (selector) => {
    const tl = gsap.timeline();
    
    tl.from(selector, {
      opacity: 0,
      duration: 0.6,
      ease: animationConfig.ease.smooth
    })
    .from(`${selector} > *`, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: animationConfig.ease.smooth
    }, "-=0.3");
    
    return tl;
  },

  // Page exit animation
  pageExit: (selector) => {
    const tl = gsap.timeline();
    
    tl.to(`${selector} > *`, {
      y: -30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: animationConfig.ease.smooth
    })
    .to(selector, {
      opacity: 0,
      duration: 0.3,
      ease: animationConfig.ease.smooth
    }, "-=0.2");
    
    return tl;
  }
};

// Interactive animations
export const interactiveAnimations = {
  // Button hover effect
  buttonHover: (selector) => {
    const buttons = document.querySelectorAll(selector);
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: animationConfig.ease.bounce
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: animationConfig.ease.smooth
        });
      });
    });
  },

  // Card hover effect
  cardHover: (selector) => {
    const cards = document.querySelectorAll(selector);
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.4,
          ease: animationConfig.ease.smooth
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: animationConfig.ease.smooth
        });
      });
    });
  },

  // Magnetic effect
  magneticEffect: (selector) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: animationConfig.ease.smooth
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: animationConfig.ease.elastic
        });
      });
    });
  }
};

// Utility functions
export const animationUtils = {
  // Kill all animations
  killAll: () => {
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  },

  // Refresh ScrollTrigger
  refresh: () => {
    ScrollTrigger.refresh();
  },

  // Set up responsive animations
  setupResponsive: () => {
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function() {
        // Desktop animations
      },
      "(max-width: 767px)": function() {
        // Mobile animations
      }
    });
  }
};

export default {
  heroAnimations,
  scrollAnimations,
  pageTransitions,
  interactiveAnimations,
  animationUtils,
  animationConfig
};
