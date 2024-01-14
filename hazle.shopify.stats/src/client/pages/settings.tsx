import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [switchState, setSwitchState] = useState(
    localStorage.getItem('darkTheme') === 'true'
  );

  const handleSwitchChange = () => {
    const newState = !switchState;
    setSwitchState(newState);

    if (!newState) {
      localStorage.setItem('darkTheme', JSON.stringify(false));
      document.body.classList.remove('dark-theme');
    } else {
      localStorage.setItem('darkTheme', JSON.stringify(true));
      document.body.classList.add('dark-theme');
    }
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', switchState);
  }, [switchState]);

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="switch"
        checked={switchState}
        onChange={handleSwitchChange}
      />
      <label className="form-check-label" htmlFor="switch">
        Dark Mode
      </label>
    </div>
  );
};

export default Settings;
