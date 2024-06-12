import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateProfileForm from './UpdateProfileForm';

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

const mockUpdateUserProfile = jest.fn();

describe('UpdateProfileForm', () => {
  beforeEach(() => {
    render(<UpdateProfileForm contextUser={mockUser} updateUserProfile={mockUpdateUserProfile} />);
  });

  it('renders the form with initial state', () => {
    //add more here*
  });

  it('toggles edit mode for a field', () => {
    fireEvent.click(screen.getAllByText('Edit')[0]); 
  });

  it('updates a field', async () => {
    fireEvent.click(screen.getAllByText('Edit')[0]); // Click the first Edit button (Email)
    fireEvent.change(screen.getByDisplayValue('test@example.com'), { target: { value: 'new@example.com' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(mockUpdateUserProfile).toHaveBeenCalledWith({ email: 'new@example.com' }));
  });
});
