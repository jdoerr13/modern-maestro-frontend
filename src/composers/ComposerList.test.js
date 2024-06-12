import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ComposerList from './ComposerList';
import ModernMaestroApi from '../api/api';

jest.mock('../api/api');

describe('ComposerList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches composers', async () => {
    const mockComposers = [
      { composer_id: 1, name: 'Wolfgang Amadeus Mozart' },
      { composer_id: 2, name: 'Ludwig van Beethoven' },
    ];
    ModernMaestroApi.getComposers.mockResolvedValueOnce(mockComposers);

    render(
      <Router>
        <ComposerList />
      </Router>
    );

    await waitFor(() => expect(ModernMaestroApi.getComposers).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/composers/i)).not.toBeNull();
    expect(screen.getByText(/wolfgang amadeus mozart/i)).not.toBeNull();
    expect(screen.getByText(/ludwig van beethoven/i)).not.toBeNull();
  });

  it('filters composers based on search term', async () => {
    const mockComposers = [
      { composer_id: 1, name: 'Wolfgang Amadeus Mozart' },
      { composer_id: 2, name: 'Ludwig van Beethoven' },
    ];
    ModernMaestroApi.getComposers.mockResolvedValueOnce(mockComposers);

    render(
      <Router>
        <ComposerList />
      </Router>
    );

    await waitFor(() => expect(ModernMaestroApi.getComposers).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByPlaceholderText(/search our composer list/i), { target: { value: 'beethoven' } });

    expect(screen.queryByText(/wolfgang amadeus mozart/i)).toBeNull();
    expect(screen.getByText(/ludwig van beethoven/i)).not.toBeNull();
  });

  it('shows message when no composers are found', async () => {
    ModernMaestroApi.getComposers.mockResolvedValueOnce([]);

    render(
      <Router>
        <ComposerList />
      </Router>
    );

    await waitFor(() => expect(ModernMaestroApi.getComposers).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/no composers found/i)).not.toBeNull();
    expect(screen.getByText(/help us add more 'classical' composers/i)).not.toBeNull();
  });
});
