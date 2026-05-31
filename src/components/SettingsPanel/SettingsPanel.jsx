import React from 'react';
import './SettingsPanel.css';

function SettingsPanel({ title, description, children }) {
  return (
    <div className="settings-panel">
      <div className="settings-panel__header">
        <h3 className="settings-panel__title">{title}</h3>
        {description && <p className="settings-panel__desc">{description}</p>}
      </div>
      <div className="settings-panel__body">{children}</div>
    </div>
  );
}

export function SettingsRow({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row__info">
        <p className="settings-row__label">{label}</p>
        {description && <p className="settings-row__desc">{description}</p>}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle" aria-label={label}>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__slider"></span>
    </label>
  );
}

export default SettingsPanel;
