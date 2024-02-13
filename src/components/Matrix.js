import React, { useEffect, useRef } from 'react';

const Matrix = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    var letters = 'ENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMAENIGMA';
    letters = letters.split('');

   
    var fontSize = 10,
        columns = canvas.width / fontSize;

    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }
    }

    
    const animationInterval = setInterval(draw, 33);

    
    return () => clearInterval(animationInterval);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Matrix;
