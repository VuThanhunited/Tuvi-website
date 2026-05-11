import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, create } from 'react-test-renderer';
import axios from 'axios';
import Dashboard from './Dashboard';

vi.mock('axios');

describe('Dashboard page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard header and fetches stats', async () => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          totalMasters: 12,
          totalInterpretations: 24,
          totalLaSo: 48,
        },
      },
    });

    let tree;
    await act(async () => {
      tree = create(<Dashboard />);
    });

    const heading = tree.root.findByType('h1');
    expect(heading.props.children).toContain('Hệ thống Quản trị Tử Vi');
    expect(axios.get).toHaveBeenCalled();
  });
});
