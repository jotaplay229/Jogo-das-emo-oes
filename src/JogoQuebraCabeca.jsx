import React, { useState, useEffect } from 'react';
import './App.css';

const perguntas = [
  {
    id: 1,
    texto: 'Monte a emoção: feliz 😊',
    imagens: [
      { id: 1, src: '/assets/feliz_1.png' },
      { id: 2, src: '/assets/feliz_2.png' },
      { id: 3, src: '/assets/feliz_3.png' },
      { id: 4, src: '/assets/feliz_4.png' },
      { id: 5, src: '/assets/feliz_5.png' },
      { id: 6, src: '/assets/feliz_6.png' },
    ]
  },
  {
    id: 2,
    texto: 'Monte a emoção: triste 😢',
    imagens: [
      { id: 1, src: '/assets/triste_1.png' },
      { id: 2, src: '/assets/triste_2.png' },
      { id: 3, src: '/assets/triste_3.png' },
      { id: 4, src: '/assets/triste_4.png' },
      { id: 5, src: '/assets/triste_5.png' },
      { id: 6, src: '/assets/triste_6.png' },
    ]
  },
  {
    id: 3,
    texto: 'Monte a emoção: raiva 😠',
    imagens: [
      { id: 1, src: '/assets/raiva_1.png' },
      { id: 2, src: '/assets/raiva_2.png' },
      { id: 3, src: '/assets/raiva_3.png' },
      { id: 4, src: '/assets/raiva_4.png' },
      { id: 5, src: '/assets/raiva_5.png' },
      { id: 6, src: '/assets/raiva_6.png' },
    ]
  }
];

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const JogoQuebraCabeca = ({ onCompleto, narrar }) => {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pecas, setPecas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [trocandoIndex, setTrocandoIndex] = useState(null);
  const [acertou, setAcertou] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    setPecas(embaralhar(perguntas[perguntaAtual].imagens));
    setAcertou(false);
    setSelecionada(null);
    setTrocandoIndex(null);
  }, [perguntaAtual]);

  useEffect(() => {
    if (pecas.length === 0) return;
    const estaCorreto = pecas.every((p, i) => p.id === perguntas[perguntaAtual].imagens[i].id);
    if (estaCorreto && !acertou) {
      setAcertou(true);
      narrar && narrar("Muito bem!");
    }
  }, [pecas, perguntaAtual, acertou, narrar]);

  const trocarPecas = (index) => {
    if (selecionada === null) {
      setSelecionada(index);
    } else {
      const novasPecas = [...pecas];
      [novasPecas[selecionada], novasPecas[index]] = [novasPecas[index], novasPecas[selecionada]];
      setPecas(novasPecas);
      setTrocandoIndex(index);
      setSelecionada(null);

      setTimeout(() => {
        setTrocandoIndex(null);
      }, 300);
    }
  };

  const proximaPergunta = () => {
    const proxima = perguntaAtual + 1;

    if (proxima < perguntas.length) {
      setPerguntaAtual(proxima);
    } else {
      setFinalizado(true);
      onCompleto && onCompleto(); // Só chama aqui, após todas as fases
    }
  };

  return (
    <div>
      <h3>{perguntas[perguntaAtual].texto}</h3>
      <div className="grade-quebra-cabeca">
        {pecas.map((p, i) => (
          <img
            key={`${p.id}-${i}`}
            src={p.src}
            alt={`Peça ${p.id}`}
            onClick={() => trocarPecas(i)}
            className={`peca ${selecionada === i ? 'selecionada' : ''}`}
          />
        ))}
      </div>
      <p style={{ marginTop: '10px' }}>Clique em duas peças para trocá-las de lugar.</p>

      {acertou && !finalizado && (
        <button onClick={proximaPergunta} className="botao-proximo" style={{ marginTop: '15px' }}>
          Próxima Emoção 🤔
        </button>
      )}
    </div>
  );
};

export default JogoQuebraCabeca;
