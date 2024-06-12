import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComposerTrackSearch from './ComposerTrackSearch';
import ModernMaestroApi from '../api/api';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../api/api');

describe('ComposerTrackSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and performs a search', async () => {
    const mockTracks = [
      {
        name: 'Symphony No. 5',
        duration: '330000',
        year: 1808,
        album: 'Beethoven: Symphonies',
        preview_url: 'https://example.com/preview',
      },
    ];
    ModernMaestroApi.fetchTracksByComposerName.mockResolvedValueOnce(mockTracks);

    render(
      <Router>
        <ComposerTrackSearch />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/confirm composer here/i), { target: { value: 'Beethoven' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(ModernMaestroApi.fetchTracksByComposerName).toHaveBeenCalledWith('Beethoven'));
    expect(screen.getByText(/success! composer beethoven found/i)).toBeTruthy();
  });

  it('displays error message when no tracks are found', async () => {
    ModernMaestroApi.fetchTracksByComposerName.mockResolvedValueOnce([]);

    render(
      <Router>
        <ComposerTrackSearch />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/confirm composer here/i), { target: { value: 'Unknown Composer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(ModernMaestroApi.fetchTracksByComposerName).toHaveBeenCalledWith('Unknown Composer'));
    expect(screen.getByText(/no composers found. please check your spelling./i)).toBeTruthy();
  });

  it('adds a composer to the database', async () => {
    const mockComposer = { composer_id: 1, name: 'Beethoven' };
    ModernMaestroApi.createComposer.mockResolvedValueOnce(mockComposer);

    render(
      <Router>
        <ComposerTrackSearch />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/confirm composer here/i), { target: { value: 'Beethoven' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  });
});
