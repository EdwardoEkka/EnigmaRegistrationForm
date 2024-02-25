import React, { useEffect } from 'react';
import { Particle } from 'jparticles';

const Example = () => {
    useEffect(() => {
      const particleOptions = {
        color: 'green',
        lineShape: 'cube',
        range: 2000,
        proximity: 100,
        parallax: true,
      };
  
      new Particle('#demo', particleOptions);
  
      // No need for a cleanup function in this case
  
      return () => {
        // Cleanup code if needed
    
      };
    }, []); 
  
    const containerStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 0,
      backgroundColor:"black",
    };
  
    return <div id="demo" style={containerStyle}></div>;
  }

  export default Example;