import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ComposerSelection from './ComposerSelection';
import ModernMaestroApi from '../api/api';

jest.mock('../api/api');

describe('ComposerSelection', () => {
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
        <ComposerSelection />
      </Router>
    );

    await waitFor(() => expect(ModernMaestroApi.getComposers).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/select a composer to add a new composition/i)).not.toBeNull();
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
        <ComposerSelection />
      </Router>
    );

    await waitFor(() => expect(ModernMaestroApi.getComposers).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByPlaceholderText(/search composers/i), { target: { value: 'beethoven' } });

    expect(screen.queryByText(/wolfgang amadeus mozart/i)).toBeNull();
    expect(screen.getByText(/ludwig van beethoven/i)).not.toBeNull();
  });
});
