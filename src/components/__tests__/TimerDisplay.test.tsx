import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimerDisplay from '../timer/timer-display';
// Mock props
const mockData = {
    sessions: 3,
    exerciseTime: 45,
    exerciseRest: 15,
    currentSession: 1,
    restSessions: 1,
    restTime: 15,
    typeOfExercises: ["push-up", "squads"],
};

const mockHandleInputChange = jest.fn();
const mockHandleIncrement = jest.fn();
const mockHandleDecrement = jest.fn();

describe('TimerDisplay', () => {
  it('renders all 4 timer controls with correct labels and values', () => {
    render(
      <TimerDisplay
        handleDecrement={mockHandleDecrement}
        handleIncrement={mockHandleIncrement}
        handleInputChange={mockHandleInputChange}
        data={mockData}
      />
    );

    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('Sesiones')).toBeInTheDocument();
    expect(screen.getByText('Ejercicio')).toBeInTheDocument();
    expect(screen.getByText('Descanso entre ejercicios')).toBeInTheDocument();
    expect(screen.getByText('Minutos')).toBeInTheDocument();
    expect(screen.getByText('Descanso entre sesiones')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('calls the increment and decrement handlers when buttons are clicked', () => {
    render(
      <TimerDisplay
        handleDecrement={mockHandleDecrement}
        handleIncrement={mockHandleIncrement}
        handleInputChange={mockHandleInputChange}
        data={mockData}
      />
    );

    const incrementButtons = screen.getAllByRole('button', { name: '+' });
    fireEvent.click(incrementButtons[0]); 
    fireEvent.click(incrementButtons[1]);

    expect(mockHandleIncrement).toHaveBeenCalledTimes(2);

    const decrementButtons = screen.getAllByRole('button', { name: '-' });
    fireEvent.click(decrementButtons[0]);

    expect(mockHandleDecrement).toHaveBeenCalledTimes(1);
  });

  it('calls handleInputChange when values are changed', () => {
    render(
      <TimerDisplay
        handleDecrement={mockHandleDecrement}
        handleIncrement={mockHandleIncrement}
        handleInputChange={mockHandleInputChange}
        data={mockData}
      />
    );
    const sessionInput = screen.getByDisplayValue('3');
    fireEvent.change(sessionInput, { target: { value: '4' } });

    expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
    expect(mockHandleInputChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
