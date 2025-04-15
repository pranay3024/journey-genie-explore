
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { heritageSites, HeritageSite } from '@/utils/heritageSites';

const Explore = () => {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [gyroscopeSupported, setGyroscopeSupported] = useState(false);
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const currentSite = heritageSites[currentSiteIndex];
  
  useEffect(() => {
    // Check if gyroscope is supported
    if (window.DeviceOrientationEvent) {
      setGyroscopeSupported(true);
    }
    
    // Listen for device orientation changes
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (gyroscopeEnabled && event.beta !== null && event.gamma !== null) {
        // Convert degrees to offset values (limited range)
        const y = Math.min(Math.max(event.beta - 45, -15), 15);
        const x = Math.min(Math.max(event.gamma, -15), 15);
        setOffset({ x: -x, y: -y });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroscopeEnabled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gyroscopeEnabled) {
      const { clientX, clientY, currentTarget } = e;
      const { width, height, left, top } = currentTarget.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the element
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 20;
      
      setOffset({ x, y });
    }
  };
  
  const toggleGyroscope = () => {
    setGyroscopeEnabled(!gyroscopeEnabled);
    if (!gyroscopeEnabled) {
      // Reset the offset when enabling gyroscope
      setOffset({ x: 0, y: 0 });
    }
  };

  const nextSite = () => {
    setCurrentSiteIndex((prevIndex) => (prevIndex + 1) % heritageSites.length);
    setOffset({ x: 0, y: 0 });
  };

  const prevSite = () => {
    setCurrentSiteIndex((prevIndex) => (prevIndex === 0 ? heritageSites.length - 1 : prevIndex - 1));
    setOffset({ x: 0, y: 0 });
  };

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // In a real implementation, this would play/pause an audio clip
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Main viewer */}
      <div 
        className="flex-1 relative overflow-hidden" 
        onMouseMove={handleMouseMove}
        style={{ cursor: gyroscopeEnabled ? 'default' : 'move' }}
      >
        {/* Background image with parallax effect */}
        <motion.div 
          className="absolute inset-0 scale-110"
          animate={{ 
            x: offset.x, 
            y: offset.y 
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <img 
            src={currentSite.image} 
            alt={currentSite.name} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Info panel */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-all duration-300 ${isInfoVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={currentSite.id}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentSite.name}</h1>
              <p className="text-lg text-gray-300 mb-4">{currentSite.location}, {currentSite.country} • Established {currentSite.yearEstablished}</p>
              <p className="text-gray-300 max-w-3xl">{currentSite.description}</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={prevSite} size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="ghost" onClick={nextSite} size="icon">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {currentSiteIndex + 1} / {heritageSites.length}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={toggleInfo} size="icon">
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={toggleAudio} size="icon">
              {isAudioPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            
            {gyroscopeSupported && (
              <Button 
                variant={gyroscopeEnabled ? "default" : "ghost"} 
                onClick={toggleGyroscope} 
                className="text-xs"
                size="sm"
              >
                {gyroscopeEnabled ? "Disable Gyroscope" : "Enable Gyroscope"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
