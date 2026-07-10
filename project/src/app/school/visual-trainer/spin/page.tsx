'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SpinTrainerPage() {
  const positions = ["BTN", "SB", "BB"];
  
  const seatCoords = [
    { left: "50%", top: "66%" }, // Bottom center
    { left: "15%", top: "40%" }, // Left
    { left: "85%", top: "40%" }, // Right
  ];

  const playerNames = [
    "Jugador 1", "Jugador 2", "Jugador 3"
  ];

  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
  const suits = ["♠", "♥", "♦", "♣"];

  const rankValue: Record<string, number> = {
    "A": 14, "K": 13, "Q": 12, "J": 11, "T": 10,
    "9": 9, "8": 8, "7": 7, "6": 6, "5": 5,
    "4": 4, "3": 3, "2": 2
  };

  const scenarios = [
    {
      level: 0,
      title: "Todos foldearon hasta vos",
      text: "La acción llega limpia. Decidí si tu mano es buena para abrir la mano.",
      label: "Open Raise",
      pot: "1.5 BB"
    },
    {
      level: 1,
      title: "Un jugador hizo limp antes de vos",
      text: "Hay un limp en la mesa. Podés aislar subiendo, pagar con manos especulativas o foldear.",
      label: "Limp previo",
      pot: "2.5 BB"
    },
    {
      level: 2,
      title: "Un rival abrió a 2.5 BB",
      text: "Hay un open raise antes de tu turno. Elegí entre foldear, pagar o hacer 3-bet.",
      label: "Open previo",
      pot: "4 BB"
    },
    {
      level: 2.5,
      title: "Open raise + call antes de vos",
      text: "Un rival abrió y otro pagó. Necesitás una mano sólida para entrar al bote.",
      label: "Raise + Call",
      pot: "6.5 BB"
    },
    {
      level: 3,
      title: "Recibiste una 3-bet",
      text: "Abriste la mano y un rival te resubió. Decidí si defender, foldear o empujar.",
      label: "Frente a 3-Bet",
      pot: "9 BB"
    }
  ];

  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [currentHand, setCurrentHand] = useState<any>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("pokerTrainerStats");
    if (saved) {
      setStats(JSON.parse(saved));
    }
    newSituation();
  }, []);

  function randomItem(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function buildDeck() {
    const deck: any[] = [];
    ranks.forEach(rank => {
      suits.forEach(suit => {
        deck.push({ rank, suit });
      });
    });
    return deck;
  }

  function drawTwoCards() {
    const deck = buildDeck();
    const firstIndex = Math.floor(Math.random() * deck.length);
    const first = deck.splice(firstIndex, 1)[0];
    const secondIndex = Math.floor(Math.random() * deck.length);
    const second = deck.splice(secondIndex, 1)[0];
    return [first, second];
  }

  function normalizeHand(cards: any[]) {
    const [a, b] = cards;
    const valueA = rankValue[a.rank];
    const valueB = rankValue[b.rank];

    let high = a;
    let low = b;

    if (valueB > valueA) {
      high = b;
      low = a;
    }

    if (high.rank === low.rank) {
      return high.rank + low.rank;
    }

    const suited = high.suit === low.suit ? "s" : "o";
    return high.rank + low.rank + suited;
  }

  function handData(cards: any[]) {
    const code = normalizeHand(cards);
    const r1 = code[0];
    const r2 = code[1];

    return {
      code,
      high: rankValue[r1],
      low: rankValue[r2],
      isPair: r1 === r2,
      isSuited: code.endsWith("s"),
      isOffsuit: code.endsWith("o"),
      gap: Math.abs(rankValue[r1] - rankValue[r2])
    };
  }

  function handScore(hand: any) {
    if (hand.isPair) {
      return 48 + hand.high * 3;
    }

    let score = hand.high * 3.4 + hand.low * 1.65;

    if (hand.isSuited) score += 5;
    if (hand.gap === 1) score += 4;
    if (hand.gap === 2) score += 2;
    if (hand.high >= 10 && hand.low >= 10) score += 4;
    if (hand.high === 14) score += 2;

    return Math.round(score);
  }

  function positionThreshold(position: string) {
    const thresholds: any = {
      "BTN": 40,
      "SB": 45,
      "BB": 50
    };

    return thresholds[position] || 45;
  }

  function isPremium(hand: any) {
    return ["AA", "KK", "QQ", "JJ", "AKs", "AKo"].includes(hand.code);
  }

  function isVeryStrong(hand: any) {
    return isPremium(hand) || ["TT", "AQs", "AQo", "AJs", "KQs"].includes(hand.code);
  }

  function isPlayableCall(hand: any, score: number, stack: number) {
    if (hand.isPair && stack >= 25) return true;
    if (score >= 62 && stack >= 25) return true;
    if (hand.isSuited && hand.gap <= 2 && hand.high >= 9 && stack >= 35) return true;
    return false;
  }

  function getAdvice(position: string, hand: any, scenario: any, stack: number) {
    const score = handScore(hand);
    const openThreshold = positionThreshold(position);

    if (scenario.level === 0) {
      if (stack <= 12 && score >= openThreshold - 5) {
        return { action: "allin", title: "Buen push preflop", reason: `Con ${stack} BB, ${hand.code} tiene suficiente fuerza para empujar desde ${position}.` };
      }
      if (score >= openThreshold) {
        return { action: "raise", title: "Buen open raise", reason: `${hand.code} entra dentro de un rango razonable de apertura desde ${position}.` };
      }
      return { action: "fold", title: "Fold correcto", reason: `${hand.code} es demasiado débil para abrir desde ${position} en un Spin de 3 jugadores.` };
    }

    if (scenario.level === 1) {
      if (score >= openThreshold - 6) {
        return { action: "raise", title: "Buen raise de aislamiento", reason: `Frente a un limp, ${hand.code} puede aislar y tomar la iniciativa.` };
      }
      if (isPlayableCall(hand, score, stack)) {
        return { action: "call", title: "Call aceptable", reason: `${hand.code} puede pagar por valor especulativo, especialmente con posición y stack profundo.` };
      }
      return { action: "fold", title: "Fold recomendado", reason: `${hand.code} no tiene suficiente valor para entrar frente a un limp.` };
    }

    if (scenario.level === 2) {
      if (isPremium(hand) || score >= 77) {
        return { action: "raise", title: "Buen 3-bet", reason: `${hand.code} es suficientemente fuerte para presionar contra un open raise.` };
      }
      if (isPlayableCall(hand, score, stack)) {
        return { action: "call", title: "Defensa razonable", reason: `${hand.code} puede defender pagando si el stack permite jugar postflop.` };
      }
      return { action: "fold", title: "Fold recomendado", reason: `Contra un open raise, ${hand.code} suele estar dominada o jugar mal postflop.` };
    }

    if (scenario.level === 2.5) {
      if (isPremium(hand) || score >= 80) {
        return { action: "raise", title: "Buen squeeze", reason: `${hand.code} tiene fuerza para resubir contra open raise + call.` };
      }
      if (score >= 66 && stack >= 35) {
        return { action: "call", title: "Call controlado", reason: `${hand.code} puede pagar si hay profundidad, pero no conviene exagerar el bote.` };
      }
      return { action: "fold", title: "Fold disciplinado", reason: `Con acción fuerte previa, ${hand.code} no tiene suficiente equity para continuar.` };
    }

    if (scenario.level === 3) {
      if (["AA", "KK", "QQ", "AKs"].includes(hand.code)) {
        return { action: "allin", title: "All-In correcto", reason: `${hand.code} es parte del rango fuerte para responder agresivamente a una 3-bet.` };
      }
      if (isVeryStrong(hand) && stack >= 40) {
        return { action: "call", title: "Call razonable", reason: `${hand.code} puede defender contra una 3-bet si el stack efectivo permite jugar postflop.` };
      }
      return { action: "fold", title: "Fold recomendado", reason: `Frente a una 3-bet, ${hand.code} no tiene suficiente fuerza para continuar rentable.` };
    }

    return { action: "fold", title: "Fold por defecto", reason: "La situación no fue reconocida." };
  }

  function newSituation() {
    setAnswered(false);
    setFeedback(null);

    const heroIndexInBase = Math.floor(Math.random() * positions.length);
    const heroPosition = positions[heroIndexInBase];
    const rotatedPositions = [...positions.slice(heroIndexInBase), ...positions.slice(0, heroIndexInBase)];

    // Active villain is randomly chosen among the other seats (1 to positions.length - 1)
    let activeVillainIndex = Math.floor(Math.random() * (positions.length - 1)) + 1;

    const cards = drawTwoCards();
    const hand = handData(cards);
    const scenario = randomItem(scenarios);
    const stack = randomItem([10, 12, 18, 25, 35, 40, 55, 75, 100]);
    const advice = getAdvice(heroPosition, hand, scenario, stack);

    setCurrentHand({
      heroPosition,
      heroIndex: 0,
      activeVillainIndex,
      rotatedPositions,
      cards,
      hand,
      scenario,
      stack,
      advice
    });
  }

  function handleAction(action: string) {
    if (answered || !currentHand) return;
    setAnswered(true);

    const advice = currentHand.advice;
    const isCorrect = action === advice.action;

    const newStats = { ...stats };
    newStats.total += 1;

    if (isCorrect) {
      newStats.correct += 1;
      newStats.streak += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
    } else {
      newStats.streak = 0;
    }

    setStats(newStats);
    localStorage.setItem("pokerTrainerStats", JSON.stringify(newStats));

    setFeedback({
      isCorrect,
      title: isCorrect ? "✅ Decisión correcta" : "❌ Mejor decisión: " + labelAction(advice.action),
      textReason: advice.reason,
      adviceTitle: advice.title,
      userAction: labelAction(action),
      recommendedAction: labelAction(advice.action)
    });
  }

  function labelAction(action: string) {
    const labels: Record<string, string> = { fold: "Fold", call: "Call", raise: "Raise / 3-Bet", allin: "All-In" };
    return labels[action] || action;
  }

  function resetStats() {
    const s = { total: 0, correct: 0, streak: 0, bestStreak: 0 };
    setStats(s);
    localStorage.setItem("pokerTrainerStats", JSON.stringify(s));
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  if (!isClient || !currentHand) return <div className="min-h-[80vh] w-full flex items-center justify-center">Cargando...</div>;

  return (
    <div className="custom-spin-trainer">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-spin-trainer {
          --bg: #070707;
          --panel: #111111;
          --gold: #d4af37;
          --gold-2: #f5d77b;
          --green: #0f4f35;
          --muted: #b5b5b5;
          --line: rgba(212, 175, 55, 0.28);
          --shadow: 0 25px 80px rgba(0,0,0,0.65);
          min-height: calc(100vh - 64px);
          font-family: Arial, Helvetica, sans-serif;
          background: radial-gradient(circle at top, rgba(212, 175, 55, 0.12), transparent 35%), linear-gradient(135deg, #030303, #101010 55%, #050505);
          color: #f4f4f4;
          padding: 24px;
        }
        .custom-spin-trainer * { box-sizing: border-box; margin: 0; padding: 0; }
        .spin-app { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 0.8fr; gap: 24px; align-items: stretch; }
        .spin-header { grid-column: 1 / -1; background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255,255,255,0.03)); border: 1px solid var(--line); border-radius: 24px; padding: 24px; box-shadow: var(--shadow); position: relative; overflow: hidden; }
        .spin-header::after { content: ""; position: absolute; right: -120px; top: -120px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,175,55,0.22), transparent 70%); pointer-events: none; }
        .spin-eyebrow { color: var(--gold-2); font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700; }
        .spin-header h1 { font-size: clamp(28px, 4vw, 52px); line-height: 1; margin-bottom: 12px; color: #fff; font-weight: bold; }
        .spin-header p { color: var(--muted); max-width: 820px; font-size: 17px; line-height: 1.5; }
        .table-card, .side-card { background: rgba(17, 17, 17, 0.92); border: 1px solid var(--line); border-radius: 28px; box-shadow: var(--shadow); overflow: hidden; }
        .table-card { padding: 22px; min-height: 720px; position: relative; }
        .top-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }
        .info-box { background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 14px; }
        .info-box span { display: block; color: var(--muted); font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .info-box strong { font-size: 18px; color: #fff; font-weight: bold; }
        .poker-area { position: relative; min-height: 560px; border-radius: 32px; background: radial-gradient(circle at center, rgba(245,215,123,0.12), transparent 45%), linear-gradient(135deg, #0a0a0a, #111); overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
        .poker-table { position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%); width: 74%; height: 58%; border-radius: 50%; background: radial-gradient(circle at center, #18724a 0%, var(--green) 55%, #063a26 100%); border: 18px solid #3a210c; box-shadow: inset 0 0 50px rgba(255,255,255,0.08), inset 0 0 80px rgba(0,0,0,0.55), 0 40px 100px rgba(0,0,0,0.75); }
        .poker-table::before { content: ""; position: absolute; inset: 16px; border-radius: 50%; border: 2px solid rgba(212,175,55,0.38); }
        .table-logo { position: absolute; left: 50%; top: 43%; transform: translate(-50%, -50%); text-align: center; z-index: 3; pointer-events: none; }
        .table-logo .main { font-size: clamp(22px, 3vw, 38px); font-weight: 900; color: rgba(255,255,255,0.9); letter-spacing: 2px; text-shadow: 0 4px 14px rgba(0,0,0,0.55); }
        .table-logo .sub { margin-top: 6px; color: var(--gold-2); font-size: 13px; letter-spacing: 3px; text-transform: uppercase; }
        .pot-box { position: absolute; left: 50%; top: 62%; transform: translateX(-50%); background: rgba(0,0,0,0.48); border: 1px solid rgba(212,175,55,0.35); border-radius: 999px; padding: 10px 18px; z-index: 4; color: #fff; font-weight: 800; backdrop-filter: blur(8px); }
        .seat { position: absolute; width: 118px; min-height: 84px; transform: translate(-50%, -50%); background: rgba(0,0,0,0.72); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 10px; z-index: 5; text-align: center; transition: 0.25s ease; }
        .seat.hero { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(212,175,55,0.18), 0 0 28px rgba(212,175,55,0.4); background: linear-gradient(180deg, rgba(212,175,55,0.18), rgba(0,0,0,0.78)); transform: translate(-50%, -50%) scale(1.06); }
        .seat.villain-active { border-color: rgba(75,139,217,0.7); box-shadow: 0 0 20px rgba(75,139,217,0.25); }
        .avatar { width: 34px; height: 34px; border-radius: 50%; margin: 0 auto 5px; background: radial-gradient(circle at 30% 20%, #fff, transparent 18%), linear-gradient(135deg, #2a2a2a, #050505); border: 1px solid rgba(212,175,55,0.45); display: grid; place-items: center; font-size: 15px; }
        .seat .name { font-size: 12px; color: #fff; font-weight: 800; margin-bottom: 2px; }
        .seat .pos { font-size: 12px; color: var(--gold-2); font-weight: 900; letter-spacing: 1px; }
        .seat .stack { margin-top: 5px; font-size: 12px; color: var(--muted); }
        .dealer-btn { position: absolute; right: 8px; top: 8px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #fff; color: #111; font-size: 11px; font-weight: 900; }
        .hero-hand { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; gap: 12px; z-index: 10; }
        .spin-card { width: 78px; height: 108px; background: linear-gradient(180deg, #ffffff, #e8e8e8); border-radius: 12px; color: #111; box-shadow: 0 15px 35px rgba(0,0,0,0.55); padding: 10px; position: relative; border: 1px solid rgba(0,0,0,0.18); }
        .spin-card.red { color: #bb2020; }
        .spin-card .rank { font-size: 28px; font-weight: 900; line-height: 1; }
        .spin-card .suit { font-size: 28px; position: absolute; right: 10px; bottom: 8px; }
        .side-card { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
        .panel-title { font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 10px; }
        .scenario-box { background: linear-gradient(180deg, rgba(212,175,55,0.12), rgba(255,255,255,0.03)); border: 1px solid var(--line); border-radius: 22px; padding: 18px; }
        .scenario-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.48); border: 1px solid rgba(212,175,55,0.35); color: var(--gold-2); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .scenario-box h2 { font-size: 24px; margin-bottom: 8px; font-weight: bold; }
        .scenario-box p { color: var(--muted); line-height: 1.45; font-size: 15px; }
        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .spin-btn { border: none; cursor: pointer; font-family: inherit; transition: 0.2s ease; }
        .action-btn { min-height: 58px; border-radius: 18px; font-weight: 900; font-size: 15px; color: #fff; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 26px rgba(0,0,0,0.28); }
        .action-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .fold { background: linear-gradient(135deg, #3a3a3a, #151515); }
        .call { background: linear-gradient(135deg, #1d5e8f, #102f49); }
        .raise { background: linear-gradient(135deg, #c99722, #7c570e); }
        .allin { background: linear-gradient(135deg, #c03a3a, #6b1515); }
        .feedback { border-radius: 22px; padding: 18px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.04); }
        .feedback.correct { border-color: rgba(61, 220, 132, 0.5); background: rgba(61, 220, 132, 0.09); }
        .feedback.wrong { border-color: rgba(217, 75, 75, 0.6); background: rgba(217, 75, 75, 0.10); }
        .feedback h3 { margin-bottom: 8px; font-size: 19px; font-weight: bold; }
        .feedback p { color: var(--muted); line-height: 1.45; font-size: 15px; }
        .next-btn, .reset-btn { width: 100%; min-height: 54px; border-radius: 18px; font-weight: 900; font-size: 15px; }
        .next-btn { color: #111; background: linear-gradient(135deg, var(--gold-2), var(--gold)); }
        .reset-btn { color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .stat { background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 15px; }
        .stat span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .stat strong { color: #fff; font-size: 24px; font-weight: bold;}
        .range-note { color: var(--muted); font-size: 13px; line-height: 1.45; padding: 14px; border-radius: 18px; border: 1px dashed rgba(212,175,55,0.35); background: rgba(212,175,55,0.06); }
        @media (max-width: 1100px) { .spin-app { grid-template-columns: 1fr; } .table-card { min-height: 680px; } }
        @media (max-width: 760px) {
          .custom-spin-trainer { padding: 12px; margin-top: 0; }
          .top-info { grid-template-columns: 1fr 1fr; }
          .poker-area { min-height: 620px; }
          .poker-table { width: 92%; height: 48%; }
          .seat { width: 96px; min-height: 76px; padding: 8px; }
          .spin-card { width: 64px; height: 92px; }
          .actions, .stats { grid-template-columns: 1fr; }
        }
      `}} />
      
      <main className="spin-app">
        <header className="spin-header">
          <div className="spin-eyebrow">El Nido Poker · Herramienta de entrenamiento</div>
          <h1>Poker Trainer Visual Spin (3-Max)</h1>
          <p>
            Entrena tus decisiones preflop en un formato de Spin (3 jugadores).
            Recibe situaciones aleatorias, elige tu acción y mejora con feedback instantáneo,
            rachas y estadísticas de acierto.
          </p>
        </header>

        <section className="table-card">
          <div className="top-info">
            <div className="info-box">
              <span>Tu posición</span>
              <strong>{currentHand.heroPosition}</strong>
            </div>
            <div className="info-box">
              <span>Stack efectivo</span>
              <strong>{currentHand.stack} BB</strong>
            </div>
            <div className="info-box">
              <span>Situación</span>
              <strong>{currentHand.scenario.label}</strong>
            </div>
            <div className="info-box">
              <span>Mano</span>
              <strong>{currentHand.hand.code}</strong>
            </div>
          </div>

          <div className="poker-area">
            <div className="poker-table">
              <div className="table-logo">
                <div className="main">POKER TRAINER</div>
                <div className="sub">Preflop Lab Spin</div>
              </div>
              <div className="pot-box">Bote: {currentHand.scenario.pot}</div>
            </div>

            <div id="seats">
              {currentHand.rotatedPositions.map((pos: string, index: number) => {
                const isHero = index === 0;
                const isActive = index === currentHand.activeVillainIndex;
                let classes = "seat";
                if (isHero) classes += " hero";
                if (isActive) classes += " villain-active";

                return (
                  <div key={index} className={classes} style={{ left: seatCoords[index].left, top: seatCoords[index].top }}>
                    <div className="avatar">{isHero ? "★" : "♟"}</div>
                    <div className="name">{isHero ? "HERO" : playerNames[index]}</div>
                    <div className="pos">{pos}</div>
                    <div className="stack">{isHero ? currentHand.stack : randomItem([18, 24, 32, 40, 55, 70, 100])} BB</div>
                    {pos === "BTN" && <div className="dealer-btn">D</div>}
                  </div>
                );
              })}
            </div>

            <div className="hero-hand">
              {currentHand.cards.map((card: any, idx: number) => {
                const isRed = card.suit === "♥" || card.suit === "♦";
                return (
                  <div key={idx} className={`spin-card ${isRed ? 'red' : ''}`}>
                    <div className="rank">{card.rank}</div>
                    <div className="suit">{card.suit}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <aside className="side-card">
          <section className="scenario-box">
            <div className="scenario-tag">Decisión preflop</div>
            <h2>{currentHand.scenario.title}</h2>
            <p>{currentHand.scenario.text}</p>
          </section>

          <section>
            <div className="panel-title">Elegí tu acción</div>
            <div className="actions">
              <button className="spin-btn action-btn fold" onClick={() => handleAction('fold')}>Fold</button>
              <button className="spin-btn action-btn call" onClick={() => handleAction('call')}>Call</button>
              <button className="spin-btn action-btn raise" onClick={() => handleAction('raise')}>Raise / 3-Bet</button>
              <button className="spin-btn action-btn allin" onClick={() => handleAction('allin')}>All-In</button>
            </div>
          </section>

          {feedback && (
            <section className={`feedback ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
              <h3>{feedback.title}</h3>
              <p>
                <strong>{feedback.adviceTitle}</strong><br/>
                {feedback.textReason}<br/><br/>
                Tu acción: <strong>{feedback.userAction}</strong> · Recomendado: <strong>{feedback.recommendedAction}</strong>
              </p>
            </section>
          )}

          <button className="spin-btn next-btn" onClick={newSituation}>Nueva situación</button>

          <section>
            <div className="panel-title">Estadísticas</div>
            <div className="stats">
              <div className="stat">
                <span>Jugadas</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="stat">
                <span>Acierto</span>
                <strong>{accuracy}%</strong>
              </div>
              <div className="stat">
                <span>Racha</span>
                <strong>{stats.streak}</strong>
              </div>
              <div className="stat">
                <span>Mejor racha</span>
                <strong>{stats.bestStreak}</strong>
              </div>
            </div>
          </section>

          <button className="spin-btn reset-btn" onClick={resetStats}>Reiniciar estadísticas</button>

          <div className="range-note">
            Nota: este trainer usa rangos preflop simplificados para práctica rápida.
            Sirve para entrenar lectura de posición, fuerza de mano y presión previa.
          </div>
        </aside>
      </main>
    </div>
  );
}
