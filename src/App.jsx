import React, { useEffect, useState } from 'react';
import {
  ArrowDownUp, ArrowRight, Bell, CalendarDays, Check, ChevronDown,
  CircleHelp, Compass, MapPin, Menu, Plus, Search, Settings, Sparkles,
  Users, X,
} from 'lucide-react';

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
  },
];

const suggestions = [
  {
    title: 'Find your little corner of paradise',
    place: 'The Cyclades, Greece',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85',
    tag: 'ISLAND ESCAPE',
  },
  {
    title: 'A city made for wandering',
    place: 'Lisbon, Portugal',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85',
    tag: 'CITY BREAK',
  },
  {
    title: 'Take the scenic route',
    place: 'Dolomites, Italy',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85',
    tag: 'MOUNTAIN AIR',
  },
];

function readTrips() {
  try {
    const saved = JSON.parse(localStorage.getItem('roam-trips'));
    return Array.isArray(saved) ? saved : initialTrips;
  } catch {
    return initialTrips;
  }
}

function App() {
  const [trips, setTrips] = useState(readTrips);
  const [active, setActive] = useState('Home');
  const [showCreate, setShowCreate] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('roam-trips', JSON.stringify(trips));
  }, [trips]);

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 2600);
  };

  const createTrip = (trip) => {
    setTrips((current) => [
      { ...trip, id: Date.now(), people: ['Y'], status: 'Planning' },
      ...current,
    ]);
    setShowCreate(false);
    setActive('Home');
    notify('Your trip is ready to plan ✨');
  };

  const navItems = [
    { label: 'Home', icon: Compass },
    { label: 'Explore', icon: Search },
    { label: 'Friends', icon: Users },
  ];
  const filteredTrips = trips.filter((trip) =>
    `${trip.title} ${trip.place}`.toLowerCase().includes(query.toLowerCase()),
  );

  const renderPlaces = (places) => (
    <div className="inspiration-grid">
      {places.map((place) => (
        <button
          className="inspiration-card"
          key={place.title}
          style={{ backgroundImage: `linear-gradient(90deg, rgba(20,26,23,.55), rgba(20,26,23,0)), url(${place.image})` }}
          onClick={() => notify(`${place.place} saved to your inspiration list!`)}
        >
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
        <a className="brand" href="#home" onClick={() => setActive('Home')}>
          <span className="brand-mark">r</span><span>roam<span className="brand-dot">.</span></span>
        </a>
        <button className="profile-switch">
          <span className="profile-avatar">Y</span>
          <span className="profile-label"><b>Your space</b><small>Personal workspace</small></span>
          <ChevronDown size={16} />
        </button>
        <div className="side-label">MENU</div>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link ${active === label ? 'selected' : ''}`}
              onClick={() => { setActive(label); setMobileMenu(false); }}
            >
              <Icon size={18} strokeWidth={1.8} />{label}
              {label === 'Friends' && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>
        <div className="side-label trips-label">
          YOUR TRIPS <button aria-label="Create trip" onClick={() => setShowCreate(true)}><Plus size={16} /></button>
        </div>
        <div className="mini-trips">
          {trips.slice(0, 4).map((trip) => (
            <button key={trip.id} className="mini-trip" onClick={() => { setActive('Home'); notify(`${trip.title} · trip overview`); }}>
              <span className="mini-trip-image" style={{ backgroundImage: `url(${trip.image})` }} />
              <span>{trip.place.split(',')[0]}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="nav-link" onClick={() => notify('Settings are coming soon.')}><Settings size={18} />Settings</button>
          <button className="nav-link" onClick={() => notify('Help center coming soon.')}><CircleHelp size={18} />Help &amp; support</button>
          <div className="upgrade-card">
            <span className="upgrade-icon"><Sparkles size={16} /></span>
            <b>Make room for more</b><p>Your next great story is waiting.</p>
            <button onClick={() => setShowCreate(true)}>Plan a new trip <ArrowRight size={14} /></button>
          </div>
          <div className="sidebar-user">
            <span className="user-avatar">Y</span>
            <span><b>Your name</b><small>Free plan</small></span>
            <button aria-label="User menu" onClick={() => notify('Profile settings coming soon.')}><ChevronDown size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumbs">Your space <span>/</span> <b>{active}</b></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => notify('You’re all caught up!')}><Bell size={18} /><i /></button>
            <span className="top-divider" />
            <button className="top-user" onClick={() => notify('Profile settings coming soon.')}>
              <span className="user-avatar small">Y</span><span>Your name</span><ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="page-content">
          {active === 'Home' ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="sun">✳</span> YOUR NEXT CHAPTER STARTS HERE</div>
                  <h1>Somewhere new<br /><em>is calling.</em></h1>
                  <p className="welcome-copy">The best trips aren’t just places you go. They’re stories you make together.</p>
                  <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Plan a trip <ArrowRight size={16} /></button>
                </div>
                <div className="hero-art">
                  <div className="hero-photo" />
                  <div className="photo-note"><span>✦</span><div><b>Make memories</b><small>one trip at a time</small></div></div>
                  <div className="hero-stamp">GO<br /><span>TO</span><br />GROW</div>
                </div>
              </section>

              <section className="section trips-section">
                <div className="section-heading">
                  <div><div className="eyebrow muted">THE GOOD PLANS</div><h2>Your trips <span className="heading-count">{trips.length.toString().padStart(2, '0')}</span></h2></div>
                  <div className="section-tools">
                    <label className="search-box"><Search size={16} /><input aria-label="Search trips" placeholder="Find a trip..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
                    <button className="sort-button" onClick={() => setTrips((current) => [...current].reverse())}><ArrowDownUp size={15} /> Sort</button>
                  </div>
                </div>
                {filteredTrips.length ? (
                  <div className="trip-grid">
                    {filteredTrips.map((trip) => (
                      <article className="trip-card" key={trip.id}>
                        <div className="trip-cover" style={{ backgroundImage: `linear-gradient(180deg, transparent 48%, rgba(20,25,24,.4)), url(${trip.image})` }}>
                          <span className="trip-status"><span /> {trip.status}</span>
                          <button className="card-menu" aria-label="Trip options" onClick={() => notify('Trip options coming soon.')}>•••</button>
                        </div>
                        <div className="trip-card-body">
                          <div className="trip-title-row">
                            <div><h3>{trip.title}</h3><p className="trip-place"><MapPin size={14} />{trip.place}</p></div>
                            <button className="round-arrow" aria-label={`Open ${trip.title}`} onClick={() => notify(`${trip.title} · trip overview`)}><ArrowRight size={16} /></button>
                          </div>
                          <div className="trip-meta"><span><CalendarDays size={14} />{trip.dates}</span><span className="countdown">{trip.days}</span></div>
                          <div className="trip-footer">
                            <div className="avatar-stack">{trip.people.map((person, index) => <span key={`${person}-${index}`} className={`member-avatar member-${index}`}>{person}</span>)}<button className="add-member" onClick={() => notify('Invite link copied!')}>+</button></div>
                            <button className="invite-link" onClick={() => notify('Invite link copied!')}>Invite friends <ArrowRight size={13} /></button>
                          </div>
                        </div>
                      </article>
                    ))}
                    <button className="new-trip-card" onClick={() => setShowCreate(true)}><span className="new-trip-icon"><Plus size={21} /></span><b>Start a new adventure</b><span>Every good story starts somewhere.</span></button>
                  </div>
                ) : (
                  <div className="empty-state"><span>⌕</span><b>No trips found</b><p>Try another search, or make a new plan.</p><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={16} /> Create a trip</button></div>
                )}
              </section>

              <section className="section inspiration-section">
                <div className="section-heading"><div><div className="eyebrow muted">A LITTLE DAYDREAMING</div><h2>Places to <em>fall for.</em></h2></div><button className="text-link" onClick={() => setActive('Explore')}>Explore all places <ArrowRight size={15} /></button></div>
                {renderPlaces(suggestions.slice(0, 2))}
              </section>
            </>
          ) : (
            <section className="simple-page">
              <div className="eyebrow muted">ROAM TOGETHER</div>
              <h1>{active === 'Explore' ? <>The world is<br /><em>wide open.</em></> : <>Good trips are<br /><em>better together.</em></>}</h1>
              <p>{active === 'Explore' ? 'Save the places that make you feel something, and bring them into your next trip.' : 'Your travel crew will show up here. Invite your favorite people to start planning.'}</p>
              {active === 'Explore' && <div className="explore-grid">{renderPlaces(suggestions)}</div>}
              {active === 'Friends' && <button className="primary-button" onClick={() => notify('Invite link copied!')}><Users size={16} /> Invite friends <ArrowRight size={16} /></button>}
            </section>
          )}
          <footer className="page-footer"><span>Made for the places that bring us closer <span className="footer-heart">♥</span></span><span>ROAM, AT YOUR OWN PACE</span></footer>
        </div>
      </main>

      {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
      {showCreate && <CreateTripModal onClose={() => setShowCreate(false)} onCreate={createTrip} />}
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </div>
  );
}

function CreateTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', place: '', start: '', end: '', budget: '' });
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.place.trim()) return;

    const formatDate = (value, includeYear = false) => {
      if (!value) return '';
      const date = new Date(`${value}T12:00:00`);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(includeYear ? { year: 'numeric' } : {}),
      });
    };

    const start = formatDate(form.start) || 'Dates to be decided';
    const end = formatDate(form.end, true);

    onCreate({
      title: form.title.trim(),
      place: form.place.trim(),
      dates: end ? `${start} – ${end}` : start,
      days: 'Let the countdown begin',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=85',
      budget: form.budget,
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
        <div className="eyebrow muted">LET'S MAKE A PLAN</div>
        <h2 id="modal-title">Start your<br /><em>next adventure.</em></h2>
        <p className="modal-copy">A few little details, then the fun part begins.</p>
        <form onSubmit={submit}>
          <label>Give this trip a name<input required autoFocus placeholder="e.g. Summer in Sicily" value={form.title} onChange={change('title')} /></label>
          <label>Where are you headed?<input required placeholder="City, region, or country" value={form.place} onChange={change('place')} /></label>
          <div className="form-row">
            <label>Leaving<input type="date" value={form.start} onChange={change('start')} /></label>
            <label>Coming back<input type="date" value={form.end} onChange={change('end')} /></label>
          </div>
          <label>Estimated budget per person <span className="optional">(optional)</span><div className="budget-input"><span>$</span><input type="number" min="0" placeholder="1,500" value={form.budget} onChange={change('budget')} /></div></label>
          <button className="primary-button modal-submit" type="submit">Create trip <ArrowRight size={16} /></button>
        </form>
      </section>
    </div>
  );
}

export default App;
