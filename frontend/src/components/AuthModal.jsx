import React, { useState } from 'react';
import '../styles/AuthModal.css';

export default function AuthModal({ mode, onClose, onSubmit, onSwitchMode }) {
  const isRegistering = mode === 'register';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const response = await onSubmit({ mode, username, email, password });
      if (isRegistering) {
        setMessage(response.message || 'Account created. You can now log in.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setError('');
    setMessage('');
    onSwitchMode(isRegistering ? 'login' : 'register');
  };

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <h2 id="auth-title">{isRegistering ? 'Create your account' : 'Welcome back'}</h2>
        <p>{isRegistering ? 'Start practising with a free student account.' : 'Log in to continue practising.'}</p>
        <form onSubmit={submit}>
          <label>Username<input required minLength="3" maxLength="50" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          {isRegistering && <label>Email<input required type="email" maxLength="254" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
          <label>Password<input required type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="auth-message auth-error">{error}</p>}
          {message && <p className="auth-message auth-success">{message}</p>}
          <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : isRegistering ? 'Create account' : 'Login'}</button>
        </form>
        <button className="auth-switch" type="button" onClick={switchMode}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign up'}
        </button>
      </section>
    </div>
  );
}
