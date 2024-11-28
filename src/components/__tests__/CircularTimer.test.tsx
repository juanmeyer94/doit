import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CircularTimer from "../timer/circularTimer";

const mockData = {
  sessions: 3,
  exerciseTime: 45,
  exerciseRest: 15,
  currentSession: 1,
  restSessions: 1,
  restTime: 15,
  typeOfExercises: ["push-up", "squads"],
};

describe("CircularTimer", () => {
  const originalLocation = window.location;

  beforeAll(() => {
    
    window.location = { ...originalLocation, reload: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const advanceTimeAndUpdate = async (time: number) => {
    await act(async () => {
      jest.advanceTimersByTime(time);
    });
  };

  it("renders without crashing", () => {
    render(<CircularTimer data={mockData} />);
    expect(screen.getByText("Iniciar")).toBeInTheDocument();
  });

  it("displays correct initial session and exercise information", () => {
    render(<CircularTimer data={mockData} />);
    expect(screen.getByText("Sesión: 1 / 3")).toBeInTheDocument();
    expect(screen.getByText("Ejercicio: 1 / 2")).toBeInTheDocument();
  });

  it("has start, pause, and reset buttons", () => {
    render(<CircularTimer data={mockData} />);
    expect(screen.getByText("Iniciar")).toBeInTheDocument();
    expect(screen.getByText("Pausar")).toBeInTheDocument();
    expect(screen.getByText("Reiniciar")).toBeInTheDocument();
  });

  it("starts the timer when the start button is clicked", async () => {
    render(<CircularTimer data={mockData} />);
    fireEvent.click(screen.getByText("Iniciar"));
    await advanceTimeAndUpdate(1000);
    expect(screen.getByText("0:44")).toBeInTheDocument();
    expect(screen.getByText("Ejercicio: push-up (1/2)")).toBeInTheDocument();
  });

  it("pauses and resumes the timer", async () => {
    render(<CircularTimer data={mockData} />);
    fireEvent.click(screen.getByText("Iniciar"));
    await advanceTimeAndUpdate(5000);

    fireEvent.click(screen.getByText("Pausar"));
    expect(screen.getByText("EN PAUSA")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reanudar"));
    expect(screen.queryByText("EN PAUSA")).not.toBeInTheDocument();
  });

  it("mocks window.location.reload", () => {

    const originalLocation = { ...window.location };
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, reload: jest.fn() },
    });

    expect(window.location.reload).not.toHaveBeenCalled();
    window.location.reload();
    expect(window.location.reload).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  it("changes color based on phase", async () => {
    render(<CircularTimer data={mockData} />);
    fireEvent.click(screen.getByText("Iniciar"));

    const progressCircle = screen.getByTestId("progress-circle");
    expect(progressCircle).toHaveClass("progressFill", "green");

    await advanceTimeAndUpdate(mockData.exerciseTime * 1000 - 1000);
    expect(progressCircle).toHaveClass("progressFill", "red");
  });
});
