import React, { useState, useRef, useEffect } from 'react';

const paresBase = [
  { id: 1, pergunta: "Qual imagem mostra um gato?", imagem: "/assets/cat.png", resposta: "cat" },
  { id: 2, pergunta: "Qual imagem mostra um cachorro?", imagem: "/assets/dog.png", resposta: "dog" },
  { id: 3, pergunta: "Qual imagem mostra um coelho?", imagem: "/assets/rabbit.png", resposta: "rabbit" },
  { id: 4, pergunta: "Qual imagem mostra um pássaro?", imagem: "/assets/bird.png", resposta: "bird" }
];

export default function JogoConexao({ avatar, onAcertouTudo, narrar }) {
  const [pares, setPares] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [posicoes, setPosicoes] = useState({});
  const [conexoes, setConexoes] = useState([]);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);
  const refsPerguntas = useRef({});
  const refsImagens = useRef({});

  useEffect(() => {
    const embaralhar = arr => [...arr].sort(() => Math.random() - 0.5);
    const embaralhados = embaralhar(paresBase);
    setPares(embaralhados);
    setPerguntas(embaralhar(embaralhados));
    setImagens(embaralhar(embaralhados));
  }, []);

  useEffect(() => {
    const atualizarPosicoes = () => {
      const svg = document.querySelector('svg');
      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();
      const novasPos = {};

      paresBase.forEach(p => {
        const perguntaEl = refsPerguntas.current[p.id];
        const imagemEl = refsImagens.current[p.id];

        if (perguntaEl) {
          const rect = perguntaEl.getBoundingClientRect();
          novasPos[p.id] = {
            ...novasPos[p.id],
            pergunta: {
              x: rect.right - svgRect.left,
              y: rect.top + rect.height / 2 - svgRect.top
            }
          };
        }

        if (imagemEl) {
          const rect = imagemEl.getBoundingClientRect();
          novasPos[p.id] = {
            ...novasPos[p.id],
            imagem: {
              x: rect.left - svgRect.left,
              y: rect.top + rect.height / 2 - svgRect.top
            }
          };
        }
      });

      setPosicoes(novasPos);
    };

    atualizarPosicoes();
    window.addEventListener('resize', atualizarPosicoes);
    return () => window.removeEventListener('resize', atualizarPosicoes);
  }, [perguntas, imagens]);

  const registrarConexao = (imagemId) => {
    if (!perguntaSelecionada) return;

    const perguntaObj = paresBase.find(p => p.id === perguntaSelecionada);
    const imagemObj = paresBase.find(p => p.id === imagemId);
    const correta = perguntaObj.resposta === imagemObj.resposta;

    const novaConexao = {
      perguntaId: perguntaSelecionada,
      imagemId: imagemId,
      correto: correta
    };

    setConexoes(prev => [...prev, novaConexao]);

    if (!correta) {
      setTimeout(() => {
        setConexoes(prev => prev.filter(
          c => !(c.perguntaId === perguntaSelecionada && c.imagemId === imagemId && !c.correto)
        ));
      }, 1000);
      narrar("Tente novamente.", avatar === 'menina' ? 'feminino' : 'masculino');
    } else {
      narrar("Muito bem!", avatar === 'menina' ? 'feminino' : 'masculino');
    }

    setPerguntaSelecionada(null);
  };

  const perguntasUsadas = conexoes.filter(c => c.correto).map(c => c.perguntaId);
  const imagensUsadas = conexoes.filter(c => c.correto).map(c => c.imagemId);

  useEffect(() => {
    if (conexoes.filter(c => c.correto).length === paresBase.length) {
      onAcertouTudo();
    }
  }, [conexoes]);

  return (
    <div style={{ position: 'relative' }}>
      <h3>Ligue cada pergunta à imagem correta</h3>

      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {conexoes.map((con, i) => {
          const posPergunta = posicoes[con.perguntaId]?.pergunta;
          const posImagem = posicoes[con.imagemId]?.imagem;
          if (!posPergunta || !posImagem) return null;

          const meioX = (posPergunta.x + posImagem.x) / 2;
          const meioY = (posPergunta.y + posImagem.y) / 2;

          return (
            <g key={i}>
              <line
                x1={posPergunta.x}
                y1={posPergunta.y}
                x2={posImagem.x}
                y2={posImagem.y}
                stroke={con.correto ? 'green' : 'red'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x={meioX}
                y={meioY}
                fill={con.correto ? 'green' : 'red'}
                fontSize="20px"
                fontWeight="bold"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {con.correto ? '✅' : '❌'}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="case4-container">
        <div className="case4-coluna">
          {perguntas.map(p => {
            const usada = perguntasUsadas.includes(p.id);
            return (
              <div
                key={p.id}
                ref={el => refsPerguntas.current[p.id] = el}
                onClick={() => !usada && setPerguntaSelecionada(p.id)}
                style={{
                  padding: '12px',
                  backgroundColor: usada ? '#d4edda' : '#f0f0f0',
                  borderRadius: '8px',
                  cursor: usada ? 'not-allowed' : 'pointer',
                  border: perguntaSelecionada === p.id ? '3px solid #7b2cbf' : '2px solid #ccc',
                  opacity: usada ? 0.6 : 1,
                  transition: 'all 0.2s',
                  width: '240px',
                  textAlign: 'left'
                }}
              >
                {p.pergunta}
              </div>
            );
          })}
        </div>

        <div className="case4-coluna">
          {imagens.map(p => {
            const usada = imagensUsadas.includes(p.id);
            return (
              <div
                key={p.id}
                ref={el => refsImagens.current[p.id] = el}
                onClick={() => !usada && registrarConexao(p.id)}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: usada ? '3px solid green' : '2px solid transparent',
                  cursor: usada ? 'not-allowed' : 'pointer',
                  opacity: usada ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                <img
                  src={p.imagem}
                  alt={p.resposta}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
