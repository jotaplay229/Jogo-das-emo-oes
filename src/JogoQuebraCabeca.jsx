import React, { useState, useEffect } from 'react';
import './App.css';

const pecasOriginais = [
  { id: 1, src: '/assets/feliz_1.png' },
  { id: 2, src: '/assets/feliz_2.png' },
  { id: 3, src: '/assets/feliz_3.png' },
  { id: 4, src: '/assets/feliz_4.png' },
  { id: 5, src: '/assets/feliz_5.png' },
  { id: 6, src: '/assets/feliz_6.png' },
];

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const JogoQuebraCabeca = ({ onCompleto }) => {
  const [pecas, setPecas] = useState(embaralhar(pecasOriginais));
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    const estaCorreto = pecas.every((p, i) => p.id === pecasOriginais[i].id);
    if (estaCorreto) {
      onCompleto();
    }
  }, [pecas, onCompleto]);

const [trocandoIndex, setTrocandoIndex] = useState(null);
  const trocarPecas = (index) => {
  if (selecionada === null) {
    setSelecionada(index);
  } else {
    const novasPecas = [...pecas];
    [novasPecas[selecionada], novasPecas[index]] = [novasPecas[index], novasPecas[selecionada]];
    setPecas(novasPecas);
    setTrocandoIndex(index); // aplica a animação
    setSelecionada(null);

    // remove a animação após 300ms
    setTimeout(() => {
      setTrocandoIndex(null);
    }, 300);
  }
};


  return (
    <div>
      <h3>Monte a emoção: <strong>feliz</strong> 😊</h3>
      <div
  className="grade-quebra-cabeca"
>
  {pecas.map((p, i) => (
    <img
      key={p.id}
      src={p.src}
      alt={`Peça ${p.id}`}
      onClick={() => trocarPecas(i)}
      className={`peca ${selecionada === i ? 'selecionada' : ''}`}
    />
  ))}
</div>
      <p style={{ marginTop: '10px' }}>Clique em duas peças para trocá-las de lugar.</p>
    </div>
  );
};

export default JogoQuebraCabeca;
