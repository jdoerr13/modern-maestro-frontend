import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UserProfile from './UserProfile';

// Mock the useUserContext hook
jest.mock('../auth/UserContext', () => ({
  useUserContext: () => ({
    user: {
      username: 'testuser',
      firstName: 'Test',
      user_id: 1,
    },
  }),
}));

describe('UserProfile', () => {
  it('renders the UserProfile component', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the essential elements are present
    expect(screen.getByText('User Profile')).not.toBeNull();
    expect(screen.getByText('Welcome, Test!')).not.toBeNull();
  });
});
