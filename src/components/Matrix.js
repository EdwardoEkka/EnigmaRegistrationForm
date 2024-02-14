import React, { useRef, useEffect } from 'react';

const Matrix = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    const letters = 'ENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMA';
    const lettersArray = letters.split('');

  
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    const drops = new Array(columns).fill(1);

  
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    };


    const animationId = setInterval(draw, 33);

  
    return () => clearInterval(animationId);
  }, []); 

  return <canvas ref={canvasRef} />;
};

export default Matrix;
