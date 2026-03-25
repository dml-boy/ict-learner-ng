'use client';

import { useState, useEffect } from 'react';
import styles from './LiveEditor.module.css';

export default function LiveEditor() {
  const [html, setHtml] = useState(`<!-- Build something for your community! -->
<div class="card">
  <h1>Abiola's Fresh Market</h1>
  <p>Providing the best yams and plantains in Lagos.</p>
  <button>Order Now</button>
</div>

<style>
  body { font-family: sans-serif; display: flex; justify-content: center; padding-top: 50px; background: #f0f2f5; }
  .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 300px; }
  h1 { color: #10b981; }
  button { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 15px; }
</style>`);

  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(html);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html]);

  return (
    <div className={styles.container}>
      <div className={styles.editorPane}>
        <div className={styles.header}>
          <span>Code Editor (HTML/CSS)</span>
          <span className="tag-nigeria">Project: Local Market Vendor</span>
        </div>
        <textarea
          className={styles.textarea}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          spellCheck="false"
        />
      </div>
      <div className={styles.previewPane}>
        <div className={styles.header}>Live Preview</div>
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          className={styles.iframe}
        />
      </div>
    </div>
  );
}
