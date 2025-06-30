import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const VideoShowcase = () => {
  const navigate = useNavigate();
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play enabled
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Auto-play video when component mounts
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Auto-play failed:', error);
          setIsPlaying(false);
        }
      }
    };

    // Small delay to ensure video element is ready
    const timer = setTimeout(playVideo, 500);
    return () => clearTimeout(timer);
  }, []);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-blue-600/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400 block">
              CarHub Difference
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Watch how we're revolutionizing the car buying and selling experience with cutting-edge technology and unmatched service.
          </motion.p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video Element */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video
              ref={videoRef}
              className="w-full h-auto aspect-video object-cover"
              muted={isMuted}
              loop
              playsInline
              autoPlay
            >
              <source src="/videos/first.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={togglePlayback}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white/20 backdrop-blur-sm rounded-full p-8 border border-white/30"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={48} className="text-white ml-2" />
                </motion.div>
              </motion.div>
            )}

            {/* Video Controls */}
            <motion.div
              className="absolute bottom-6 left-6 right-6 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showControls || !isPlaying ? 1 : 0, y: showControls || !isPlaying ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={togglePlayback}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
                <motion.button
                  onClick={toggleMute}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
              </div>
              <motion.button
                onClick={toggleFullscreen}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize2 size={20} />
              </motion.button>
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full blur-xl opacity-60"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.8, 0.6, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => navigate('/cars')}
            className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
