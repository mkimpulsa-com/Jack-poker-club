'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Download, Trash2, TrendingUp, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const STORAGE_KEY = "recreationalPokerSessions";
const BANKROLL_KEY = "recreationalPokerInitialBankroll";

type Session = {
  id: string;
  date: string;
  mode: string;
  place: string;
  level: string;
  buyin: number;
  cashout: number;
  hours: number;
  volume: number;
  focus: number;
  tilt: string;
  bestDecision: string;
  mainMistake: string;
  nextGoal: string;
  profit: number;
  roi: number;
  hourly: number;
  createdAt: string;
};

function money(value: number) {
  return "$" + (Number(value) || 0).toFixed(2);
}

function percent(value: number) {
  return (Number(value) || 0).toFixed(1) + "%";
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [initialBankroll, setInitialBankroll] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('Cash');
  const [place, setPlace] = useState('');
  const [level, setLevel] = useState('');
  const [buyin, setBuyin] = useState('');
  const [cashout, setCashout] = useState('');
  const [hours, setHours] = useState('');
  const [volume, setVolume] = useState('');
  const [focus, setFocus] = useState('7');
  const [tilt, setTilt] = useState('No');
  const [bestDecision, setBestDecision] = useState('');
  const [mainMistake, setMainMistake] = useState('');
  const [nextGoal, setNextGoal] = useState('');
  
  const [bankrollInput, setBankrollInput] = useState('');
  const [chartFilter, setChartFilter] = useState('Historico');

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedSessions = localStorage.getItem(STORAGE_KEY);
      if (storedSessions) {
        try {
          setSessions(JSON.parse(storedSessions));
        } catch (e) {
          console.error(e);
        }
      }
      
      const storedBankroll = localStorage.getItem(BANKROLL_KEY);
      if (storedBankroll) {
        setInitialBankroll(Number(storedBankroll));
        setBankrollInput(storedBankroll);
      }

      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, []);

  const saveSessions = (newSessions: Session[]) => {
    setSessions(newSessions);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    }
  };

  const handleSaveBankroll = () => {
    const val = Number(bankrollInput) || 0;
    setInitialBankroll(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BANKROLL_KEY, String(val));
    }
  };

  const calculatePreview = () => {
    const b = Number(buyin) || 0;
    const c = Number(cashout) || 0;
    const h = Number(hours) || 0;

    const profit = c - b;
    const roi = b > 0 ? (profit / b) * 100 : 0;
    const hourly = h > 0 ? profit / h : 0;

    return { profit, roi, hourly };
  };

  const preview = calculatePreview();

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { profit, roi, hourly } = calculatePreview();

    const newSession: Session = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date,
      mode,
      place: place.trim(),
      level: level.trim(),
      buyin: Number(buyin) || 0,
      cashout: Number(cashout) || 0,
      hours: Number(hours) || 0,
      volume: Number(volume) || 0,
      focus: Number(focus) || 0,
      tilt,
      bestDecision: bestDecision.trim(),
      mainMistake: mainMistake.trim(),
      nextGoal: nextGoal.trim(),
      profit,
      roi,
      hourly,
      createdAt: new Date().toISOString()
    };

    saveSessions([...sessions, newSession]);

    // Reset some form fields
    setBuyin('');
    setCashout('');
    setHours('');
    setVolume('');
    setBestDecision('');
    setMainMistake('');
    setNextGoal('');
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleDelete = (id: string) => {
    saveSessions(sessions.filter(s => s.id !== id));
  };

  const handleClearAll = () => {
    if (confirm("¿Seguro que querés borrar todas las sesiones? Esta acción no se puede deshacer.")) {
      saveSessions([]);
    }
  };

  const handleExportCSV = () => {
    if (sessions.length === 0) {
      alert("No hay sesiones para exportar.");
      return;
    }

    const headers = [
      "Fecha", "Modalidad", "Lugar", "Nivel", "Buy-in", "Cobro", "Resultado", 
      "Horas", "ROI", "Ganancia por hora", "Volumen", "Foco", "Tilt", 
      "Mejor decision", "Error principal", "Objetivo proxima sesion"
    ];

    const rows = sessions.map(s => [
      s.date, s.mode, s.place, s.level, s.buyin, s.cashout, s.profit,
      s.hours, s.roi.toFixed(2), s.hourly.toFixed(2), s.volume, s.focus, s.tilt,
      s.bestDecision, s.mainMistake, s.nextGoal
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sesiones-poker.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalBuyin = sessions.reduce((sum, s) => sum + s.buyin, 0);
    const totalCashout = sessions.reduce((sum, s) => sum + s.cashout, 0);
    const totalProfit = sessions.reduce((sum, s) => sum + s.profit, 0);
    const totalHours = sessions.reduce((sum, s) => sum + s.hours, 0);
    const winningSessions = sessions.filter(s => s.profit > 0).length;
    const focusTotal = sessions.reduce((sum, s) => sum + s.focus, 0);

    const roi = totalBuyin > 0 ? (totalProfit / totalBuyin) * 100 : 0;
    const hourly = totalHours > 0 ? totalProfit / totalHours : 0;
    const winRate = totalSessions > 0 ? (winningSessions / totalSessions) * 100 : 0;
    const avgFocus = totalSessions > 0 ? focusTotal / totalSessions : 0;
    const currentBankroll = initialBankroll + totalProfit;

    return { totalSessions, totalProfit, totalHours, roi, hourly, winRate, avgFocus, currentBankroll };
  }, [sessions, initialBankroll]);

  const recentSessions = useMemo(() => {
    return [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-8);
  }, [sessions]);
  
  const maxAbsProfit = useMemo(() => {
      return Math.max(...recentSessions.map(s => Math.abs(s.profit)), 1);
  }, [recentSessions]);

  const sortedSessions = useMemo(() => {
      return [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);

  const chartData = useMemo(() => {
    let filtered = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (filtered.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (chartFilter === '7 Dias') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filtered = filtered.filter(s => new Date(s.date) >= sevenDaysAgo);
    } else if (chartFilter === 'Mes') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      filtered = filtered.filter(s => new Date(s.date) >= startOfMonth);
    } else if (chartFilter === 'Año') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      filtered = filtered.filter(s => new Date(s.date) >= startOfYear);
    }

    let currentBankroll = initialBankroll;
    return filtered.map(session => {
      currentBankroll += session.profit;
      return {
        date: formatDate(session.date),
        profit: session.profit,
        bankroll: currentBankroll
      };
    });
  }, [sessions, chartFilter, initialBankroll]);

  if (!isClient) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center"><p>Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-[#f5f5f5] p-4 md:p-8 font-sans">
      <div className="max-w-[1450px] mx-auto space-y-6">
        
        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-white/5 p-8 shadow-2xl">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-primary font-black tracking-widest text-xs uppercase mb-3">
                El Nido Poker · Control de progreso
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight leading-none">
                Creador de Sesiones
              </h1>
              <p className="text-neutral-600 dark:text-[#b8b8b8] text-lg max-w-3xl leading-relaxed">
                Una herramienta simple para jugadores que quieren empezar a tomar el poker más en serio: 
                registrá tus sesiones, controlá tu bankroll, revisá tus errores y medí tu progreso con números claros.
              </p>
            </div>
            
            <Link href="/school">
              <Button className="rounded-full shadow-lg hover:shadow-xl transition-all" size="lg">
                <GraduationCap className="mr-2 h-5 w-5" />
                Ir a la Escuela
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
          
          {/* Left Column - Form */}
          <aside className="rounded-[26px] border border-primary/20 bg-white/50 dark:bg-[#111111]/95 backdrop-blur-sm p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-black mb-2">Nueva sesión</h2>
            <p className="text-neutral-600 dark:text-[#b8b8b8] text-sm mb-6 leading-relaxed">
              Cargá los datos principales después de jugar. La idea no es llenar mil datos, 
              sino crear el hábito de revisar resultados, tiempo, estado mental y errores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end mb-6 p-4 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
              <div>
                <Label htmlFor="initialBankroll" className="text-primary font-bold mb-2 block">Bankroll inicial</Label>
                <Input 
                  id="initialBankroll" 
                  type="number" 
                  value={bankrollInput}
                  onChange={(e) => setBankrollInput(e.target.value)}
                  placeholder="Ej: 200" 
                  className="bg-black/30 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <Button onClick={handleSaveBankroll} variant="secondary" className="rounded-xl h-11 border-white/10 bg-white/10 hover:bg-white/20">
                <Save className="w-4 h-4 mr-2" /> Guardar bankroll
              </Button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Fecha</Label>
                  <Input type="date" required value={date} onChange={e => setDate(e.target.value)} className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Modalidad</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="bg-black/30 border-white/10 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="MTT">MTT</SelectItem>
                      <SelectItem value="Spin">Spin</SelectItem>
                      <SelectItem value="Sit & Go">Sit & Go</SelectItem>
                      <SelectItem value="Freeroll">Freeroll</SelectItem>
                      <SelectItem value="Torneo en vivo">Torneo en vivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Lugar / Sala</Label>
                  <Input value={place} onChange={e => setPlace(e.target.value)} placeholder="Ej: KKPoker, GG, Club" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Nivel / Límite</Label>
                  <Input value={level} onChange={e => setLevel(e.target.value)} placeholder="Ej: NL10, $1 Spin, MTT $5" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Inversión / Buy-in</Label>
                  <Input type="number" required min="0" step="0.01" value={buyin} onChange={e => setBuyin(e.target.value)} placeholder="Ej: 20" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Cobro / Saldo final</Label>
                  <Input type="number" required min="0" step="0.01" value={cashout} onChange={e => setCashout(e.target.value)} placeholder="Ej: 35" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Duración en horas</Label>
                  <Input type="number" required min="0.1" step="0.1" value={hours} onChange={e => setHours(e.target.value)} placeholder="Ej: 2.5" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Volumen</Label>
                  <Input type="number" min="0" step="1" value={volume} onChange={e => setVolume(e.target.value)} placeholder="Torneos o mesas jugadas" className="bg-black/30 border-white/10 rounded-xl h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Concentración</Label>
                  <Select value={focus} onValueChange={setFocus}>
                    <SelectTrigger className="bg-black/30 border-white/10 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 - Excelente</SelectItem>
                      <SelectItem value="9">9 - Muy buena</SelectItem>
                      <SelectItem value="8">8 - Buena</SelectItem>
                      <SelectItem value="7">7 - Correcta</SelectItem>
                      <SelectItem value="6">6 - Regular</SelectItem>
                      <SelectItem value="5">5 - Baja</SelectItem>
                      <SelectItem value="4">4 - Mala</SelectItem>
                      <SelectItem value="3">3 - Muy mala</SelectItem>
                      <SelectItem value="2">2 - Sin foco</SelectItem>
                      <SelectItem value="1">1 - No debería haber jugado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-primary font-bold">Tilt</Label>
                  <Select value={tilt} onValueChange={setTilt}>
                    <SelectTrigger className="bg-black/30 border-white/10 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No tuve tilt</SelectItem>
                      <SelectItem value="Leve">Tilt leve</SelectItem>
                      <SelectItem value="Medio">Tilt medio</SelectItem>
                      <SelectItem value="Alto">Tilt alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-primary font-bold">Mejor decisión de la sesión</Label>
                  <Textarea value={bestDecision} onChange={e => setBestDecision(e.target.value)} placeholder="Ej: Foldeé una mano fuerte cuando detecté mucha fuerza del rival." className="bg-black/30 border-white/10 rounded-xl resize-none min-h-[80px]" />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-primary font-bold">Error principal a corregir</Label>
                  <Textarea value={mainMistake} onChange={e => setMainMistake(e.target.value)} placeholder="Ej: Pagué demasiado fuera de posición / jugué cansado." className="bg-black/30 border-white/10 rounded-xl resize-none min-h-[80px]" />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-primary font-bold">Objetivo para la próxima sesión</Label>
                  <Textarea value={nextGoal} onChange={e => setNextGoal(e.target.value)} placeholder="Ej: Jugar máximo 2 horas, evitar calls por curiosidad." className="bg-black/30 border-white/10 rounded-xl resize-none min-h-[80px]" />
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 text-sm text-center md:text-left text-neutral-300 flex flex-col md:flex-row justify-between items-center gap-2">
                <div>Resultado estimado: <strong className={preview.profit > 0 ? "text-green-500" : preview.profit < 0 ? "text-red-500" : "text-primary"}>{money(preview.profit)}</strong></div>
                <div>ROI: <strong className={preview.profit > 0 ? "text-green-500" : preview.profit < 0 ? "text-red-500" : "text-primary"}>{percent(preview.roi)}</strong></div>
                <div>Por hora: <strong className={preview.profit > 0 ? "text-green-500" : preview.profit < 0 ? "text-red-500" : "text-primary"}>{money(preview.hourly)}/h</strong></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <Button type="submit" className="h-12 rounded-xl text-md font-bold">
                  Guardar sesión
                </Button>
                <Button type="button" variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10" onClick={() => {
                  setBuyin(''); setCashout(''); setHours(''); setVolume(''); setBestDecision(''); setMainMistake(''); setNextGoal('');
                }}>
                  Limpiar formulario
                </Button>
              </div>
            </form>
          </aside>

          {/* Right Column - Stats & History */}
          <div className="space-y-6">
            
            <section className="rounded-[26px] border border-primary/20 bg-white/50 dark:bg-[#111111]/95 backdrop-blur-sm p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-black mb-2">Resumen del jugador</h2>
              <p className="text-neutral-600 dark:text-[#b8b8b8] text-sm mb-6 leading-relaxed">
                Estos números te muestran si estás avanzando. No mires solo una sesión: lo importante es ver tendencia, disciplina y volumen.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Bankroll actual", value: money(stats.currentBankroll), color: (stats.currentBankroll - initialBankroll) > 0 ? "text-green-500" : (stats.currentBankroll - initialBankroll) < 0 ? "text-red-500" : "text-white" },
                  { label: "Ganancia total", value: money(stats.totalProfit), color: stats.totalProfit > 0 ? "text-green-500" : stats.totalProfit < 0 ? "text-red-500" : "text-white" },
                  { label: "ROI general", value: percent(stats.roi), color: stats.roi > 0 ? "text-green-500" : stats.roi < 0 ? "text-red-500" : "text-white" },
                  { label: "Ganancia/Hora", value: `${money(stats.hourly)}/h`, color: stats.hourly > 0 ? "text-green-500" : stats.hourly < 0 ? "text-red-500" : "text-white" },
                  { label: "Sesiones", value: stats.totalSessions, color: "text-white" },
                  { label: "Horas jugadas", value: `${stats.totalHours.toFixed(1)}h`, color: "text-white" },
                  { label: "Win Rate", value: percent(stats.winRate), color: "text-white" },
                  { label: "Foco promedio", value: `${stats.avgFocus.toFixed(1)}/10`, color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex flex-col justify-center">
                    <span className="text-[#b8b8b8] text-[11px] uppercase tracking-wider mb-1 font-bold">{stat.label}</span>
                    <strong className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</strong>
                  </div>
                ))}
              </div>

              <div className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Evolución del Bankroll</h3>
                    <p className="text-[#b8b8b8] text-sm">Tu crecimiento a lo largo del tiempo.</p>
                  </div>
                  <Select value={chartFilter} onValueChange={setChartFilter}>
                    <SelectTrigger className="w-[140px] bg-black/30 border-white/10 rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 Dias">Últimos 7 Días</SelectItem>
                      <SelectItem value="Mes">Este Mes</SelectItem>
                      <SelectItem value="Año">Este Año</SelectItem>
                      <SelectItem value="Historico">Histórico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="h-[300px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBankroll" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#d4af37' }}
                        />
                        <Area type="monotone" dataKey="bankroll" name="Bankroll" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorBankroll)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#b8b8b8] border border-dashed border-white/20 rounded-xl">
                      No hay datos en este período.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-primary font-bold mb-2">Qué cargar</h3>
                  <p className="text-[#b8b8b8] text-sm">Cargá buy-in, cobro, horas, modalidad y una nota mental. Con eso ya sabés si ganás o perdés.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-primary font-bold mb-2">Qué mirar</h3>
                  <p className="text-[#b8b8b8] text-sm">No te obsesiones con una sola sesión. Mirá 10 o 20. El poker tiene varianza.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-primary font-bold mb-2">Qué mejorar</h3>
                  <p className="text-[#b8b8b8] text-sm">Si repetís un error, estúdialo: tilt, calls malos, falta de paciencia.</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-1">Últimas 8 sesiones</h2>
                <p className="text-[#b8b8b8] text-sm mb-6">Vista rápida del rendimiento reciente.</p>
                
                <div className="space-y-3">
                  {recentSessions.length === 0 ? (
                    <div className="p-6 text-center text-[#b8b8b8] border border-dashed border-white/20 rounded-xl">Todavía no hay sesiones para mostrar.</div>
                  ) : (
                    recentSessions.map(session => {
                      const width = Math.min((Math.abs(session.profit) / maxAbsProfit) * 100, 100);
                      const isPositive = session.profit >= 0;
                      return (
                        <div key={session.id} className="grid grid-cols-[80px_1fr_80px] gap-3 items-center text-sm">
                          <div className="text-[#b8b8b8]">{formatDate(session.date)}</div>
                          <div className="h-3 rounded-full bg-white/10 overflow-hidden relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${width}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`absolute top-0 bottom-0 left-0 rounded-full ${isPositive ? 'bg-gradient-to-r from-green-500 to-green-300' : 'bg-gradient-to-r from-red-500 to-red-300'}`}
                            />
                          </div>
                          <div className={`text-right font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {money(session.profit)}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-primary/20 bg-white/50 dark:bg-[#111111]/95 backdrop-blur-sm p-6 md:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black mb-1">Historial de sesiones</h2>
                  <p className="text-[#b8b8b8] text-sm">Podés exportarlas a CSV para abrirlas en Excel.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={handleExportCSV} variant="secondary" className="flex-1 sm:flex-none rounded-xl border-white/10 bg-white/10 hover:bg-white/20">
                    <Download className="w-4 h-4 mr-2" /> Exportar
                  </Button>
                  <Button onClick={handleClearAll} variant="destructive" className="flex-1 sm:flex-none rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30">
                    <Trash2 className="w-4 h-4 mr-2" /> Borrar todo
                  </Button>
                </div>
              </div>

              {sortedSessions.length === 0 ? (
                <div className="p-8 text-center text-[#b8b8b8] border border-dashed border-white/20 rounded-2xl bg-white/5">
                  No hay sesiones guardadas todavía. Cargá tu primera sesión para empezar a medir tu progreso.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">Fecha</th>
                        <th className="p-4 font-bold">Modalidad</th>
                        <th className="p-4 font-bold">Lugar</th>
                        <th className="p-4 font-bold">Resultado</th>
                        <th className="p-4 font-bold">Horas</th>
                        <th className="p-4 font-bold">ROI</th>
                        <th className="p-4 font-bold">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedSessions.map(session => (
                        <tr key={session.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-neutral-300">{formatDate(session.date)}</td>
                          <td className="p-4 text-neutral-300">{session.mode}</td>
                          <td className="p-4 text-neutral-300">{session.place || "-"}</td>
                          <td className={`p-4 font-bold ${session.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {money(session.profit)}
                          </td>
                          <td className="p-4 text-neutral-300">{session.hours}h</td>
                          <td className={`p-4 ${session.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {percent(session.roi)}
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(session.id)} className="rounded-lg h-8 px-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30">
                              Borrar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
