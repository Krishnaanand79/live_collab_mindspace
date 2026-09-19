import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test cleanLatexMath logic from backend
function cleanLatexMath(str) {
  if (!str) return '';

  let actionBlock = '';
  let textToClean = str;
  const match = str.match(/```agent_action[\s\S]*?```/);
  if (match) {
    actionBlock = match[0];
    textToClean = str.replace(/```agent_action[\s\S]*?```/, '__AGENT_ACTION_BLOCK__');
  }

  const subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋' };
  const supMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻' };

  let cleaned = textToClean
    .replace(/\\(longrightarrow|rightarrow|to)/g, ' ➔ ')
    .replace(/\\(longleftarrow|leftarrow)/g, ' ⬅ ')
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^{}]+)\}/g, '$1')
    .replace(/\\math[a-zA-Z]+\{([^{}]+)\}/g, '$1')
    .replace(/_\{([0-9+-]+)\}/g, (_, m) => m.split('').map(c => subMap[c] || c).join(''))
    .replace(/_([0-9+-])/g, (_, c) => subMap[c] || c)
    .replace(/\^\{([0-9+-]+)\}/g, (_, m) => m.split('').map(c => supMap[c] || c).join(''))
    .replace(/\^([0-9+-])/g, (_, c) => supMap[c] || c)
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/[ \t]{2,}/g, ' ');

  if (actionBlock) {
    cleaned = cleaned.replace('__AGENT_ACTION_BLOCK__', actionBlock);
  }

  return cleaned;
}

describe('Backend Math & Formula Sanitization', () => {
  test('converts LaTeX arrows to Unicode arrows', () => {
    const input = 'A \\longrightarrow B \\to C \\leftarrow D';
    const output = cleanLatexMath(input);
    assert.ok(output.includes('➔'));
    assert.ok(output.includes('⬅'));
    assert.ok(!output.includes('\\longrightarrow'));
  });

  test('converts subscripts in chemical formulas to natural Unicode', () => {
    const input = '6 CO_2 + 6 H_2O \\longrightarrow C_6H_{12}O_6 + 6 O_2';
    const output = cleanLatexMath(input);
    assert.ok(output.includes('CO₂'));
    assert.ok(output.includes('H₂O'));
    assert.ok(output.includes('C₆H₁₂O₆'));
    assert.ok(output.includes('O₂'));
    assert.ok(!output.includes('_2'));
  });

  test('removes LaTeX text wrappers and dollar signs', () => {
    const input = '$$\\text{Water} (\\text{H}_2\\text{O})$$';
    const output = cleanLatexMath(input);
    assert.strictEqual(output.trim(), 'Water (H₂O)');
  });

  test('preserves agent_action code blocks intact', () => {
    const input = 'Here is the diagram:\n```agent_action\n{\n  "type": "flowchart",\n  "title": "Photosynthesis"\n}\n```\nEnjoy!';
    const output = cleanLatexMath(input);
    assert.ok(output.includes('```agent_action'));
    assert.ok(output.includes('"type": "flowchart"'));
    assert.ok(output.includes('Enjoy!'));
  });
});

describe('Backend REST API Integration (localhost:3001)', () => {
  const BASE_URL = 'http://localhost:3001';

  test('GET /api/ai/status returns key status', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/status`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(typeof data.hasKey, 'boolean');
  });

  test('POST /api/room creates a new room with valid uppercase code', async () => {
    const res = await fetch(`${BASE_URL}/api/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Automated Test Room' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.roomId);
    assert.strictEqual(data.roomId, data.roomId.toUpperCase());

    // Verify room is immediately retrievable
    const getRes = await fetch(`${BASE_URL}/api/room/${data.roomId}`);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.success, true);
    assert.strictEqual(getData.room.id, data.roomId);
  });

  test('GET /api/room/:roomId returns 404 for non-existent room', async () => {
    const res = await fetch(`${BASE_URL}/api/room/NON_EXISTENT_99999`);
    assert.strictEqual(res.status, 404);
  });

  test('GET /api/dashboard returns active rooms structure', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.recentRooms));
    assert.strictEqual(typeof data.totalRooms, 'number');
  });

  test('GET /api/history returns sessions array', async () => {
    const res = await fetch(`${BASE_URL}/api/history`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.sessions));
  });
});
