import React, { useState, useEffect } from 'react';

const perguntasFixas = [
  {
    pergunta: "Você caiu e perdeu o sorvete.",
    correta: "triste",
    opcoes: [
      { id: "triste", imagem: "/assets/sad.png" },
      { id: "feliz", imagem: "/assets/happy.png" },
      { id: "bravo", imagem: "/assets/angry.png" }
    ]
  },
  {
    pergunta: "O menino ganhou um presente surpresa.",
    correta: "feliz",
    opcoes: [
      { id: "feliz", imagem: "/assets/happy.png" },
      { id: "triste", imagem: "/assets/sad.png" },
      { id: "bravo", imagem: "/assets/angry.png" }
    ]
  },
  {
    pergunta: "Quebraram o brinquedo favorito da menina.",
    correta: "bravo",
    opcoes: [
      { id: "bravo", imagem: "/assets/angry.png" },
      { id: "triste", imagem: "/assets/sad.png" },
      { id: "feliz", imagem: "/assets/happy.png" }
    ]
  }
];

export default function Jogo4({ onCompleto, narrar }) {
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

  const responder = (id) => {
    setSelecionada(id);
    const correta = perguntas[indice].correta === id;
    if (correta) {
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
      <h3>Qual é a emoção desta situação?</h3>
      <p>{atual.pergunta}</p>
      <div className="card-container">
        {atual.opcoes.map(opcao => (
          <img
            key={opcao.id}
            src={opcao.imagem}
            alt={opcao.id}
            className={`card-img ${selecionada === opcao.id ? 'selecionada' : ''}`}
            onClick={() => !acertou && responder(opcao.id)}
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
