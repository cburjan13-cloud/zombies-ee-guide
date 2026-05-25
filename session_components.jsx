// ============================================================
// ZOMBIES EE GUIDE — New Session Components
// These go at the TOP of App.jsx (after imports, before MAPS_CONFIG)
// ============================================================

// ── Supabase client (add after your React import) ────────────
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

// ── Participant color palette ─────────────────────────────────
const PARTICIPANT_COLORS = [
  '#00e5ff', // cyan
  '#69ff47', // green
  '#ffd600', // yellow
  '#ff6d00', // orange
  '#ff4081', // pink
  '#ea80fc', // purple
];

// ── Utility: generate a random 6-char session code ────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/1/0 confusion
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── Utility: format timestamp as "9:43pm" ────────────────────
function formatTime(ts) {
  const d = new Date(ts);
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}${ampm}`;
}

// ============================================================
// SESSION LOBBY — first screen the user sees
// Props: onSession(sessionObj), onSolo()
// ============================================================
function SessionLobby({ onSession, onSolo, mapsConfig }) {
  const [mode, setMode] = useState(null); // null | 'create' | 'join'
  const [sessionName, setSessionName] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('zee_name') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bgStyle = {
    minHeight: '100vh',
    background: '#060810',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Courier New, monospace',
    color: '#e0e0e0',
    padding: '20px',
  };

  const cardStyle = {
    background: '#0c0f1a',
    border: '1px solid #1a2040',
    borderRadius: '4px',
    padding: '32px',
    width: '100%',
    maxWidth: '460px',
  };

  const titleStyle = {
    fontSize: '11px',
    letterSpacing: '3px',
    color: '#4a5580',
    marginBottom: '8px',
    textTransform: 'uppercase',
  };

  const h1Style = {
    fontSize: '24px',
    color: '#00e5ff',
    marginBottom: '32px',
    letterSpacing: '2px',
  };

  const btnStyle = (primary) => ({
    width: '100%',
    padding: '14px',
    background: primary ? '#00e5ff' : 'transparent',
    color: primary ? '#060810' : '#00e5ff',
    border: `1px solid #00e5ff`,
    borderRadius: '2px',
    fontFamily: 'Courier New, monospace',
    fontSize: '13px',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginBottom: '12px',
    fontWeight: primary ? 'bold' : 'normal',
    transition: 'opacity 0.15s',
  });

  const inputStyle = {
    width: '100%',
    background: '#060810',
    border: '1px solid #1a2040',
    borderRadius: '2px',
    color: '#e0e0e0',
    fontFamily: 'Courier New, monospace',
    fontSize: '14px',
    padding: '10px 12px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '2px',
    color: '#4a5580',
    marginBottom: '6px',
    textTransform: 'uppercase',
  };

  async function handleCreate() {
    if (!sessionName.trim()) { setError('Enter a session name.'); return; }
    if (!selectedMap) { setError('Select a map.'); return; }
    if (!userName.trim()) { setError('Enter your name.'); return; }
    setLoading(true);
    setError('');
    try {
      const code = generateCode();
      const color = PARTICIPANT_COLORS[0];
      // Insert session
      const { data: sess, error: sessErr } = await supabase
        .from('sessions')
        .insert({ code, session_name: sessionName.trim(), map_id: selectedMap })
        .select()
        .single();
      if (sessErr) throw sessErr;
      // Insert creator as first participant
      const { error: partErr } = await supabase
        .from('participants')
        .insert({ session_id: sess.id, name: userName.trim(), color });
      if (partErr) throw partErr;
      localStorage.setItem('zee_name', userName.trim());
      onSession({ id: sess.id, code: sess.code, name: sess.session_name, mapId: sess.map_id, myName: userName.trim(), myColor: color });
    } catch (e) {
      setError('Failed to create session. Check your connection.');
    }
    setLoading(false);
  }

  async function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) { setError('Enter a valid 6-character code.'); return; }
    if (!userName.trim()) { setError('Enter your name.'); return; }
    setLoading(true);
    setError('');
    try {
      // Look up session
      const { data: sess, error: sessErr } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .single();
      if (sessErr || !sess) { setError('Session not found. Check the code.'); setLoading(false); return; }
      // Assign a color (pick based on existing participant count)
      const { data: existing } = await supabase
        .from('participants')
        .select('id')
        .eq('session_id', sess.id);
      const colorIdx = (existing?.length || 0) % PARTICIPANT_COLORS.length;
      const color = PARTICIPANT_COLORS[colorIdx];
      // Insert participant
      const { error: partErr } = await supabase
        .from('participants')
        .insert({ session_id: sess.id, name: userName.trim(), color });
      if (partErr) throw partErr;
      localStorage.setItem('zee_name', userName.trim());
      onSession({ id: sess.id, code: sess.code, name: sess.session_name, mapId: sess.map_id, myName: userName.trim(), myColor: color });
    } catch (e) {
      setError('Failed to join session.');
    }
    setLoading(false);
  }

  // ── Main lobby (no mode selected yet) ──
  if (!mode) {
    return (
      <div style={bgStyle}>
        <div style={cardStyle}>
          <div style={titleStyle}>Call of Duty: Black Ops 3</div>
          <div style={h1Style}>ZOMBIES EE GUIDE</div>
          <button style={btnStyle(true)} onClick={() => setMode('create')}>+ CREATE SESSION</button>
          <button style={btnStyle(false)} onClick={() => setMode('join')}>⌗ JOIN SESSION</button>
          <button
            style={{ ...btnStyle(false), color: '#4a5580', borderColor: '#1a2040', marginBottom: 0 }}
            onClick={onSolo}
          >
            SOLO (NO SESSION)
          </button>
        </div>
      </div>
    );
  }

  // ── Create session form ──
  if (mode === 'create') {
    return (
      <div style={bgStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', color: '#4a5580', cursor: 'pointer', fontFamily: 'Courier New', fontSize: '12px', padding: '0 12px 0 0' }}>← BACK</button>
            <span style={{ fontSize: '14px', letterSpacing: '2px', color: '#00e5ff' }}>CREATE SESSION</span>
          </div>
          <label style={labelStyle}>Session Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Friday Night Moon Run"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            maxLength={50}
          />
          <label style={labelStyle}>Map</label>
          <select style={selectStyle} value={selectedMap} onChange={e => setSelectedMap(e.target.value)}>
            <option value="">Select a map…</option>
            {mapsConfig.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <label style={labelStyle}>Your Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Cody"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            maxLength={20}
          />
          {error && <div style={{ color: '#ff4081', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
          <button style={btnStyle(true)} onClick={handleCreate} disabled={loading}>
            {loading ? 'CREATING…' : 'CREATE SESSION →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Join session form ──
  return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', color: '#4a5580', cursor: 'pointer', fontFamily: 'Courier New', fontSize: '12px', padding: '0 12px 0 0' }}>← BACK</button>
          <span style={{ fontSize: '14px', letterSpacing: '2px', color: '#00e5ff' }}>JOIN SESSION</span>
        </div>
        <label style={labelStyle}>Session Code</label>
        <input
          style={{ ...inputStyle, fontSize: '20px', letterSpacing: '6px', textTransform: 'uppercase' }}
          placeholder="ABC123"
          value={joinCode}
          onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          maxLength={6}
        />
        <label style={labelStyle}>Your Name</label>
        <input
          style={inputStyle}
          placeholder="e.g. Cody"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          maxLength={20}
        />
        {error && <div style={{ color: '#ff4081', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
        <button style={btnStyle(true)} onClick={handleJoin} disabled={loading}>
          {loading ? 'JOINING…' : 'JOIN SESSION →'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SESSION HEADER BAR — replaces existing top nav in MapGuide
// Props: session, participants, mapName, mapColor, onBack
// ============================================================
function SessionHeaderBar({ session, participants, mapName, mapColor, onBack }) {
  if (!session || session === 'solo') {
    // Solo mode — show simple back button
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#0c0f1a',
        borderBottom: '1px solid #1a2040',
        fontFamily: 'Courier New, monospace',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#4a5580', cursor: 'pointer', fontFamily: 'Courier New', fontSize: '12px', letterSpacing: '1px' }}>← MAPS</button>
        <span style={{ marginLeft: '20px', color: mapColor || '#00e5ff', fontSize: '14px', letterSpacing: '2px' }}>{mapName}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      background: '#0c0f1a',
      borderBottom: '1px solid #1a2040',
      fontFamily: 'Courier New, monospace',
    }}>
      {/* Left: back button */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#4a5580', cursor: 'pointer', fontFamily: 'Courier New', fontSize: '12px', letterSpacing: '1px', flexShrink: 0 }}>
        ← MAPS
      </button>

      {/* Center: session name + code */}
      <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
        <div style={{ fontSize: '13px', color: '#e0e0e0', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {session.name}
        </div>
        <div style={{ fontSize: '11px', color: '#4a5580', letterSpacing: '3px', marginTop: '2px' }}>
          [{session.code}]
        </div>
      </div>

      {/* Right: participant dots */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center' }}>
        {participants.map((p, i) => (
          <div
            key={p.id || i}
            title={p.name}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: p.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#060810',
              cursor: 'default',
              flexShrink: 0,
            }}
          >
            {p.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// STATUS BAR — sticky below nav, shows progress
// Props: steps[], completions[], mapColor, session
// ============================================================
function StatusBar({ steps, completions, mapColor, session }) {
  if (!session || session === 'solo' || !steps?.length) return null;

  const completedIndices = new Set(completions.map(c => c.step_index));
  const completedCount = completedIndices.size;
  const totalSteps = steps.length;
  const pct = Math.round((completedCount / totalSteps) * 100);

  // Find the first uncompleted step
  const nextIncomplete = steps.findIndex((_, i) => !completedIndices.has(i));
  const currentStep = nextIncomplete === -1 ? steps[totalSteps - 1] : steps[nextIncomplete];
  const nextStep = nextIncomplete >= 0 && nextIncomplete < totalSteps - 1 ? steps[nextIncomplete + 1] : null;
  const currentLabel = typeof currentStep === 'string' ? currentStep : currentStep?.title || currentStep?.name || `Step ${nextIncomplete + 1}`;
  const nextLabel = nextStep ? (typeof nextStep === 'string' ? nextStep : nextStep?.title || nextStep?.name) : null;

  return (
    <div style={{
      background: '#080b14',
      borderBottom: '1px solid #1a2040',
      fontFamily: 'Courier New, monospace',
    }}>
      {/* Progress bar */}
      <div style={{ height: '3px', background: '#1a2040', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${mapColor || '#00e5ff'}, #00e5ff)`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      {/* Text row */}
      <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '11px', color: mapColor || '#00e5ff', letterSpacing: '1px' }}>
          STEP {Math.min(completedCount + 1, totalSteps)} / {totalSteps}
          {currentLabel ? <span style={{ color: '#6a7aa0', marginLeft: '8px' }}>· {currentLabel.length > 40 ? currentLabel.slice(0, 40) + '…' : currentLabel}</span> : null}
        </div>
        <div style={{ fontSize: '10px', color: '#4a5580', letterSpacing: '1px' }}>
          {pct}% Complete
          {nextLabel && nextIncomplete !== -1 ? <span style={{ marginLeft: '8px', color: '#2a3050' }}>· Next: {nextLabel.length > 30 ? nextLabel.slice(0, 30) + '…' : nextLabel}</span> : null}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUPABASE STEP COMPLETIONS HOOK
// Replaces the local `completed` Set in StepsTab
// Usage: const { completions, toggleStep } = useStepCompletions(sessionId, session, myName, myColor)
// ============================================================
function useStepCompletions(sessionId, session, myName, myColor) {
  const [completions, setCompletions] = useState([]);

  // Load initial completions
  useEffect(() => {
    if (!sessionId || session === 'solo') return;
    supabase
      .from('step_completions')
      .select('*')
      .eq('session_id', sessionId)
      .then(({ data }) => { if (data) setCompletions(data); });
  }, [sessionId]);

  // Real-time subscription
  useEffect(() => {
    if (!sessionId || session === 'solo') return;
    const channel = supabase
      .channel('steps-' + sessionId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'step_completions', filter: `session_id=eq.${sessionId}` },
        payload => setCompletions(prev => {
          // Avoid duplicates (same step_index from same person)
          const exists = prev.some(c => c.id === payload.new.id);
          return exists ? prev : [...prev, payload.new];
        })
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'step_completions', filter: `session_id=eq.${sessionId}` },
        payload => setCompletions(prev => prev.filter(c => c.id !== payload.old.id))
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [sessionId]);

  // Toggle a step (insert if not completed by ME, delete MY completion if already done)
  async function toggleStep(stepIndex) {
    if (session === 'solo') {
      // Solo mode — just local toggle (caller handles this)
      return null;
    }
    const myCompletion = completions.find(c => c.step_index === stepIndex && c.completed_by_name === myName);
    if (myCompletion) {
      // Uncheck — delete my completion
      await supabase.from('step_completions').delete().eq('id', myCompletion.id);
      setCompletions(prev => prev.filter(c => c.id !== myCompletion.id));
    } else {
      // Check — insert completion
      const { data } = await supabase
        .from('step_completions')
        .insert({ session_id: sessionId, step_index: stepIndex, completed_by_name: myName, completed_by_color: myColor })
        .select()
        .single();
      if (data) setCompletions(prev => [...prev, data]);
    }
  }

  return { completions, toggleStep };
}

// ============================================================
// PARTICIPANTS HOOK
// Usage: const participants = useParticipants(sessionId, session)
// ============================================================
function useParticipants(sessionId, session) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!sessionId || session === 'solo') return;
    supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('joined_at')
      .then(({ data }) => { if (data) setParticipants(data); });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || session === 'solo') return;
    const channel = supabase
      .channel('participants-' + sessionId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
        payload => setParticipants(prev => {
          const exists = prev.some(p => p.id === payload.new.id);
          return exists ? prev : [...prev, payload.new];
        })
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [sessionId]);

  return participants;
}

// ============================================================
// COMPLETED BY BADGE — shows under a completed step
// Props: completions (array), stepIndex (int), myName (string)
// ============================================================
function CompletedByBadges({ completions, stepIndex, myName }) {
  const forThisStep = completions.filter(c => c.step_index === stepIndex);
  if (!forThisStep.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {forThisStep.map(c => (
        <span
          key={c.id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: c.completed_by_color + '22',
            border: `1px solid ${c.completed_by_color}55`,
            fontSize: '10px',
            color: c.completed_by_name === myName ? c.completed_by_color : '#9090b0',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '0.5px',
          }}
        >
          ✓ {c.completed_by_name === myName ? 'You' : c.completed_by_name} · {formatTime(c.completed_at)}
        </span>
      ))}
    </div>
  );
}

// ============================================================
// WHAT'S NEXT CARD — for Overview tab and Steps tab sidebar
// Props: steps[], completions[], mapColor
// ============================================================
function WhatsNextCard({ steps, completions, mapColor }) {
  if (!steps?.length) return null;
  const completedIndices = new Set(completions.map(c => c.step_index));
  const nextIdx = steps.findIndex((_, i) => !completedIndices.has(i));
  if (nextIdx === -1) {
    // All done!
    return (
      <div style={{
        background: (mapColor || '#00e5ff') + '18',
        border: `1px solid ${mapColor || '#00e5ff'}44`,
        borderRadius: '4px',
        padding: '16px',
        fontFamily: 'Courier New, monospace',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', color: mapColor || '#00e5ff', marginBottom: '4px' }}>STATUS</div>
        <div style={{ fontSize: '14px', color: '#e0e0e0' }}>🎉 Easter Egg Complete!</div>
      </div>
    );
  }
  const currentStep = steps[nextIdx];
  const nextStep = nextIdx < steps.length - 1 ? steps[nextIdx + 1] : null;
  const getLabel = s => typeof s === 'string' ? s : s?.title || s?.name || '';

  return (
    <div style={{
      background: (mapColor || '#00e5ff') + '10',
      border: `1px solid ${mapColor || '#00e5ff'}33`,
      borderRadius: '4px',
      padding: '16px',
      fontFamily: 'Courier New, monospace',
      marginBottom: '20px',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '2px', color: mapColor || '#00e5ff', marginBottom: '6px' }}>
        STEP {nextIdx + 1} OF {steps.length} — CURRENT
      </div>
      <div style={{ fontSize: '14px', color: '#e0e0e0', marginBottom: nextStep ? '10px' : 0 }}>
        {getLabel(currentStep)}
      </div>
      {nextStep && (
        <>
          <div style={{ height: '1px', background: '#1a2040', margin: '10px 0' }} />
          <div style={{ fontSize: '10px', letterSpacing: '1px', color: '#4a5580', marginBottom: '4px' }}>NEXT UP</div>
          <div style={{ fontSize: '12px', color: '#6a7aa0' }}>{getLabel(nextStep)}</div>
        </>
      )}
    </div>
  );
}

// ============================================================
// UPDATED App() ROOT — replace your existing App() with this
// ============================================================
/*
export default function App() {
  const [session, setSession] = useState(null);
  const [activeMap, setActiveMap] = useState(null);

  // If session has a mapId (created with map pre-selected), auto-navigate
  useEffect(() => {
    if (session && session !== 'solo' && session.mapId && !activeMap) {
      setActiveMap(session.mapId);
    }
  }, [session]);

  if (!session) {
    return (
      <SessionLobby
        onSession={s => setSession(s)}
        onSolo={() => setSession('solo')}
        mapsConfig={MAPS_CONFIG}
      />
    );
  }

  const myName = session === 'solo' ? 'Solo' : session.myName;
  const myColor = session === 'solo' ? '#00e5ff' : session.myColor;
  const sessionId = session === 'solo' ? null : session.id;

  if (activeMap) {
    return (
      <MapGuide
        mapId={activeMap}
        onBack={() => setActiveMap(null)}
        session={session}
        sessionId={sessionId}
        myName={myName}
        myColor={myColor}
      />
    );
  }

  return <HomeScreen onSelect={setActiveMap} />;
}
*/
