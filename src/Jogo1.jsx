import React, { useState, useEffect } from 'react';

const perguntasFixas = [
  {
    pergunta: "Qual dessas imagens mostra alguém feliz?",
    opcoes: [
      { id: "feliz", imagem: "/assets/happy.png", correta: true },
      { id: "triste", imagem: "/assets/sad.png", correta: false },
      { id: "bravo", imagem: "/assets/angry.png", correta: false }
    ]
  },
  {
    pergunta: "Qual dessas imagens mostra alguém bravo?",
    opcoes: [
      { id: "bravo", imagem: "/assets/angry.png", correta: true },
      { id: "feliz", imagem: "/assets/happy.png", correta: false },
      { id: "choro", imagem: "/assets/sad.png", correta: false }
    ]
  },
  {
    pergunta: "Qual dessas imagens mostra alguém triste?",
    opcoes: [
      { id: "triste", imagem: "/assets/sad.png", correta: true },
      { id: "risada", imagem: "/assets/happy.png", correta: false },
      { id: "raiva", imagem: "/assets/angry.png", correta: false }
    ]
  }
];

export default function Jogo1({ onCompleto, narrar }) {
  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [acertouAtual, setAcertouAtual] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    const embaralhadas = [...perguntasFixas].sort(() => Math.random() - 0.5);
    embaralhadas.forEach(p => p.opcoes.sort(() => Math.random() - 0.5));
    setPerguntas(embaralhadas);
  }, []);

  const responder = (correta, idImagem) => {
    setRespostaSelecionada(idImagem);
    if (correta) {
      setAcertouAtual(true);
      narrar("Muito bem!");
    } else {
      narrar("Tente novamente.");
    }
  };

  const proxima = () => {
    if (indiceAtual < perguntas.length - 1) {
      setIndiceAtual(prev => prev + 1);
      setAcertouAtual(false);
      setRespostaSelecionada(null);
    } else {
      setFinalizado(true);
      onCompleto();
    }
  };

  if (perguntas.length === 0) return null;

  const perguntaAtual = perguntas[indiceAtual];

  return (
    <div>
      <h3>{perguntaAtual.pergunta}</h3>
      <div className="card-container">
        {perguntaAtual.opcoes.map(opcao => (
          <img
            key={opcao.id}
            src={opcao.imagem}
            alt={opcao.id}
            className={`card-img ${respostaSelecionada === opcao.id ? 'selecionada' : ''}`}
            onClick={() => !acertouAtual && responder(opcao.correta, opcao.id)}
          />
        ))}
      </div>

      {!finalizado && acertouAtual && (
        <button
          className="botao-proximo"
          onClick={proxima}
          style={{ marginTop: '20px' }}
        >
          {indiceAtual < perguntas.length - 1 ? 'Próxima Pergunta 🤔' : 'Próximo Jogo ​👏​​'}
        </button>
      )}
    </div>
  );
}
