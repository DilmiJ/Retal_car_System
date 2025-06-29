import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const cardsRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate service cards
      gsap.from(".service-card", {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: '🛒',
      title: 'Buy Cars',
      description: 'Browse thousands of verified cars from trusted dealers and private sellers.',
      features: ['Verified listings', 'Detailed inspections', 'Financing options', 'Warranty available'],
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: '💰',
      title: 'Sell Cars',
      description: 'Get the best price for your car with our easy selling process.',
      features: ['Free valuation', 'Professional photos', 'Wide reach', 'Quick sale'],
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: '🔑',
      title: 'Rent Cars',
      description: 'Flexible car rental options for short-term and long-term needs.',
      features: ['Hourly/Daily/Monthly', 'Insurance included', 'Delivery available', '24/7 support'],
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-40 h-40 bg-primary-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Whether you're looking to buy, sell, or rent a car, we've got you covered
            with comprehensive solutions tailored to your needs.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`service-card ${service.color} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Icon */}
              <div className={`${service.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-3xl">{service.icon}</span>
              </div>

              {/* Content */}
              <h3 className={`text-2xl font-bold ${service.textColor} mb-4`}>
                {service.title}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <span className={`${service.textColor} mr-3`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                className={`w-full ${service.textColor.replace('text-', 'bg-').replace('-600', '-600')} hover:${service.textColor.replace('text-', 'bg-').replace('-600', '-700')} text-white py-3 px-6 rounded-xl font-semibold transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust CarHub for their automotive needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                Browse Cars Now
              </button>
              <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                List Your Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
