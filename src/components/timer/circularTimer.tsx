import { useEffect, useState, useRef, useCallback } from "react";
import styles from "@/styles/CircularTimer.module.css";
import { DataInterface } from "@/interfaces/data.interface";

interface CircularTimerProps {
  data: DataInterface;
}

type Phase = {
  duration: number;
  label: string;
  type: "exercise" | "exerciseRest" | "sessionRest";
};

export default function CircularTimer({ data }: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<Phase>();
  const [currentSession, setCurrentSession] = useState(1);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isCycleComplete, setIsCycleComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const isPausedRef = useRef(isPaused);
  const timeLeftRef = useRef(timeLeft);
  const currentPhaseRef = useRef<Phase | undefined>();
  const cyclePromiseRef = useRef<Promise<void> | null>(null);
  const cycleResolveRef = useRef<(() => void) | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getColor = () => {
    if (timeLeft <= 5) return styles.red;
    if (!currentPhase) return styles.defaultColor;
    switch (currentPhase.type) {
      case "exercise":
        return styles.green;
      case "exerciseRest":
        return styles.blue;
      case "sessionRest":
        return styles.blue;
      default:
        return styles.defaultColor;
    }
  };

  const startInterval = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = window.setInterval(() => {
      if (isPausedRef.current) return;

      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        timeLeftRef.current = newTimeLeft;

        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setProgress(100);
          return 0;
        }

        const initialTime = currentPhaseRef.current?.duration || 0;
        setProgress((100 * (initialTime - newTimeLeft)) / initialTime);

        return newTimeLeft;
      });
    }, 1000);
  }, []);

  const runPhase = useCallback(
    (phase: Phase) => {
      return new Promise<void>((resolve) => {
        setCurrentPhase(phase);
        currentPhaseRef.current = phase;
        setTimeLeft(phase.duration);
        timeLeftRef.current = phase.duration;
        setProgress(0);
        startInterval();

        const checkCompletion = setInterval(() => {
          if (timeLeftRef.current <= 0) {
            clearInterval(checkCompletion);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            resolve();
          }
        }, 100);
      });
    },
    [startInterval]
  );

  const startCycle = useCallback(async () => {
    for (let session = 1; session <= data.sessions; session++) {
      setCurrentSession(session);

      for (
        let exerciseIndex = 0;
        exerciseIndex < data.typeOfExercises.length;
        exerciseIndex++
      ) {
        setCurrentExercise(exerciseIndex);

        if (isPausedRef.current) {
          await new Promise<void>((resolve) => {
            cycleResolveRef.current = resolve;
          });
        }

        await runPhase({
          duration: data.exerciseTime,
          label: `Ejercicio: ${data.typeOfExercises[exerciseIndex]} (${
            exerciseIndex + 1
          }/${data.typeOfExercises.length})`,
          type: "exercise",
        });

        if (
          exerciseIndex < data.typeOfExercises.length - 1 ||
          session < data.sessions
        ) {
          await runPhase({
            duration: data.exerciseRest,
            label: "Descanso entre ejercicios",
            type: "exerciseRest",
          });
        }
      }

      if (session < data.sessions) {
        await runPhase({
          duration: data.restSessions * 60,
          label: `Descanso entre sesiones (Iniciando sesión: ${session + 1})`,
          type: "sessionRest",
        });
      }
    }
    setIsCycleComplete(true);
    setIsRunning(false);
    onComplete();
  }, [data, runPhase]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;
    cyclePromiseRef.current = startCycle();
  }, [startCycle]);

  const handlePause = useCallback(() => {
    setIsPaused((prevIsPaused) => {
      const newIsPaused = !prevIsPaused;
      isPausedRef.current = newIsPaused;
      if (newIsPaused) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        startInterval();
        if (cycleResolveRef.current) {
          cycleResolveRef.current();
          cycleResolveRef.current = null;
        }
      }
      return newIsPaused;
    });
  }, [startInterval]);

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  const onComplete = () => {
    setIsRunning(false);
    alert("¡Entrenamiento completado!");
  };

  useEffect(() => {
    isPausedRef.current = isPaused;
    timeLeftRef.current = timeLeft;
  }, [isPaused, timeLeft]);

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timer}>
        {!isPaused && isRunning ? (
          <>
            <svg className={styles.svg} viewBox="0 0 100 100">
              <circle className={styles.progressTrack} cx="50" cy="50" r="45" />
              <circle
                data-testid="progress-circle"
                className={`${styles.progressFill} ${getColor()}`}
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${
                    2 * Math.PI * 45 * (1 - progress / 100)
                  }`,
                }}
              />
            </svg>
            <div className={styles.display}>
              <div className={styles.time}>{formatTime(timeLeft)}</div>
              <div className={styles.label}>{currentPhase?.label}</div>
            </div>
          </>
        ) : (
          <div className={styles.paused}>
            <svg className={styles.pausedSvg} viewBox="0 0 100 100">
              <circle className={styles.progressTrack} cx="50" cy="50" r="45" />
              <rect x="25" y="20" width="10" height="60" fill="white" />
              <rect x="65" y="20" width="10" height="60" fill="white" />
            </svg>
            <p className={styles.pausedMessage}>EN PAUSA</p>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p>
          Sesión: {currentSession} / {data.sessions}
        </p>
        <p>
          Ejercicio: {currentExercise + 1} / {data.typeOfExercises.length}
        </p>
      </div>
      {isCycleComplete && (
        <p className={styles.completeMessage}>¡Ciclo completo!</p>
      )}
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleStart}
          disabled={isRunning && !isPaused}
        >
          Iniciar
        </button>
        <button
          className={styles.button}
          onClick={handlePause}
          disabled={!isRunning || isCycleComplete}
        >
          {isPaused ? "Reanudar" : "Pausar"}
        </button>
        <button className={styles.button} onClick={handleReset}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
