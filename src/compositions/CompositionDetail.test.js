import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CompositionDetail from './CompositionDetail';
import ModernMaestroApi from '../api/api';
import { UserProvider } from '../auth/UserContext'; // Import the UserProvider

jest.mock('../api/api', () => ({
  getCompositionById: jest.fn(),
  getComposerById: jest.fn(),
  fetchTracksByComposerName: jest.fn(),
}));

const mockComposition = {
  composition_id: 1,
  title: 'Symphony No. 5',
  year_of_composition: 1808,
  duration: '30:00',
  instrumentation: ['Strings', 'Brass', 'Woodwinds'],
  composer_id: 1,
  audio_file_path: '/uploads/symphony5.mp3',
};

const mockComposer = {
  composer_id: 1,
  name: 'Beethoven',
};

const mockTracks = [
  {
    name: 'Symphony No. 5',
    duration: '330000',
    year: 1808,
    album: 'Beethoven: Symphonies',
    preview_url: 'https://example.com/preview'
  }
];

describe('CompositionDetail', () => {
  beforeEach(() => {
    ModernMaestroApi.getCompositionById.mockResolvedValue(mockComposition);
    ModernMaestroApi.getComposerById.mockResolvedValue(mockComposer);
    ModernMaestroApi.fetchTracksByComposerName.mockResolvedValue(mockTracks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches composition details', async () => {
    render(
      <UserProvider value={{ user: { id: 1, username: 'testuser' } }}>
        <MemoryRouter initialEntries={['/compositions/1']}>
          <Routes>
            <Route path="/compositions/:compositionId" element={<CompositionDetail />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );

    await waitFor(() => {
      expect(ModernMaestroApi.getCompositionById).toHaveBeenCalledWith('1');
      expect(ModernMaestroApi.getComposerById).toHaveBeenCalledWith(1);
      expect(ModernMaestroApi.fetchTracksByComposerName).toHaveBeenCalledWith('Beethoven');
    });

    expect(screen.getByText('Symphony No. 5')).toBeTruthy();
    expect(screen.getByText('Composed by: Beethoven')).toBeTruthy();
  });
});
