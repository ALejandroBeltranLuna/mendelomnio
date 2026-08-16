TypeScript
import React, { useState } from 'react';
import { database } from './database';
import { periodicTableData } from './periodicTableData';

export function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Mendelomnio - ElementBeasts</h1>
      <p>Aplicación cargada correctamente.</p>
    </div>
  );
}

export default App;
