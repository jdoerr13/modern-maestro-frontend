import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CompositionList from './CompositionList';
import ModernMaestroApi from '../api/api';

jest.mock('../api/api', () => ({
  getCompositions: jest.fn(),
}));

const mockCompositions = [
  {
    composition_id: 1,
    title: 'Symphony No. 5',
    Composer: {
      name: 'Beethoven'
    }
  },
  {
    composition_id: 2,
    title: 'Eine kleine Nachtmusik',
    Composer: {
      name: 'Mozart'
    }
  }
];

describe('CompositionList', () => {
  beforeEach(() => {
    ModernMaestroApi.getCompositions.mockResolvedValue(mockCompositions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches compositions', async () => {
    render(
      <MemoryRouter initialEntries={['/compositions']}>
        <Routes>
          <Route path="/compositions" element={<CompositionList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ModernMaestroApi.getCompositions).toHaveBeenCalled();
    });

    expect(screen.getByText('Compositions')).toBeTruthy();
    expect(screen.getByText('Symphony No. 5 by Beethoven')).toBeTruthy();
    expect(screen.getByText('Eine kleine Nachtmusik by Mozart')).toBeTruthy();
  });

  it('filters compositions based on search term', async () => {
    render(
      <MemoryRouter initialEntries={['/compositions']}>
        <Routes>
          <Route path="/compositions" element={<CompositionList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ModernMaestroApi.getCompositions).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByPlaceholderText(/search compositions/i), { target: { value: 'symphony' } });

    expect(screen.getByText('Symphony No. 5 by Beethoven')).toBeTruthy();
    expect(screen.queryByText('Eine kleine Nachtmusik by Mozart')).toBeNull();
  });

  it('displays error message when fetching compositions fails', async () => {
    ModernMaestroApi.getCompositions.mockRejectedValue(new Error('Failed to fetch compositions'));

    render(
      <MemoryRouter initialEntries={['/compositions']}>
        <Routes>
          <Route path="/compositions" element={<CompositionList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ModernMaestroApi.getCompositions).toHaveBeenCalled();
    });

    expect(screen.getByText(/error: failed to fetch compositions/i)).toBeTruthy();
  });
});
