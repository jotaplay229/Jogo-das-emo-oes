import React, { useState, useEffect } from 'react';
import './App.css';
import JogoMemoria from './JogoMemoria';
import JogoQuebraCabeca from './JogoQuebraCabeca';
import JogoConexao from './JogoConexao';

const vozesMasculinas = ["masculina", "carlos", "daniel", "paulo"];
const vozesFemininas = ["feminina", "luciana", "maria", "helena"];

const jogos = [
  'Jogo 1: Emoção ↔ Imagem',
  'Jogo 2: Som ↔ Emoção',
  'Jogo 3: Expressões Faciais',
  'Jogo 4: Situações do Dia a Dia',
  'Jogo 5: Palavra ↔ Imagem',
  'Jogo 6: Memória'
];

function App() {
  const [fase, setFase] = useState(0);
  const [nome, setNome] = useState('');
  const [avatar, setAvatar] = useState('menino');
  const [comecou, setComecou] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [terminou, setTerminou] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [vozSelecionada, setVozSelecionada] = useState(null);
  const [narradoInicio, setNarradoInicio] = useState(false);
  const [narradoFim, setNarradoFim] = useState(false);

  useEffect(() => {
    const carregarVozes = () => {
      const vozes = window.speechSynthesis.getVoices();
      let voz;

      if (avatar === "menina") {
        voz = vozes.find((v) =>
          v.lang === "pt-BR" &&
          vozesFemininas.some((nome) => v.name.toLowerCase().includes(nome))
        );
      } else {
        voz = vozes.find((v) =>
          v.lang === "pt-BR" &&
          vozesMasculinas.some((nome) => v.name.toLowerCase().includes(nome))
        );
      }

      setVozSelecionada(voz || vozes.find((v) => v.lang === "pt-BR"));
    };

    window.speechSynthesis.onvoiceschanged = carregarVozes;
    carregarVozes();
  }, [avatar]);

  useEffect(() => {
    if (comecou && nome && vozSelecionada && !narradoInicio) {
      setNarradoInicio(true);
      setTimeout(() => {
        narrar(`Olá ${nome}, bem-vindo ao Mundo das Emoções!`);
      }, 400);
    }
  }, [comecou, nome, vozSelecionada, narradoInicio]);

  useEffect(() => {
    if (terminou && nome && vozSelecionada && !narradoFim) {
      setNarradoFim(true);
      setTimeout(() => {
        narrar(`Parabéns ${nome}! Você completou o Mundo das Emoções!`);
      }, 400);
    }
  }, [terminou, nome, vozSelecionada, narradoFim]);

  const narrar = (texto) => {
    if (!vozSelecionada) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.voice = vozSelecionada;
    window.speechSynthesis.speak(fala);
  };

  const iniciar = () => {
    setComecou(true);
    setFase(0);
    setTerminou(false);
    setNarradoInicio(false);
    setNarradoFim(false);
  };

  const proximoJogo = () => {
    if (fase < jogos.length - 1) {
      setFase(fase + 1);
      setAcertou(false);
      setImagemSelecionada(null);
    } else {
      setTerminou(true);
    }
  };

  const resetar = () => {
    setComecou(false);
    setFase(0);
    setAcertou(false);
    setTerminou(false);
    setNome('');
    setNarradoInicio(false);
    setNarradoFim(false);
  };

  const renderizarJogo = () => {
    const clique = (correto, id) => {
      setImagemSelecionada(id);
      if (correto) {
        setAcertou(true);
        narrar('Muito bem!');
      } else {
        setAcertou(false);
        narrar('Tente novamente.');
      }
    };

    switch (fase) {
      case 0:
        return (
          <>
            <h3>Qual dessas imagens mostra alguém feliz?</h3>
            <div className="card-container">
              <img src="/assets/happy.png" alt="Feliz" className={`card-img ${imagemSelecionada === 'feliz' ? 'selecionada' : ''}`} onClick={() => clique(true, 'feliz')} />
              <img src="/assets/sad.png" alt="Triste" className={`card-img ${imagemSelecionada === 'triste' ? 'selecionada' : ''}`} onClick={() => clique(false, 'triste')} />
              <img src="/assets/angry.png" alt="Bravo" className={`card-img ${imagemSelecionada === 'bravo' ? 'selecionada' : ''}`} onClick={() => clique(false, 'bravo')} />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3>Ouça o som e clique na emoção certa</h3>
            <audio src="/assets/laugh.mp3" controls autoPlay />
            <div className="card-container">
              <img src="/assets/laugh.png" alt="Risada" className={`card-img ${imagemSelecionada === 'risada' ? 'selecionada' : ''}`} onClick={() => clique(true, 'risada')} />
              <img src="/assets/cry.png" alt="Choro" className={`card-img ${imagemSelecionada === 'choro' ? 'selecionada' : ''}`} onClick={() => clique(false, 'choro')} />
              <img src="/assets/anger.png" alt="Raiva" className={`card-img ${imagemSelecionada === 'raiva' ? 'selecionada' : ''}`} onClick={() => clique(false, 'raiva')} />
            </div>
          </>
        );
      case 2:
        return <JogoQuebraCabeca onCompleto={() => {
          setAcertou(true);
          narrar('Muito bem! Você montou a emoção feliz!');
        }} />;
      case 3:
        return (
          <>
            <h3>Qual é a emoção desta situação?</h3>
            <p>“A criança caiu e perdeu o sorvete.”</p>
            <div className="card-container">
              <img src="/assets/sad.png" alt="Triste" className={`card-img ${imagemSelecionada === 'triste' ? 'selecionada' : ''}`} onClick={() => clique(true, 'triste')} />
              <img src="/assets/happy.png" alt="Feliz" className={`card-img ${imagemSelecionada === 'feliz' ? 'selecionada' : ''}`} onClick={() => clique(false, 'feliz')} />
              <img src="/assets/angry.png" alt="Bravo" className={`card-img ${imagemSelecionada === 'bravo' ? 'selecionada' : ''}`} onClick={() => clique(false, 'bravo')} />
            </div>
          </>
        );
      case 4:
        return <JogoConexao avatar={avatar} onAcertouTudo={() => setAcertou(true)} narrar={narrar} />;
      case 5:
        return <JogoMemoria onAcertoFinal={() => setAcertou(true)} />;
      default:
        return null;
    }
  };

  if (terminou) {
    return (
      <div className="app parabens">
        <h1>🎉 Parabéns, {nome}! 🎉</h1>
        <p>Você completou todos os jogos!</p>
        <img src="/assets/happy.png" alt="Feliz" className="avatar-final" />
        <button onClick={resetar}>Reiniciar Jogo</button>
        <div className="confete"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {!comecou ? (
        <div className="menu">
          <h1 className="main-title">🌈 Mundo das Emoções 🌟</h1>
          <div className="avatar-select">
            <label>
              <input type="radio" value="menino" checked={avatar === 'menino'} onChange={() => setAvatar('menino')} />
              <img src="/assets/menino.png" alt="Menino" className="avatar" />
            </label>
            <label>
              <input type="radio" value="menina" checked={avatar === 'menina'} onChange={() => setAvatar('menina')} />
              <img src="/assets/menina.png" alt="Menina" className="avatar" />
            </label>
          </div>
          <input type="text" placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <button onClick={iniciar} disabled={!nome}>Começar</button>
        </div>
      ) : (
        <div className="jogo">
          <div className="info-jogador">
            <img src={avatar === 'menina' ? '/assets/menina.png' : '/assets/menino.png'} alt={avatar} className="avatar-display" />
            <span className="nome-display">{nome}</span>
          </div>
          <div className="progresso">Fase {fase + 1} de {jogos.length}</div>
          <h2>{jogos[fase]}</h2>
          <div className="avatar-nome-display"></div>
          {renderizarJogo()}
          <button onClick={proximoJogo} disabled={!acertou} className="botao-proximo">Próximo</button>
        </div>
      )}
    </div>
  );
}

export default App;
