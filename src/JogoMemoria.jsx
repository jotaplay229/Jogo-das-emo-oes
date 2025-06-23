import React, { useState, useEffect } from 'react';
import './App.css';

const imagensBase = [
  '/assets/happy.png',
  '/assets/dog.png',
  '/assets/angry_face.png',
  '/assets/laugh.png',
  '/assets/cry.png',
  '/assets/bird.png'
];

export default function JogoMemoria({ onAcertoFinal }) {
  const [cartas, setCartas] = useState([]);
  const [viradas, setViradas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);

  useEffect(() => {
    const todas = [...imagensBase, ...imagensBase];
    const embaralhadas = todas.sort(() => Math.random() - 0.5);
    setCartas(embaralhadas);
  }, []);

  const handleClique = (index) => {
    if (viradas.length === 2 || viradas.includes(index) || encontradas.includes(cartas[index])) return;

    const novaVirada = [...viradas, index];
    setViradas(novaVirada);

    if (novaVirada.length === 2) {
      const primeira = cartas[novaVirada[0]];
      const segunda = cartas[novaVirada[1]];
      if (primeira === segunda) {
        setEncontradas((prev) => [...prev, primeira]);
      }
      setTimeout(() => {
        setViradas([]);
      }, 1000);
    }
  };
  
  useEffect(() => {
    if (encontradas.length === imagensBase.length) {
      onAcertoFinal();
    }
  }, [encontradas, onAcertoFinal]);
  
  

  return (
    <div className="memoria-grid">
      {cartas.map((img, index) => {
        const estaVirada = viradas.includes(index) || encontradas.includes(img);
        return (
           <div
    key={index}
    className={`carta ${estaVirada ? 'virada' : ''}`}
    onClick={() => handleClique(index)}
  >
    <div className="carta-inner">
      <div className="frente">
        <img src={img} alt="carta" />
      </div>
      <div className="verso">?</div>
    </div>
  </div>
        );
      })}
    </div>
  );
}
