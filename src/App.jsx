import React, { useEffect, useState } from 'react';
import {
  ArrowDownUp, ArrowRight, Bell, CalendarDays, Check, ChevronDown,
  CircleHelp, Compass, MapPin, Menu, Plus, Search, Settings, Sparkles,
  Users, X,
} from 'lucide-react';

const STORAGE_KEY = 'roam-trips';
const SETTINGS_KEY = 'roam-settings';

const initialTrips = [
  {
    id: 1,
    title: 'A slow summer in Italy',
    place: 'Amalfi Coast, Italy',
    dates: 'Jun 12 – Jun 19, 2025',
    days: '12 days to go',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85',
    people: ['M', 'J', 'S', 'A'],
    status: 'Planning',
    budget: 2400,
    tasks: ['Choose a hotel', 'Vote on a boat trip'],
  },
  {
    id: 2,
    title: 'Long weekend in the city',
    place: 'Copenhagen, Denmark',
    dates: 'Aug 08 – Aug 11, 2025',
    days: '59 days to go',
    image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1000&q=85',
    people: ['M', 'L', 'T'],
    status: 'Just dreaming',
    budget: 1800,
    tasks: [],
  },
];

const suggestions = [
  { title: 'Find your little corner of paradise', place: 'The Cyclades, Greece', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85', tag: 'ISLAND ESCAPE' },
  { title: 'A city made for wandering', place: 'Lisbon, Portugal', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85', tag: 'CITY BREAK' },
  { title: 'Take the scenic route', place: 'Dolomites, Italy', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', tag: 'MOUNTAIN AIR' },
];

function loadJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = loadJSON(STORAGE_KEY, null);
    return Array.isArray(saved) && saved.length ? saved : initialTrips;
  });
  const [active, setActive] = useState('Home');
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [query, setQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [profileName, setProfileName] = useState(() => localStorage.getItem('roam-profile-name') || 'Your name');
  const [settings, setSettings] = useState(() => loadJSON(SETTINGS_KEY, { tripReminders: true, emailUpdates: false }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => setToast(''), 2600);
  };

  const updateTrip = (id, patch) => {
    setTrips((current) => current.map((trip) => trip.id === id ? { ...trip, ...patch } : trip));
    setSelectedTrip((current) => current?.id === id ? { ...current, ...patch } : current);
  };

  const createTrip = (trip) => {
    const created = { ...trip, id: Date.now(), people: [profileName.charAt(0).toUpperCase()], status: 'Planning', tasks: [] };
    setTrips((current) => [created, ...current]);
    setSelectedTrip(created);
    setShowCreate(false);
    setActive('Home');
    notify('Your trip is ready to plan!');
  };

  const copyInvite = async (trip) => {
    const url = new URL(window.location.href);
    url.searchParams.set('trip', String(trip.id));
    try {
      await navigator.clipboard.writeText(url.toString());
      notify('Trip link copied!');
    } catch {
      notify(`Invite code: ROAM-${String(trip.id).slice(-5)}`);
    }
  };

  const filteredTrips = trips.filter((trip) => `${trip.title} ${trip.place}`.toLowerCase().includes(query.toLowerCase()));
  const navItems = [
    { label: 'Home', icon: Compass },
    { label: 'Explore', icon: Search },
    { label: 'Friends', icon: Users },
  ];

  const renderPlaces = (places) => (
    <div className="inspiration-grid">
      {places.map((place) => (
        <button className="inspiration-card" key={place.title} style={{ backgroundImage: `linear-gradient(90deg, rgba(20,26,23,.55), rgba(20,26,23,0)), url(${place.image})` }} onClick={() => notify(`${place.place} saved to your inspiration list!`)}>
          <span className="inspiration-tag">{place.tag}</span>
          <span className="inspiration-title">{place.title}</span>
          <span className="inspiration-place"><MapPin size={14} />{place.place}</span>
          <span className="inspiration-arrow"><ArrowRight size={17} /></span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#home" onClick={() => setActive('Home')}><span className="brand-mark">r</span><span>roam<span className="brand-dot">.</span></span></a>
        <button className="profile-switch" onClick={() => setShowSettings(true)}>
          <span className="profile-avatar">{profileName.charAt(0).toUpperCase()}</span>
          <span className="profile-label"><b>Your space</b><small>Personal workspace</small></span><ChevronDown size={16} />
        </button>
        <div className="side-label">MENU</div>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-link ${active === label ? 'selected' : ''}`} onClick={() => { setActive(label); setMobileMenu(false); }}><Icon size={18} strokeWidth={1.8} />{label}{label === 'Friends' && <span className="nav-count">{trips.length}</span>}</button>)}
        </nav>
        <div className="side-label trips-label">YOUR TRIPS <button aria-label="Create trip" onClick={() => setShowCreate(true)}><Plus size={16} /></button></div>
        <div className="mini-trips">
          {trips.slice(0, 4).map((trip) => <button key={trip.id} className="mini-trip" onClick={() => setSelectedTrip(trip)}><span className="mini-trip-image" style={{ backgroundImage: `url(${trip.image})` }} /><span>{trip.place.split(',')[0]}</span></button>)}
        </div>
        <div className="sidebar-bottom">
          <button className="nav-link" onClick={() => setShowSettings(true)}><Settings size={18} />Settings</button>
          <button className="nav-link" onClick={() => setShowHelp(true)}><CircleHelp size={18} />Help &amp; support</button>
          <div className="upgrade-card"><span className="upgrade-icon"><Sparkles size={16} /></span><b>Make room for more</b><p>Your next great story is waiting.</p><button onClick={() => setShowCreate(true)}>Plan a new trip <ArrowRight size={14} /></button></div>
          <div className="sidebar-user"><span className="user-avatar">{profileName.charAt(0).toUpperCase()}</span><span><b>{profileName}</b><small>Free plan</small></span><button aria-label="Edit profile" onClick={() => setShowSettings(true)}><ChevronDown size={16} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumbs">Your space <span>/</span> <b>{active}</b></div>
          <div className="top-actions"><button className="icon-button" aria-label="Notifications" onClick={() => notify("You're all caught up!")}><Bell size={18} /><i /></button><span className="top-divider" /><button className="top-user" onClick={() => setShowSettings(true)}><span className="user-avatar small">{profileName.charAt(0).toUpperCase()}</span><span>{profileName}</span><ChevronDown size={15} /></button></div>
        </header>

        <div className="page-content">
          {active === 'Home' ? (
            <>
              <section className="welcome-row"><div><div className="eyebrow"><span className="sun">✳</span> YOUR NEXT CHAPTER STARTS HERE</div><h1>Somewhere new<br /><em>is calling.</em></h1><p className="welcome-copy">The best trips aren't just places you go. They're stories you make together.</p><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Plan a trip <ArrowRight size={16} /></button></div><div className="hero-art"><div className="hero-photo" /><div className="photo-note"><span>✦</span><div><b>Make memories</b><small>one trip at a time</small></div></div><div className="hero-stamp">GO<br /><span>TO</span><br />GROW</div></div></section>
              <section className="section trips-section">
                <div className="section-heading"><div><div className="eyebrow muted">THE GOOD PLANS</div><h2>Your trips <span className="heading-count">{trips.length.toString().padStart(2, '0')}</span></h2></div><div className="section-tools"><label className="search-box"><Search size={16} /><input aria-label="Search trips" placeholder="Find a trip..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="sort-button" onClick={() => setTrips((current) => [...current].reverse())}><ArrowDownUp size={15} /> Sort</button></div></div>
                {filteredTrips.length ? <div className="trip-grid">{filteredTrips.map((trip) => <article className="trip-card" key={trip.id}>
                  <button className="trip-cover-button" aria-label={`Open ${trip.title}`} onClick={() => setSelectedTrip(trip)}><div className="trip-cover" style={{ backgroundImage: `linear-gradient(180deg, transparent 48%, rgba(20,25,24,.4)), url(${trip.image})` }}><span className="trip-status"><span /> {trip.status || 'Planning'}</span></div></button>
                  <div className="trip-card-body"><div className="trip-title-row"><div><h3>{trip.title}</h3><p className="trip-place"><MapPin size={14} />{trip.place}</p></div><button className="round-arrow" aria-label={`Open ${trip.title}`} onClick={() => setSelectedTrip(trip)}><ArrowRight size={16} /></button></div>
                    <div className="trip-meta"><span><CalendarDays size={14} />{trip.dates}</span><span className="countdown">{trip.days}</span></div>
                    <div className="trip-footer"><div className="avatar-stack">{(trip.people || []).map((person, index) => <span key={`${person}-${index}`} className={`member-avatar member-${index}`}>{person}</span>)}<button className="add-member" aria-label="Invite friends" onClick={() => copyInvite(trip)}>+</button></div><button className="invite-link" onClick={() => copyInvite(trip)}>Invite friends <ArrowRight size={13} /></button></div>
                  </div>
                </article>)}<button className="new-trip-card" onClick={() => setShowCreate(true)}><span className="new-trip-icon"><Plus size={21} /></span><b>Start a new adventure</b><span>Every good story starts somewhere.</span></button></div> : <div className="empty-state"><span>⌕</span><b>No trips found</b><p>Try another search, or make a new plan.</p><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={16} /> Create a trip</button></div>}
              </section>
              <section className="section inspiration-section"><div className="section-heading"><div><div className="eyebrow muted">A LITTLE DAYDREAMING</div><h2>Places to <em>fall for.</em></h2></div><button className="text-link" onClick={() => setActive('Explore')}>Explore all places <ArrowRight size={15} /></button></div>{renderPlaces(suggestions.slice(0, 2))}</section>
            </>
          ) : <section className="simple-page"><div className="eyebrow muted">ROAM TOGETHER</div><h1>{active === 'Explore' ? <>The world is<br /><em>wide open.</em></> : <>Good trips are<br /><em>better together.</em></>}</h1><p>{active === 'Explore' ? 'Save the places that make you feel something, and bring them into your next trip.' : 'Your travel groups and shared trips will show up here.'}</p>{active === 'Explore' && <div className="explore-grid">{renderPlaces(suggestions)}</div>}{active === 'Friends' && <button className="primary-button" onClick={() => trips[0] && copyInvite(trips[0])}><Users size={16} /> Invite friends <ArrowRight size={16} /></button>}</section>}
          <footer className="page-footer"><span>Made for the places that bring us closer <span className="footer-heart">♥</span></span><span>ROAM, AT YOUR OWN PACE</span></footer>
        </div>
      </main>

      {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
      {showCreate && <CreateTripModal onClose={() => setShowCreate(false)} onCreate={createTrip} />}
      {showSettings && <SettingsModal settings={settings} profileName={profileName} onNameChange={(name) => { setProfileName(name); localStorage.setItem('roam-profile-name', name); }} onSettingsChange={setSettings} onClose={() => setShowSettings(false)} onSave={() => { setShowSettings(false); notify('Settings saved.'); }} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {selectedTrip && <TripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} onUpdate={updateTrip} onInvite={copyInvite} onDelete={(id) => { setTrips((current) => current.filter((trip) => trip.id !== id)); setSelectedTrip(null); notify('Trip deleted.'); }} />}
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
      <style>{`
        .trip-cover-button{display:block;width:100%;padding:0;border:0;background:none;text-align:left;cursor:pointer}.trip-detail-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.trip-modal-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}.trip-modal-summary div{padding:13px;border-radius:14px;background:#f3f1ec}.trip-modal-summary small{display:block;color:#777;font-size:11px;text-transform:uppercase;letter-spacing:.07em}.trip-modal-summary b{display:block;margin-top:6px}.task-list{padding:0;list-style:none;display:grid;gap:9px}.task-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border:1px solid #e8e5de;border-radius:12px}.task-list button,.dialog-close{border:0;background:transparent;cursor:pointer;color:#777}.task-form{display:flex;gap:8px;margin-top:12px}.task-form input{flex:1;min-width:0;padding:11px;border:1px solid #ddd8cf;border-radius:11px}.setting-row{display:flex!important;flex-direction:row!important;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-bottom:1px solid #e8e5de}.setting-row small{display:block;color:#777;margin-top:4px}.help-question{width:100%;display:flex;justify-content:space-between;padding:14px 0;border:0;border-bottom:1px solid #e8e5de;background:none;text-align:left;font-weight:700;cursor:pointer}.help-answer{color:#62645e;line-height:1.55}.dialog-secondary{margin-top:12px;border:1px solid #ddd8cf;background:#fff;padding:10px 14px;border-radius:12px;cursor:pointer}.danger-button{border:1px solid #e7c9c4;color:#9c4438;background:#fff;padding:10px 14px;border-radius:12px;cursor:pointer}.dialog-copy{color:#6b6b66;line-height:1.5}.create-modal h2{margin-top:16px}.create-modal form>label{display:block;margin-top:14px}.create-modal form>label input:not([type=checkbox]){display:block;width:100%;margin-top:7px;padding:12px;border:1px solid #ddd8cf;border-radius:11px}.form-row{display:flex;gap:12px}.form-row label{flex:1}.budget-input{display:flex;align-items:center;gap:8px}.budget-input input{flex:1}.modal-submit{margin-top:18px}.page-content{min-width:0}
        @media(max-width:650px){.trip-modal-summary{grid-template-columns:1fr}.form-row{flex-direction:column}.task-form{flex-direction:column}}
      `}</style>
    </div>
  );
}

function CreateTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', place: '', start: '', end: '', budget: '' });
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.place.trim()) return;
    const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    onCreate({ title: form.title.trim(), place: form.place.trim(), dates: [formatDate(form.start), formatDate(form.end)].filter(Boolean).join(' – ') || 'Dates to be decided', days: 'Let the countdown begin', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=85', budget: Number(form.budget) || 0 });
  };
  return <ModalFrame title="Start your next adventure" onClose={onClose}><div className="eyebrow muted">LET'S MAKE A PLAN</div><h2>Start your<br /><em>next adventure.</em></h2><p className="dialog-copy">Add a few details to get your trip started.</p><form onSubmit={submit}><label>Give this trip a name<input required autoFocus placeholder="e.g. Summer in Sicily" value={form.title} onChange={change('title')} /></label><label>Where are you headed?<input required placeholder="City, region, or country" value={form.place} onChange={change('place')} /></label><div className="form-row"><label>Leaving<input type="date" value={form.start} onChange={change('start')} /></label><label>Coming back<input type="date" value={form.end} onChange={change('end')} /></label></div><label>Estimated budget per person<div className="budget-input"><span>€</span><input type="number" min="0" placeholder="1,500" value={form.budget} onChange={change('budget')} /></div></label><button className="primary-button modal-submit" type="submit">Create trip <ArrowRight size={16} /></button></form></ModalFrame>;
}

function SettingsModal({ settings, profileName, onNameChange, onSettingsChange, onClose, onSave }) {
  return <ModalFrame title="Settings" onClose={onClose}><div className="eyebrow muted">YOUR PREFERENCES</div><h2>Settings</h2><p className="dialog-copy">Manage your profile and notification preferences.</p><label>Display name<input value={profileName} onChange={(event) => onNameChange(event.target.value)} /></label><label className="setting-row"><span><b>Trip reminders</b><small>Reminders about upcoming trips and plans.</small></span><input type="checkbox" checked={settings.tripReminders} onChange={(event) => onSettingsChange({ ...settings, tripReminders: event.target.checked })} /></label><label className="setting-row"><span><b>Email updates</b><small>Travel inspiration and product news.</small></span><input type="checkbox" checked={settings.emailUpdates} onChange={(event) => onSettingsChange({ ...settings, emailUpdates: event.target.checked })} /></label><button className="primary-button modal-submit" onClick={onSave}>Save settings <Check size={16} /></button></ModalFrame>;
}

function HelpModal({ onClose }) {
  const faqs = [
    ['How do I create a trip?', 'Choose Plan a trip, enter a name and destination, and save. Open the trip card to add to-dos.'],
    ['How do I invite friends?', 'Open a trip and choose Invite friends to copy its link. This prototype stores trip data in this browser only; live sharing requires a backend.'],
    ['Can I track expenses?', 'Expense tracking is not implemented in this prototype yet. The trip planner currently supports trip details and a to-do list.'],
  ];
  const [open, setOpen] = useState(0);
  return <ModalFrame title="Help and support" onClose={onClose}><div className="eyebrow muted">ROAM SUPPORT</div><h2>Help &amp; support</h2><p className="dialog-copy">Answers to common trip-planning questions.</p>{faqs.map(([question, answer], index) => <div key={question}><button className="help-question" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>{question}<span>{open === index ? '−' : '+'}</span></button>{open === index && <p className="help-answer">{answer}</p>}</div>)}<button className="dialog-secondary" onClick={onClose}>Close</button></ModalFrame>;
}

function TripModal({ trip, onClose, onUpdate, onInvite, onDelete }) {
  const [draft, setDraft] = useState('');
  const tasks = Array.isArray(trip.tasks) ? trip.tasks : [];
  const addTask = (event) => {
    event.preventDefault();
    const task = draft.trim();
    if (!task) return;
    onUpdate(trip.id, { tasks: [...tasks, task] });
    setDraft('');
  };
  const removeTask = (index) => onUpdate(trip.id, { tasks: tasks.filter((_, taskIndex) => taskIndex !== index) });
  return <ModalFrame title={trip.title} onClose={onClose} wide><div className="eyebrow muted">TRIP OVERVIEW</div><h2>{trip.title}</h2><p className="dialog-copy"><MapPin size={15} /> {trip.place} &nbsp;·&nbsp; <CalendarDays size={15} /> {trip.dates}</p><div className="trip-modal-summary"><div><small>Budget per person</small><b>€{Number(trip.budget || 0).toLocaleString()}</b></div><div><small>Travelers</small><b>{(trip.people || []).length}</b></div><div><small>Status</small><b>{trip.status || 'Planning'}</b></div></div><h3>Trip to-dos</h3>{tasks.length ? <ul className="task-list">{tasks.map((task, index) => <li key={`${task}-${index}`}><span>{task}</span><button onClick={() => removeTask(index)}>Remove</button></li>)}</ul> : <p className="dialog-copy">No to-dos yet. Add something your group needs to decide.</p>}<form className="task-form" onSubmit={addTask}><input aria-label="New trip to-do" placeholder="e.g. Vote on hotels" value={draft} onChange={(event) => setDraft(event.target.value)} /><button className="primary-button" type="submit"><Plus size={16} /> Add</button></form><div className="trip-detail-actions"><button className="primary-button" onClick={() => onInvite(trip)}><Users size={16} /> Invite friends</button><button className="danger-button" onClick={() => { if (window.confirm(`Delete ${trip.title}?`)) onDelete(trip.id); }}>Delete trip</button></div></ModalFrame>;
}

function ModalFrame({ title, onClose, wide = false, children }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`create-modal ${wide ? 'trip-planner-modal' : ''}`} role="dialog" aria-modal="true" aria-label={title}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>{children}</section></div>;
}
