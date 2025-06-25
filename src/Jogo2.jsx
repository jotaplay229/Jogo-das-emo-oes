import React, { useState, useEffect } from 'react';

const perguntasFixas = [
  {
    id: 1,
    som: "/assets/anger.mp3",
    correta: "anger",
    opcoes: ["cry", "laugh", "anger"]
  },
  {
    id: 2,
    som: "/assets/cry.mp3",
    correta: "cry",
    opcoes: ["anger", "cry", "laugh"]
  },
  {
    id: 3,
    som: "/assets/laugh.mp3",
    correta: "laugh",
    opcoes: ["laugh", "anger", "cry"]
  }
];

export default function Jogo2({ onCompleto, narrar }) {
  const [indice, setIndice] = useState(0);
  const [perguntas, setPerguntas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [acertou, setAcertou] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    const embaralhadas = perguntasFixas.map(p => ({
      ...p,
      opcoes: [...p.opcoes].sort(() => Math.random() - 0.5)
    })).sort(() => Math.random() - 0.5);
    setPerguntas(embaralhadas);
  }, []);

  const responder = (opcao) => {
    setSelecionada(opcao);
    if (perguntas[indice].correta === opcao) {
      narrar("Muito bem!");
      setAcertou(true);
    } else {
      narrar("Tente novamente.");
    }
  };

  const proximo = () => {
    if (indice < perguntas.length - 1) {
      setIndice(indice + 1);
      setSelecionada(null);
      setAcertou(false);
    } else {
      setFinalizado(true);
      onCompleto();
    }
  };

  const atual = perguntas[indice];
  if (!atual) return null;

  return (
    <div>
      <audio src={atual.som} controls autoPlay />
      <div className="card-container">
        {atual.opcoes.map(opcao => (
          <img
            key={opcao}
            src={`/assets/${opcao}.png`}
            alt={opcao}
            className={`card-img ${selecionada === opcao ? 'selecionada' : ''}`}
            onClick={() => !acertou && responder(opcao)}
          />
        ))}
      </div>

      {!finalizado && acertou && (
        <button onClick={proximo} className="botao-proximo">
          {indice < perguntas.length - 1 ? 'Próxima Pergunta 🤔' : 'Próximo Jogo ​👏​​'}
        </button>
      )}
    </div>
  );
}