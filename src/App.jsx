import React, { useState, useEffect } from 'react';
import './App.css';
import JogoMemoria from './JogoMemoria';
import JogoQuebraCabeca from './JogoQuebraCabeca';
import JogoConexao from './JogoConexao';
import Jogo1 from './Jogo1';
import Jogo2 from './Jogo2';
import Jogo4 from './Jogo4';

const SOM_DE_FUNDO = '/assets/fundo.mp3';

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
  if (comecou) {
    const audio = new Audio(SOM_DE_FUNDO);
    audio.loop = true;
    audio.volume = 0.01;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }
}, [comecou]);

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
    <Jogo1
      onCompleto={() => setAcertou(true)}
      narrar={narrar}
    />
  );
      
  case 1:
    return <Jogo2 onCompleto={() => setAcertou(true)} narrar={narrar} />;
  
  case 2:
  return <JogoQuebraCabeca onCompleto={() => setAcertou(true)} narrar={narrar} />;
  
  case 3:
  return <Jogo4 onCompleto={() => setAcertou(true)} narrar={narrar} />;
      
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
        <button onClick={resetar}>Reiniciar Jogo ​🔄​</button>
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
          <button onClick={proximoJogo} disabled={!acertou} className="botao-proximo">
  {fase < jogos.length - 1 ? 'Próximo Jogo ​👏​​' : 'Terminar Jogos ​🥳​'}
</button>
        </div>
      )}
      <div className="copyright">
  <img src="/assets/icon.png" alt="Logo" className="copyright-icon" />
  <span className="copyright-text">
    © {new Date().getFullYear()} Esc. Joana Honório — Dev.{' '}
    <a href="https://www.instagram.com/joatan_henrique/" target="_blank" rel="noopener noreferrer">
      Joatan Henrique
    </a>
  </span>
</div>

    </div>
  );
}

export default App;
