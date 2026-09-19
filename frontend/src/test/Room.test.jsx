import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderMarkdown, PRESET_ACTIONS, cleanLatexMath } from '../pages/Room';

describe('Room Agentic Whiteboard & Markdown Tests', () => {
  it('renders clean markdown headings, bold text and lists without raw LaTeX artifacts', () => {
    const markdown = `# Architecture Overview
Here is the formula for water: $\\text{H}_2\\text{O}$ and glucose: $\\text{C}_6\\text{H}_{12}\\text{O}_6$.
* High-availability WebSockets
* Real-time Canvas Sync`;

    const { container } = render(<div>{renderMarkdown(markdown)}</div>);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Architecture Overview');
    expect(screen.getByText(/H₂O/)).toBeInTheDocument();
    expect(screen.getByText(/C₆H₁₂O₆/)).toBeInTheDocument();
    expect(screen.getByText('High-availability WebSockets')).toBeInTheDocument();
  });

  it('detects agent_action blocks and renders interactive Apply to Whiteboard card', () => {
    const actionData = {
      type: 'flowchart',
      title: 'Authentication Pipeline',
      nodes: [{ id: 'n1', text: 'Client Request' }, { id: 'n2', text: 'JWT Verify' }],
      connectors: [{ from: 'n1', to: 'n2' }],
      stickies: []
    };

    const markdownWithAction = `I have generated a diagram for you:
\`\`\`agent_action
${JSON.stringify(actionData)}
\`\`\`
Let me know if you would like me to adjust it!`;

    const handleApplyMock = vi.fn();
    render(<div>{renderMarkdown(markdownWithAction, handleApplyMock, [])}</div>);

    expect(screen.getByText(/Authentication Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/2 process nodes, 1 connecting arrows/i)).toBeInTheDocument();

    const applyBtn = screen.getByRole('button', { name: /Apply to Whiteboard/i });
    expect(applyBtn).toBeInTheDocument();

    fireEvent.click(applyBtn);
    expect(handleApplyMock).toHaveBeenCalledTimes(1);
    expect(handleApplyMock).toHaveBeenCalledWith(actionData);
  });

  it('disables apply button and shows applied checkmark when action was already executed', () => {
    const actionData = {
      type: 'template',
      title: 'Agile Kanban Board',
      columns: [{ title: 'To Do' }, { title: 'In Progress' }, { title: 'Done' }],
      stickies: [{ text: 'Task 1' }]
    };

    const markdownWithAction = `\`\`\`agent_action
${JSON.stringify(actionData)}
\`\`\``;

    render(<div>{renderMarkdown(markdownWithAction, vi.fn(), ['Agile Kanban Board'])}</div>);

    const appliedBtn = screen.getByRole('button', { name: /Applied to Whiteboard/i });
    expect(appliedBtn).toBeDisabled();
  });

  it('validates PRESET_ACTIONS integrity for quick agentic whiteboard creation', () => {
    expect(PRESET_ACTIONS.photosynthesis).toBeDefined();
    expect(PRESET_ACTIONS.photosynthesis.nodes.length).toBeGreaterThanOrEqual(3);
    expect(PRESET_ACTIONS.photosynthesis.connectors.length).toBeGreaterThanOrEqual(2);

    expect(PRESET_ACTIONS.kanban).toBeDefined();
    expect(PRESET_ACTIONS.kanban.columns.length).toBe(3);
    expect(PRESET_ACTIONS.kanban.stickies.length).toBeGreaterThanOrEqual(3);

    expect(PRESET_ACTIONS.swot).toBeDefined();
    expect(PRESET_ACTIONS.swot.quadrants.length).toBe(4);

    expect(PRESET_ACTIONS.brainstorm).toBeDefined();
    expect(PRESET_ACTIONS.brainstorm.stickies.length).toBeGreaterThanOrEqual(4);

    expect(PRESET_ACTIONS.organize).toBeDefined();
    expect(PRESET_ACTIONS.organize.type).toBe('organize');
  });
});

