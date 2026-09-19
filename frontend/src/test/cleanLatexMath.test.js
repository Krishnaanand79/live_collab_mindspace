import { describe, it, expect } from 'vitest';
import { cleanLatexMath, PRESET_ACTIONS } from '../pages/Room';

describe('cleanLatexMath Utility', () => {
  it('handles null or empty strings gracefully', () => {
    expect(cleanLatexMath('')).toBe('');
    expect(cleanLatexMath(null)).toBe('');
    expect(cleanLatexMath(undefined)).toBe('');
  });

  it('converts LaTeX arrows to readable Unicode arrows', () => {
    const raw = 'Reactants \\longrightarrow Products \\to Output \\leftarrow Inputs';
    const cleaned = cleanLatexMath(raw);
    expect(cleaned).toContain('➔');
    expect(cleaned).toContain('⬅');
    expect(cleaned).not.toContain('\\longrightarrow');
    expect(cleaned).not.toContain('\\to');
  });

  it('converts subscripts in chemical formulas to Unicode subscripts', () => {
    const raw = '6 CO_2 + 6 H_2O \\longrightarrow C_6H_{12}O_6 + 6 O_2';
    const cleaned = cleanLatexMath(raw);
    expect(cleaned).toContain('CO₂');
    expect(cleaned).toContain('H₂O');
    expect(cleaned).toContain('C₆H₁₂O₆');
    expect(cleaned).toContain('O₂');
    expect(cleaned).not.toContain('_2');
  });

  it('strips LaTeX \\text{} and math styling wrappers', () => {
    const raw = '$$\\text{Photosynthesis: } \\mathbf{Energy} + \\text{H}_2\\text{O}$$';
    const cleaned = cleanLatexMath(raw);
    expect(cleaned).toContain('Photosynthesis:');
    expect(cleaned).toContain('Energy + H₂O');
    expect(cleaned).not.toContain('$$');
    expect(cleaned).not.toContain('\\text{');
    expect(cleaned).not.toContain('\\mathbf{');
  });

  it('preserves agent_action JSON code blocks without altering structure', () => {
    const raw = 'Summary here.\n```agent_action\n{\n  "type": "flowchart",\n  "title": "Photosynthesis"\n}\n```\nConcluding text.';
    const cleaned = cleanLatexMath(raw);
    expect(cleaned).toContain('```agent_action');
    expect(cleaned).toContain('"type": "flowchart"');
    expect(cleaned).toContain('Concluding text.');
  });
});

describe('PRESET_ACTIONS Structure', () => {
  it('defines all required preset templates with valid schema', () => {
    expect(PRESET_ACTIONS.photosynthesis).toBeDefined();
    expect(PRESET_ACTIONS.photosynthesis.type).toBe('flowchart');
    expect(Array.isArray(PRESET_ACTIONS.photosynthesis.nodes)).toBe(true);
    expect(Array.isArray(PRESET_ACTIONS.photosynthesis.connectors)).toBe(true);

    expect(PRESET_ACTIONS.kanban).toBeDefined();
    expect(PRESET_ACTIONS.kanban.type).toBe('template');
    expect(Array.isArray(PRESET_ACTIONS.kanban.columns)).toBe(true);

    expect(PRESET_ACTIONS.swot).toBeDefined();
    expect(PRESET_ACTIONS.swot.type).toBe('template');
    expect(Array.isArray(PRESET_ACTIONS.swot.quadrants)).toBe(true);

    expect(PRESET_ACTIONS.brainstorm).toBeDefined();
    expect(PRESET_ACTIONS.brainstorm.type).toBe('stickies');
    expect(Array.isArray(PRESET_ACTIONS.brainstorm.stickies)).toBe(true);

    expect(PRESET_ACTIONS.organize).toBeDefined();
    expect(PRESET_ACTIONS.organize.type).toBe('organize');
  });
});
