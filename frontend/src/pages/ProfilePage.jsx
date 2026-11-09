import React, { useState } from 'react';
import { UNIVERSITY_SUBJECTS } from '../services/academicData';
import { readTheme, setGlobalTheme } from '../services/theme';
import '../styles/AssessmentPages.css';

const PROFILE_KEY = 'mock-profile';
const DEFAULT_PROFILE = { name: '', email: '', university: '', program: '', semester: '', courseSection: '' };
const LEGACY_DEFAULTS = { name: 'Alex Morgan', email: 'alex.morgan@university.edu', program: 'B.Tech Computer Science', course: 'Section A' };
const PROFILE_FIELDS = [
  ['name', 'Student name', 'text'],
  ['email', 'Student email', 'email'],
  ['university', 'University', 'text'],
  ['program', 'Program', 'text'],
  ['semester', 'Current semester', 'text'],
  ['courseSection', 'Course / section', 'text'],
];

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return DEFAULT_PROFILE;
    const profile = { ...DEFAULT_PROFILE, ...stored };
    // Remove only values that came from the previous hardcoded demo profile.
    Object.entries(LEGACY_DEFAULTS).forEach(([key, value]) => {
      const target = key === 'course' ? 'courseSection' : key;
      if (profile[target] === value) profile[target] = '';
    });
    if (!profile.courseSection && stored.course && stored.course !== LEGACY_DEFAULTS.course) profile.courseSection = stored.course;
    return Object.fromEntries(Object.keys(DEFAULT_PROFILE).map((key) => [key, String(profile[key] || '')]));
  } catch {
    return DEFAULT_PROFILE;
  }
}

function validate(profile) {
  const name = profile.name.trim();
  const email = profile.email.trim();
  if (name.length < 2) return 'Enter your name using at least two characters.';
  if (!email) return 'Enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address, such as name@example.com.';
  return '';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(() => ({ ...loadProfile() }));
  const [theme, setTheme] = useState(readTheme);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setFeedback({ type: '', message: '' });
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const error = validate(draft);
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }
    const normalized = Object.fromEntries(Object.keys(DEFAULT_PROFILE).map((key) => [key, draft[key].trim()]));
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(normalized));
      setProfile(normalized);
      setDraft(normalized);
      setFeedback({ type: 'success', message: 'Profile saved in this browser.' });
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save profile. Check browser storage settings and try again.' });
    }
  };

  const cancelEdit = () => {
    setDraft({ ...profile });
    setFeedback({ type: '', message: '' });
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    setGlobalTheme(value);
    setFeedback({ type: 'success', message: `${value === 'dark' ? 'Dark' : 'Light'} Mode is active and saved in this browser.` });
  };

  const initials = profile.name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '—';
  const academicValues = [
    ['University', profile.university],
    ['Program', profile.program],
    ['Current semester', profile.semester],
    ['Course / section', profile.courseSection],
  ];

  return <main className="assessment-page">
    <header className="assessment-title"><span className="section-badge">Student account</span><h1>Profile & Settings</h1><p>Manage your profile and local preferences. No account service is connected.</p></header>
    <div className="profile-layout">
      <section className="panel-card profile-card">
        <div className="profile-avatar">{initials}</div>
        <h2>{profile.name || 'Name not provided'}</h2>
        <p>{profile.email || 'Email not provided'}</p>
        <span className="muted">Profile details are saved locally in this browser.</span>
        <div className="profile-summary-list">{academicValues.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || 'Not provided'}</strong></div>)}</div>
      </section>

      <section className="panel-card">
        <h2>Edit profile</h2>
        <p className="muted profile-form-note">Name and email are required. Academic details are optional and remain on this device.</p>
        <form onSubmit={saveProfile} noValidate>
          <div className="profile-fields">{PROFILE_FIELDS.map(([key, label, type]) => <label key={key}>{label}{(key === 'name' || key === 'email') && <span aria-hidden="true"> *</span>}<input type={type} autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : 'off'} value={draft[key]} onChange={(event) => updateDraft(key, event.target.value)} aria-invalid={feedback.type === 'error' && ((key === 'name' && draft.name.trim().length < 2) || (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())))} /></label>)}</div>
          <div className="profile-form-actions"><button className="btn btn-primary" type="submit">Save Profile</button><button className="btn btn-secondary" type="button" onClick={cancelEdit}>Cancel Changes</button></div>
          {feedback.message && <p className={`profile-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
        </form>
        <h2 className="profile-section-title">Preferences</h2>
        <div className="preference-row"><label htmlFor="theme-choice">Appearance</label><select id="theme-choice" value={theme} onChange={(event) => handleThemeChange(event.target.value)}><option value="light">Light Mode</option><option value="dark">Dark Mode</option></select></div>
        <div className="preference-row"><span>Language</span><span className="preference-value">English <small>Only interface language currently available</small></span></div>
        <div className="preference-notice"><strong>Notifications are not connected</strong><p>No notification preference is offered until a notification service is available.</p></div>
      </section>

      <section className="panel-card">
        <h2>Academic information</h2>
        <p className="muted">University and program details are shown only when you provide them above. The course list below comes from the available curriculum data.</p>
        <div className="subject-list">{UNIVERSITY_SUBJECTS.map((subject) => <div key={subject.code}><strong>{subject.code}</strong><span>{subject.name}</span><span className="muted">{subject.type} · {subject.units.length} units</span></div>)}</div>
      </section>

      <section className="panel-card">
        <h2>Account & security</h2>
        <p className="muted">These features require backend authentication and are not available in mock mode.</p>
        <div className="action-stack"><button className="btn btn-secondary" type="button" disabled>Change Password · Not available</button><button className="btn btn-secondary" type="button" disabled>Account Security · Not available</button><button className="btn btn-secondary" type="button" disabled>Sign Out · Not available</button></div>
      </section>
    </div>
  </main>;
}
