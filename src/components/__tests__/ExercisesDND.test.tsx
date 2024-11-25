import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ExercisesDND from '../Excercises/DND/ExercisesDND';

// Mock the DnD components
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@dnd-kit/sortable', () => ({
  ...jest.requireActual('@dnd-kit/sortable'),
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ExercisesDND', () => {
  const mockSetData = jest.fn();
  const initialExercises = ['Push-ups', 'Squats', 'Lunges'];

  const setup = (exercises = initialExercises) => {
    return render(
      <ExercisesDND
        typeOfExercises={exercises}
        setData={mockSetData}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial exercises', () => {
    setup();
    expect(screen.getByText('Ejercicios')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Agregar un nuevo ejercicio')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
    initialExercises.forEach(exercise => {
      expect(screen.getByText(exercise)).toBeInTheDocument();
    });
  });

  it('adds a new exercise when the form is submitted', async () => {
    setup();
    const input = screen.getByPlaceholderText('Agregar un nuevo ejercicio');
    const addButton = screen.getByText('Agregar');

    await userEvent.type(input, 'Burpees');
    await userEvent.click(addButton);

    expect(mockSetData).toHaveBeenCalledWith(expect.any(Function));
    const setDataCallback = mockSetData.mock.calls[0][0];
    const result = setDataCallback({ typeOfExercises: initialExercises });
    expect(result.typeOfExercises).toEqual([...initialExercises, 'Burpees']);
  });

  it('does not add an empty exercise', async () => {
    setup();
    const addButton = screen.getByText('Agregar');

    await userEvent.click(addButton);

    expect(mockSetData).not.toHaveBeenCalled();
  });

  it('deletes an exercise when delete button is clicked', async () => {
    setup();
    const deleteButtons = screen.getAllByText('Eliminar');
    await userEvent.click(deleteButtons[0]);

    expect(mockSetData).toHaveBeenCalledWith(expect.any(Function));
    const setDataCallback = mockSetData.mock.calls[0][0];
    const result = setDataCallback({ typeOfExercises: initialExercises });
    expect(result.typeOfExercises).toEqual(['Squats', 'Lunges']);
  });
});

