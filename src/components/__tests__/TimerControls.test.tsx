import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimerControls from '../timer/timer-controls';

describe('TimerControls', () => {
  const mockProps = {
    label: 'Test Label',
    sublabel: 'Test Sublabel',
    value: 5,
    name: 'testName',
    onChange: jest.fn(),
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  it('renders correctly with given props', () => {
    render(<TimerControls {...mockProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Sublabel')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue(5);
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<TimerControls {...mockProps} />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: '10' } });

    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('calls onIncrement when + button is clicked', () => {
    render(<TimerControls {...mockProps} />);
    const incrementButton = screen.getByRole('button', { name: '+' });

    fireEvent.click(incrementButton);

    expect(mockProps.onIncrement).toHaveBeenCalled();
  });

  it('calls onDecrement when - button is clicked', () => {
    render(<TimerControls {...mockProps} />);
    const decrementButton = screen.getByRole('button', { name: '-' });

    fireEvent.click(decrementButton);

    expect(mockProps.onDecrement).toHaveBeenCalled();
  });
});