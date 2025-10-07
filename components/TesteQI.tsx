'use client';

import { useEffect, useMemo, useState } from 'react';
import { Brain, Clock, Lock, CreditCard, Trophy, ArrowRight, ArrowLeft, X, Check, Download } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const BRAND_ORANGE = '#ff6a00';
const BRAND_NAME = 'Instant IQ';

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="black" />
      <path d="M20 28c0-6 5-10 12-10s12 4 12 10-5 10-12 10-12-4-12-10z" fill={BRAND_ORANGE} />
      <path d="M44 34 h10 v2 h-5 v5 h-5z" fill={BRAND_ORANGE} />
    </svg>
  );
}

type Lang = 'pt' | 'en';
const UI = {
  pt: {
    start: 'Iniciar Teste Gratuito',
    testTitle: 'Teste de QI',
    questionOf: (i: number, total: number) => `Pergunta ${i} de ${total}`,
    prev: 'Anterior',
    next: 'Próxima',
    finish: 'Finalizar',
    doneHeader: 'Teste concluído!',
    payCta: 'Pagar e ver resultado',
    priceBlurb: 'Pagamento único para veres o teu QI',
    introBlurb: 'Responde ao teste. Só no fim verás o valor.',
    wrongTitle: 'Análise das respostas incorrectas',
    yourAnswer: 'A tua resposta',
    correctAnswer: 'Resposta correcta',
    notAnswered: 'Não respondeste',
    explanation: 'Explicação',
    retake: 'Fazer novo teste',
    print: 'Imprimir certificado',
    downloadPdf: 'Descarregar PDF',
    resultTitle: 'O Teu Resultado',
    resultSubtitle: 'Análise do teu desempenho no teste de QI',
    currencyLabel: 'Moeda',
  },
  en: {
    start: 'Start Free Test',
    testTitle: 'IQ Test',
    questionOf: (i: number, total: number) => `Question ${i} of ${total}`,
    prev: 'Previous',
    next: 'Next',
    finish: 'Finish',
    doneHeader: 'Test completed!',
    payCta: 'Pay & view result',
    priceBlurb: 'One-time payment to see your IQ',
    introBlurb: 'Answer the test. Currency only appear at the end.',
    wrongTitle: 'Analysis of incorrect answers',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    notAnswered: 'Not answered',
    explanation: 'Explanation',
    retake: 'Take test again',
    print: 'Print certificate',
    downloadPdf: 'Download PDF',
    resultTitle: 'Your Result',
    resultSubtitle: 'Performance analysis for your IQ test',
    currencyLabel: 'Currency',
  },
} as const;

type Q = { id: number; question: string; options: string[]; correct: number; explanation: string };
type Answer = number | null; // null = avançou sem responder

// --- Perguntas PT (32) ---
const QUESTIONS_PT: Q[] = [
  {id:1,question:"Que número vem a seguir na sequência: 2, 4, 8, 16, ?",options:["24","32","30","28"],correct:1,explanation:"Progressão geométrica ×2. 16 × 2 = 32."},
  {id:2,question:"Se CASA é para MORAR, então CARRO é para:",options:["Conduzir","Viajar","Transportar","Acelerar"],correct:2,explanation:"Função/propósito: casa→morar; carro→transportar."},
  {id:3,question:"Que figura completa a sequência? ○ ● ○ ● ?",options:["○","●","◐","◑"],correct:0,explanation:"Alterna vazio/cheio; próximo: ○."},
  {id:4,question:"Numa família, João é irmão de Maria. Maria é mãe de Pedro. Qual é a relação de João com Pedro?",options:["Pai","Tio","Avô","Primo"],correct:1,explanation:"João é tio de Pedro."},
  {id:5,question:"Que número não pertence ao grupo: 3, 5, 7, 9, 11?",options:["3","5","9","11"],correct:2,explanation:"9 não é primo (3²)."},
  {id:6,question:"Se todos os gatos são animais e alguns animais são selvagens, então:",options:["Todos os gatos são selvagens","Alguns gatos podem ser selvagens","Nenhum gato é selvagem","Impossível determinar"],correct:1,explanation:"Possível que alguns gatos sejam selvagens."},
  {id:7,question:"Que palavra não pertence ao grupo: Azul, Verde, Amarelo, Quadrado?",options:["Azul","Verde","Amarelo","Quadrado"],correct:3,explanation:"Quadrado é forma, as outras são cores."},
  {id:8,question:"Complete a analogia: Livro está para Ler assim como Música está para:",options:["Cantar","Ouvir","Tocar","Dançar"],correct:1,explanation:"Ação principal: livro→ler; música→ouvir."},
  {id:9,question:"Que número vem a seguir: 1, 1, 2, 3, 5, 8, ?",options:["11","13","15","16"],correct:1,explanation:"Fibonacci: 5+8=13."},
  {id:10,question:"Se A=1, B=2, C=3... qual é o valor de CASA?",options:["20","22","24","26"],correct:2,explanation:"C=3,A=1,S=19,A=1 → 24."},
  {id:11,question:"Que forma geométrica tem 3 lados?",options:["Quadrado","Triângulo","Pentágono","Círculo"],correct:1,explanation:"Triângulo tem 3 lados."},
  {id:12,question:"Numa corrida, ultrapassaste o segundo classificado. Em que posição estás?",options:["Primeiro","Segundo","Terceiro","Quarto"],correct:1,explanation:"Ficas em segundo."},
  {id:13,question:"Qual é o próximo número na sequência: 100, 50, 25, 12.5, ?",options:["6.25","6","5","7.5"],correct:0,explanation:"÷2: 12.5÷2=6.25."},
  {id:14,question:"Se AMOR é 1234, como seria ROMA?",options:["4321","3241","4231","3421"],correct:0,explanation:"Reverso das letras."},
  {id:15,question:"Quantos meses têm 28 dias?",options:["1","2","11","12"],correct:3,explanation:"Todos têm ≥28 dias."},
  {id:16,question:"Qual é o oposto de 'sempre'?",options:["Às vezes","Raramente","Nunca","Frequentemente"],correct:2,explanation:"Oposto: nunca."},
  {id:17,question:"Se 5 máquinas fazem 5 produtos em 5 minutos, quantas máquinas fazem 100 produtos em 100 minutos?",options:["5","20","25","100"],correct:0,explanation:"Cada máquina 1 prod/5min → em 100min faz 20; 5 máquinas fazem 100."},
  {id:18,question:"Que número multiplicado por si mesmo resulta em 64?",options:["6","7","8","9"],correct:2,explanation:"8×8=64."},
  {id:19,question:"Fogo está para Quente assim como Gelo está para:",options:["Água","Frio","Sólido","Branco"],correct:1,explanation:"Gelo→frio."},
  {id:20,question:"Num grupo de 10 pessoas, quantos apertos de mão diferentes são possíveis?",options:["45","50","55","100"],correct:0,explanation:"C(10,2)=45."},
  {id:21,question:"Que letra vem a seguir: A, C, F, J, ?",options:["M","N","O","P"],correct:2,explanation:"+2,+3,+4,+5 → O."},
  {id:22,question:"Se hoje é terça-feira, que dia será daqui a 100 dias?",options:["Segunda","Terça","Quarta","Quinta"],correct:3,explanation:"100≡2 (mod 7). Terça+2=Quinta."},
  {id:23,question:"Qual é a próxima figura na sequência: △ ▽ △ ▽ ?",options:["△","▽","○","□"],correct:0,explanation:"Alterna; próximo △."},
  {id:24,question:"Se VERDE tem 5 letras e AZUL tem 4, quantas letras tem VERMELHO?",options:["7","8","9","10"],correct:1,explanation:"V-E-R-M-E-L-H-O: 8."},
  {id:25,question:"Que número é diferente: 2, 4, 6, 9, 10?",options:["2","4","9","10"],correct:2,explanation:"9 é ímpar."},
  {id:26,question:"Complete a sequência: 3, 6, 12, 24, ?",options:["36","48","42","30"],correct:1,explanation:"×2 → 48."},
  {id:27,question:"Um comboio a 60 km/h percorre em 30 minutos:",options:["20","25","30","35"],correct:2,explanation:"0,5h × 60 = 30 km."},
  {id:28,question:"Que palavra pode ser formada com as letras: OÃÇRAC?",options:["CORAÇÃO","CAROÇO","CARRO","COROA"],correct:0,explanation:"CORAÇÃO."},
  {id:29,question:"Escala 1–10: se 5 é médio, 8 é:",options:["Baixo","Médio","Alto","Muito Alto"],correct:2,explanation:"Acima da média: Alto."},
  {id:30,question:"15% de 200 =",options:["25","30","35","40"],correct:1,explanation:"0,15×200=30."},
  {id:31,question:"3 GATOS (4 patas) e 2 ARANHAS (8 patas) totalizam:",options:["24","26","28","30"],correct:2,explanation:"12+16=28."},
  {id:32,question:"Próximo número primo após 17?",options:["18","19","20","21"],correct:1,explanation:"19 é primo."},
];

// --- Perguntas EN (32) ---
const QUESTIONS_EN: Q[] = [
  {id:1,question:"What number comes next: 2, 4, 8, 16, ?",options:["24","32","30","28"],correct:1,explanation:"Geometric progression ×2. 16 × 2 = 32."},
  {id:2,question:"If HOUSE is for LIVING, then CAR is for:",options:["Drive","Travel","Transport","Accelerate"],correct:2,explanation:"Main function: house→live; car→transport."},
  {id:3,question:"Which figure completes the sequence? ○ ● ○ ● ?",options:["○","●","◐","◑"],correct:0,explanation:"Alternates empty/filled; next: ○."},
  {id:4,question:"John is Mary's brother. Mary is Peter's mother. John is Peter's:",options:["Father","Uncle","Grandfather","Cousin"],correct:1,explanation:"John is Peter's uncle."},
  {id:5,question:"Which number doesn't belong: 3, 5, 7, 9, 11?",options:["3","5","9","11"],correct:2,explanation:"9 is not prime (3²)."},
  {id:6,question:"If all cats are animals and some animals are wild, then:",options:["All cats are wild","Some cats may be wild","No cat is wild","Impossible to determine"],correct:1,explanation:"It's possible some cats are wild."},
  {id:7,question:"Which word doesn't belong: Blue, Green, Yellow, Square?",options:["Blue","Green","Yellow","Square"],correct:3,explanation:"Square is a shape; the others are colors."},
  {id:8,question:"Complete the analogy: Book is to Read as Music is to:",options:["Sing","Listen","Play","Dance"],correct:1,explanation:"Primary action: book→read; music→listen."},
  {id:9,question:"What number comes next: 1, 1, 2, 3, 5, 8, ?",options:["11","13","15","16"],correct:1,explanation:"Fibonacci: 5+8=13."},
  {id:10,question:"If A=1, B=2, C=3... what is the value of HOME?",options:["20","24","35","41"],correct:3,explanation:"H=8,O=15,M=13,E=5 → 41."},
  {id:11,question:"Which shape has 3 sides?",options:["Square","Triangle","Pentagon","Circle"],correct:1,explanation:"Triangle has 3 sides."},
  {id:12,question:"In a race, you overtake the second place. What position are you in?",options:["First","Second","Third","Fourth"],correct:1,explanation:"You are now second."},
  {id:13,question:"Next in the sequence: 100, 50, 25, 12.5, ?",options:["6.25","6","5","7.5"],correct:0,explanation:"Divide by 2 each step."},
  {id:14,question:"If LOVE is 1234, what is EVOL?",options:["4321","3241","4231","3421"],correct:0,explanation:"Reverse letters."},
  {id:15,question:"How many months have 28 days?",options:["1","2","11","12"],correct:3,explanation:"All months have at least 28 days."},
  {id:16,question:"What is the opposite of 'always'?",options:["Sometimes","Rarely","Never","Frequently"],correct:2,explanation:"Opposite: never."},
  {id:17,question:"If 5 machines make 5 items in 5 minutes, how many machines make 100 items in 100 minutes?",options:["5","20","25","100"],correct:0,explanation:"Each machine 1 item/5min; in 100min it makes 20; 5 machines → 100."},
  {id:18,question:"Which number squared equals 64?",options:["6","7","8","9"],correct:2,explanation:"8×8=64."},
  {id:19,question:"Fire is to Hot as Ice is to:",options:["Water","Cold","Solid","White"],correct:1,explanation:"Ice→cold."},
  {id:20,question:"In a group of 10 people, how many different handshakes are possible?",options:["45","50","55","100"],correct:0,explanation:"C(10,2)=45."},
  {id:21,question:"What letter comes next: A, C, F, J, ?",options:["M","N","O","P"],correct:2,explanation:"+2,+3,+4,+5 → O."},
  {id:22,question:"If today is Tuesday, what day will it be in 100 days?",options:["Monday","Tuesday","Wednesday","Thursday"],correct:3,explanation:"100≡2 (mod 7). Tuesday+2=Thursday."},
  {id:23,question:"Next figure in the sequence: △ ▽ △ ▽ ?",options:["△","▽","○","□"],correct:0,explanation:"Alternates; next △."},
  {id:24,question:"If GREEN has 5 letters and BLUE has 4, how many letters does YELLOW have?",options:["6","7","8","9"],correct:0,explanation:"Y-E-L-L-O-W = 6."},
  {id:25,question:"Which number is different: 2, 4, 6, 9, 10?",options:["2","4","9","10"],correct:2,explanation:"9 is odd."},
  {id:26,question:"Complete the sequence: 3, 6, 12, 24, ?",options:["36","48","42","30"],correct:1,explanation:"×2 → 48."},
  {id:27,question:"A train at 60 km/h travels in 30 minutes:",options:["20","25","30","35"],correct:2,explanation:"0.5h × 60 = 30 km."},
  {id:28,question:"Which word can be formed with the letters: H E A R T?",options:["HEART","HERAT","HERTA","RHEAT"],correct:0,explanation:"HEART is the correct English word."},
  {id:29,question:"On a 1–10 scale: if 5 is medium, 8 is:",options:["Low","Medium","High","Very High"],correct:2,explanation:"Above average: High."},
  {id:30,question:"15% of 200 =",options:["25","30","35","40"],correct:1,explanation:"0.15×200=30."},
  {id:31,question:"3 CATS (4 legs) and 2 SPIDERS (8 legs) total:",options:["24","26","28","30"],correct:2,explanation:"12+16=28."},
  {id:32,question:"Next prime number after 17?",options:["18","19","20","21"],correct:1,explanation:"19 is prime."},
];

function Header({
  lang,
  setLang,
  rightSlot,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
      }}
    >
      {/* logo numa linha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
        <LogoMark className="w-7 h-7" />
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.2 }}>
          Instant <span style={{ color: BRAND_ORANGE }}>IQ</span>
        </div>
      </div>

      {/* idiomas simples */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              background: '#0b0b0b',
              color: '#fff',
              border: '1px solid #2a2a2a',
              borderRadius: 999,
              /* como já não há ícone à esquerda, menos padding */
              padding: '8px 36px 8px 12px',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 170,
            }}
          >
            <option value="pt">Português (PT)</option>
            <option value="en">English (EN)</option>
          </select>

          {/* caret (setinha) à direita – opcional, podes remover se quiseres */}
          <span
            aria-hidden
            style={{ position: 'absolute', right: 12, top: 10, opacity: 0.8 }}
          >
            ▾
          </span>
        </div>

        {rightSlot}
      </div>
    </div>
  );
}


export default function TesteQI() {
  // Stripe.js
  const stripePromise = useMemo(
    () => (typeof window !== 'undefined' ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '') : Promise.resolve(null)),
    []
  );

  // base URL
  const getBase = () => {
    const env = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
    if (env) { try { new URL(env); return env.replace(/\/$/, ''); } catch {} }
    if (typeof window !== 'undefined') return window.location.origin.replace(/\/$/, '');
    return 'http://localhost:3000';
  };

  const [lang, setLang] = useState<Lang>('pt');
  const t = (k: keyof typeof UI['pt'], ...args: any[]) => {
    const dict = UI[lang] as any; const v = dict[k];
    return typeof v === 'function' ? v(...args) : v;
  };

  const questions = useMemo(() => (lang === 'pt' ? QUESTIONS_PT : QUESTIONS_EN), [lang]);

  // estado
  const [answers, setAnswers] = useState<Answer[]>(Array(32).fill(null));
  const [step, setStep] = useState<'intro' | 'test' | 'payment' | 'result'>('intro');
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [paid, setPaid] = useState(false);
  const [iq, setIQ] = useState(0);
  const [wrong, setWrong] = useState<Array<{ q: number; chosen: Answer; correct: number }>>([]);
  const [currency, setCurrency] = useState<'eur' | 'usd'>('eur');

  const amounts = { eur: 99, usd: 99 };
  const format = (value: number, cur: 'eur' | 'usd') =>
    new Intl.NumberFormat(cur === 'eur' ? 'pt-PT' : 'en-US', { style: 'currency', currency: cur.toUpperCase() }).format(value / 100);

  // ===== Persistência mínima: só para atravessar o checkout =====
  const LS_KEY = 'instantIQ_state';
  const [restored, setRestored] = useState(false);

  // Ao montar: se estamos a voltar da Stripe (success=1), restaura; senão limpa para começar NOVO teste.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const returning = p.get('success') === '1'; // só quero restaurar neste caso
    if (returning) {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.lang === 'pt' || s.lang === 'en') setLang(s.lang);
          if (Array.isArray(s.answers)) {
            const norm: Answer[] = Array(32).fill(null);
            s.answers.forEach((v: any, i: number) => {
              if (typeof v === 'number') norm[i] = v;
              else if (typeof v === 'string' && /^\d+$/.test(v)) norm[i] = Number(v);
              else norm[i] = null;
            });
            setAnswers(norm);
          }
        }
      } catch {}
    } else {
      // começa SEMPRE novo teste
      localStorage.removeItem(LS_KEY);
      setAnswers(Array(32).fill(null));
      setStep('intro');
      setIdx(0);
      setTimeLeft(30 * 60);
      setPaid(false);
      setIQ(0);
      setWrong([]);
    }
    setRestored(true);
  }, []);

  // timer
  useEffect(() => {
    if (step !== 'test' || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) { setStep('payment'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step, timeLeft]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const onPick = (opt: number) => { const next = [...answers] as Answer[]; next[idx] = opt; setAnswers(next); };
  const next = () => { if (idx < questions.length - 1) setIdx(idx + 1); else setStep('payment'); };
  const prev = () => idx > 0 && setIdx(idx - 1);

  const calcIQ = () => {
    let ok = 0;
    const wr: Array<{ q: number; chosen: Answer; correct: number }> = [];
    for (let i = 0; i < questions.length; i++) {
      const a = answers[i]; const q = questions[i];
      if (a !== null && a === q.correct) ok++;
      else wr.push({ q: i, chosen: a, correct: q.correct });
    }
    setWrong(wr);
    const pct = (ok / questions.length) * 100;
    let v = 100;
    if (pct >= 95) v = 140; else if (pct >= 90) v = 130; else if (pct >= 85) v = 125;
    else if (pct >= 80) v = 120; else if (pct >= 75) v = 115; else if (pct >= 65) v = 110;
    else if (pct >= 55) v = 105; else if (pct >= 45) v = 100; else if (pct >= 35) v = 95;
    else if (pct >= 25) v = 90; else if (pct >= 15) v = 85; else v = 80;
    setIQ(v);
  };

  // verificar Stripe (depois de restaurado)
  useEffect(() => {
    if (typeof window === 'undefined' || !restored) return;
    const p = new URLSearchParams(window.location.search);
    const success = p.get('success') === '1';
    const sid = p.get('session_id');
    if (!success || !sid) return;

    (async () => {
      const base = getBase();
      try {
        const res = await fetch(`${base}/api/verify-session?session_id=${encodeURIComponent(sid)}`);
        const data = await res.json();
        if (res.ok && data.paid) { setPaid(true); setStep('result'); }
      } catch (e) {
        console.error('Erro a verificar sessão:', e);
        alert('Não consegui verificar o pagamento.');
      }
    })();
  }, [restored]);

  // Quando pago, calcula e limpa o localStorage (para o próximo teste ser novo).
  useEffect(() => {
    if (paid) {
      calcIQ();
      if (typeof window !== 'undefined') localStorage.removeItem(LS_KEY);
    }
  }, [paid]); // eslint-disable-line

  const pay = async () => {
    const stripe = await stripePromise;
    if (!stripe) return alert('Stripe não inicializado.');
    // guarda SÓ agora para atravessar o checkout
    if (typeof window !== 'undefined') localStorage.setItem(LS_KEY, JSON.stringify({ answers, lang }));

    const base = getBase();
    try {
      const res = await fetch(`${base}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, metadata: { product: 'Instant IQ – Full Result' } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro a criar sessão.');
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Falha a ligar ao endpoint.');
    }
  };

  // ==== UI ====

  if (step === 'intro') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#000,#171717)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
          <Header lang={lang} setLang={setLang} />


          <div style={{ textAlign:'center', marginBottom: 40 }}>
            <div style={{ width:80, height:80, margin:'0 auto', borderRadius:'50%', background:'#111', boxShadow:`0 0 0 2px ${BRAND_ORANGE} inset`, display:'grid', placeItems:'center' }}>
              <Brain className="w-10 h-10" />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginTop: 24 }}>{t('testTitle')}</h1>
            <p style={{ color:'#bbb', marginTop: 12, maxWidth: 640, marginInline:'auto' }}>{t('introBlurb')}</p>
          </div>

          <div style={{ background:'#111', border:'1px solid #222', borderRadius:16, padding:32, textAlign:'center', maxWidth:420, margin:'0 auto' }}>
            <button onClick={()=>setStep('test')}
              style={{ marginTop:8, background:BRAND_ORANGE, color:'#fff', fontWeight:700, padding:'16px 24px', borderRadius:16, fontSize:18, border:'none', cursor:'pointer' }}>
              {t('start')} <ArrowRight className="inline w-6 h-6" />
            </button>
            <div style={{ color:'#888', fontSize:12, marginTop:12 }}>
              {lang==='pt' ? '' : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }

if (step === 'test') {
  const q = questions[idx];
  const progress = ((idx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#000,#171717)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <Header
          lang={lang}
          setLang={setLang}
          rightSlot={
            <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>
              <Clock className="w-5 h-5" style={{ color: BRAND_ORANGE, marginRight: 8 }} />
              <span style={{ color: BRAND_ORANGE }}>{fmt(timeLeft)}</span>
            </div>
          }
        />

        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('testTitle')}</h2>
        <div style={{ color: '#aaa', fontSize: 14, marginBottom: 12 }}>
          {t('questionOf', idx + 1, questions.length)}
        </div>
        <div style={{ width: '100%', height: 8, background: '#333', borderRadius: 999, marginBottom: 24 }}>
          <div style={{ height: 8, width: `${progress}%`, background: BRAND_ORANGE, borderRadius: 999 }} />
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{q.question}</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onPick(i)}
                style={{
                  textAlign: 'left',
                  padding: 16,
                  borderRadius: 12,
                  border: '2px solid',
                  borderColor: answers[idx] === i ? BRAND_ORANGE : 'rgba(255,255,255,0.25)',
                  background: answers[idx] === i ? 'rgba(255,106,0,0.1)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: answers[idx] === i ? BRAND_ORANGE : 'rgba(255,255,255,0.4)',
                      background: answers[idx] === i ? BRAND_ORANGE : 'transparent',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {answers[idx] === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 18 }}>{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => idx > 0 && setIdx(idx - 1)}
            disabled={idx === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: BRAND_ORANGE,
              color: '#fff',
              borderRadius: 12,
              border: 'none',
              opacity: idx === 0 ? 0.5 : 1,
              cursor: idx === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <ArrowLeft className="w-5 h-5" style={{ marginRight: 8 }} /> {UI[lang].prev}
          </button>

          <button
            onClick={() => {
              if (idx < questions.length - 1) setIdx(idx + 1);
              else setStep('payment');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: BRAND_ORANGE,
              color: '#fff',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {idx === questions.length - 1 ? UI[lang].finish : UI[lang].next}
            <ArrowRight className="w-5 h-5" style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

if (step === 'payment') {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg,#000,#171717)', display: 'grid', placeItems: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: 460, padding: 16 }}>
        <Header lang={lang} setLang={setLang} />

        <div
          style={{
            background: '#111',
            border: '1px solid #222',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              background: '#111',
              borderRadius: '50%',
              boxShadow: `0 0 0 2px ${BRAND_ORANGE} inset`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Lock className="w-8 h-8" />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{UI[lang].doneHeader}</h2>
          <p style={{ color: '#bbb', marginBottom: 16 }}>
            {lang === 'pt'
              ? `Respondeste a todas as ${questions.length} perguntas. Para veres o resultado detalhado e a tua pontuação de QI, escolhe a moeda e paga.`
              : `You've answered all ${questions.length} questions. Choose currency and pay to see your detailed IQ.`}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <label style={{ fontWeight: 600 }}>{UI[lang].currencyLabel}:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'eur' | 'usd')}
              style={{ background: '#000', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '4px 8px' }}
            >
              <option value="eur">EUR (€)</option>
              <option value="usd">USD ($)</option>
            </select>
          </div>

          <div
            style={{
              background: '#1b1b1b',
              border: '1px solid #222',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: BRAND_ORANGE }}>
              {format(amounts[currency], currency)}
            </div>
            <p style={{ color: '#bbb', fontSize: 12 }}>{UI[lang].priceBlurb}</p>
          </div>

          <button
            onClick={pay}
            style={{
              width: '100%',
              background: BRAND_ORANGE,
              color: '#fff',
              fontWeight: 700,
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 8,
            }}
          >
            <CreditCard className="w-5 h-5" style={{ marginRight: 8, verticalAlign: 'middle' }} /> {UI[lang].payCta}
          </button>

          <p style={{ color: '#777', fontSize: 12 }}>
            Stripe Checkout • {lang === 'pt' ? 'Métodos disponíveis dependem da tua conta' : 'Available methods depend on your Stripe account'}
          </p>
        </div>
      </div>
    </div>
  );
}

  if (step === 'result' && paid) {
    const qs = lang === 'pt' ? QUESTIONS_PT : QUESTIONS_EN;
    const correct = answers.filter((a, i) => a !== null && a === qs[i].correct).length;
    const pct = Math.round((correct / qs.length) * 100);
    const cat = (score: number) => {
      if (score >= 130) return { label: lang==='pt' ? 'Sobredotado' : 'Gifted', desc: '~2% ' + (lang==='pt'?'da população':'of population') };
      if (score >= 120) return { label: lang==='pt' ? 'Superior' : 'Superior', desc: '~8–10% ' + (lang==='pt'?'da população':'of population') };
      if (score >= 110) return { label: lang==='pt' ? 'Acima da média' : 'Above average', desc: '~15–25% ' + (lang==='pt'?'da população':'of population') };
      if (score >= 90)  return { label: lang==='pt' ? 'Média' : 'Average', desc: '~50% ' + (lang==='pt'?'da população':'of population') };
      if (score >= 80)  return { label: lang==='pt' ? 'Abaixo da média' : 'Below average', desc: '~15–25% ' + (lang==='pt'?'da população':'of population') };
      return { label: lang==='pt' ? 'Baixo' : 'Low', desc: '~2–10% ' + (lang==='pt'?'da população':'of population') };
    };
    const cinfo = cat(iq);

    const downloadPdf = async () => {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      const target = document.getElementById('resultado-pdf') as HTMLElement;
      if (!target) return;
      const canvas = await html2canvas(target, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('instant-iq-certificado.pdf');
    };

    // Só lista as ERRADAS
    const wrong = qs
      .map((q, i) => ({ qIndex: i, q, chosen: answers[i] }))
      .filter(({ chosen, q }) => !(chosen !== null && chosen === q.correct));

    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#000,#171717)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ textAlign:'center', marginBottom: 24 }}>
            <div style={{ width:80, height:80, margin:'0 auto 16px', background:'#111', borderRadius:'50%', boxShadow:`0 0 0 2px ${BRAND_ORANGE} inset`, display:'grid', placeItems:'center' }}>
              <Trophy className="w-10 h-10" />
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{UI[lang].resultTitle}</h1>
            <p style={{ color:'#bbb' }}>{UI[lang].resultSubtitle}</p>
          </div>

          <div id="resultado-pdf" style={{ background:'#111', border:'1px solid #222', borderRadius:16, padding:24, marginBottom:24, textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'#000', boxShadow:`0 0 0 2px ${BRAND_ORANGE} inset`, display:'grid', placeItems:'center' }}>
                  <LogoMark className="w-8 h-8" />
                </div>
                <div>
                  <div style={{ fontSize:12, letterSpacing:1, color:BRAND_ORANGE, textTransform:'uppercase' }}>{BRAND_NAME}</div>
                  <div style={{ fontSize:12, color:'#bbb' }}>{lang==='pt' ? 'Certificado de Resultado – Teste de QI' : 'Result Certificate – IQ Test'}</div>
                </div>
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:'#000', background:BRAND_ORANGE, padding:'4px 8px', borderRadius:999 }}>
                {lang==='pt' ? 'OFICIAL' : 'OFFICIAL'}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize:56, fontWeight:800, color:BRAND_ORANGE }}>{iq}</div>
              <div style={{ fontSize:20, fontWeight:700, marginBottom: 4 }}>{lang==='pt' ? 'O teu QI' : 'Your IQ'}</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom: 4 }}>
                {cinfo.label}
              </div>
              <div style={{ color:'#bbb' }}>{cinfo.desc}</div>
            </div>

            <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,minmax(0,1fr))', textAlign:'left' }}>
              <div style={{ background:'#1b1b1b', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:22, fontWeight:800, color:BRAND_ORANGE }}>{correct}</div>
                <div style={{ color:'#bbb', fontSize:12 }}>{lang==='pt' ? 'Respostas correctas' : 'Correct answers'}</div>
              </div>
              <div style={{ background:'#1b1b1b', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:22, fontWeight:800, color:BRAND_ORANGE }}>{pct}%</div>
                <div style={{ color:'#bbb', fontSize:12 }}>{lang==='pt' ? 'Taxa de acerto' : 'Accuracy'}</div>
              </div>
              <div style={{ background:'#1b1b1b', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:22, fontWeight:800, color:BRAND_ORANGE }}>{32 - correct}</div>
                <div style={{ color:'#bbb', fontSize:12 }}>{lang==='pt' ? 'Respostas incorrectas' : 'Incorrect answers'}</div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom: 20 }}>
            <button onClick={downloadPdf}
              style={{ background:'#16a34a', color:'#fff', fontWeight:700, padding:'12px 20px', borderRadius:12, border:'none', cursor:'pointer' }}>
              <Download className="w-5 h-5" style={{ verticalAlign:'middle', marginRight:8 }} />
              {UI[lang].downloadPdf}
            </button>
            <button onClick={() => {
              if (typeof window !== 'undefined') localStorage.removeItem(LS_KEY);
              setStep('intro'); setIdx(0); setAnswers(Array(32).fill(null)); setTimeLeft(30*60); setPaid(false); setIQ(0); setWrong([]);
            }}
              style={{ background:BRAND_ORANGE, color:'#000', fontWeight:700, padding:'12px 20px', borderRadius:12, border:'none', cursor:'pointer' }}>
              {UI[lang].retake}
            </button>
            <button onClick={()=>window.print()}
              style={{ background:'#222', color:'#fff', fontWeight:700, padding:'12px 20px', borderRadius:12, border:'1px solid #333', cursor:'pointer' }}>
              {UI[lang].print}
            </button>
          </div>

          {wrong.length>0 && (
            <div style={{ background:'#111', border:'1px solid #222', borderRadius:16, padding:24, marginBottom:24 }}>
              <h3 style={{ fontSize:20, fontWeight:800, marginBottom: 12, display:'flex', alignItems:'center', gap:8 }}>
                <X className="w-6 h-6" style={{ color:'#ef4444' }} /> {UI[lang].wrongTitle}
              </h3>
              <div style={{ display:'grid', gap:16 }}>
                {wrong.map(({ qIndex, q, chosen },i) => {
                  const answered = chosen !== null && chosen !== undefined;
                  return (
                    <div key={i} style={{ borderLeft:'4px solid #ef4444', paddingLeft:12 }}>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight:700 }}>{lang==='pt' ? 'Pergunta' : 'Question'} {qIndex+1}:</span>
                        <p style={{ color:'#ddd', marginTop:4 }}>{q.question}</p>
                      </div>
                      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(2,minmax(0,1fr))', fontSize:14 }}>
                        <div style={{ background:'rgba(239,68,68,0.15)', padding:12, borderRadius:8 }}>
                          <div style={{ display:'flex', alignItems:'center', marginBottom:4 }}>
                            <X className="w-4 h-4" style={{ color:'#ef4444', marginRight:6 }} />
                            <span style={{ fontWeight:700 }}>{UI[lang].yourAnswer}:</span>
                          </div>
                          <p style={{ color:'#fca5a5' }}>
                            {answered ? q.options[chosen as number] : UI[lang].notAnswered}
                          </p>
                        </div>
                        <div style={{ background:'rgba(34,197,94,0.15)', padding:12, borderRadius:8 }}>
                          <div style={{ display:'flex', alignItems:'center', marginBottom:4 }}>
                            <Check className="w-4 h-4" style={{ color:'#22c55e', marginRight:6 }} />
                            <span style={{ fontWeight:700 }}>{UI[lang].correctAnswer}:</span>
                          </div>
                          <p style={{ color:'#86efac' }}>{q.options[q.correct]}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, background:'rgba(59,130,246,0.15)', padding:12, borderRadius:8 }}>
                        <div style={{ fontWeight:700, marginBottom:4 }}>{UI[lang].explanation}:</div>
                        <p style={{ color:'#bfdbfe', fontSize:14 }}>{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
