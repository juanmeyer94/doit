import { useEffect, useState, useRef } from "react";
import styles from "@/styles/CircularTimer.module.css";
import { DataInterface } from "@/interfaces/data.interface";

interface CircularTimerProps {
  data: DataInterface;
}

export default function CircularTimer({ data }: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState("");
  const [currentSession, setCurrentSession] = useState(1);
  const [isCycleComplete, setIsCycleComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const isPausedRef = useRef(isPaused);
  const timeLeftRef = useRef(timeLeft);
  const currentPhaseRef = useRef<{ duration: number; label: string } | null>(
    null
  );

  // Utils
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getColor = () => {
    if (timeLeft <= 5) return styles.red;
    if (stageLabel.includes("Descanso entre sesiones")) {
      return styles.blue;
    }
    switch (stageLabel.split(":")[0]) {
      case "Ejercicio":
        return styles.green;
      case "Descanso entre ejercicios":
        return styles.orange;
      default:
        return styles.defaultColor;
    }
  };

  // Funciones de control del temporizador
  const startInterval = () => {
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
  };

  const runPhase = (duration: number, label: string) => {
    return new Promise<void>((resolve) => {
      setStageLabel(label);
      setTimeLeft(duration);
      timeLeftRef.current = duration;
      currentPhaseRef.current = { duration, label };
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
  };

  const startCycle = async () => {
    for (let session = 1; session <= data.sessions; session++) {
      setCurrentSession(session);

      for (
        let exerciseIndex = 0;
        exerciseIndex < data.typeOfExercises.length;
        exerciseIndex++
      ) {
        if (isPausedRef.current) {
          await new Promise<void>((resolve) => {
            const checkPaused = setInterval(() => {
              if (!isPausedRef.current) {
                clearInterval(checkPaused);
                resolve();
              }
            }, 100);
          });
        }

        await runPhase(
          data.exerciseTime,
          `Ejercicio: ${data.typeOfExercises[exerciseIndex]} (${
            exerciseIndex + 1
          }/${data.typeOfExercises.length})`
        );
        await runPhase(data.exerciseRest, "Descanso entre ejercicios");
      }

      if (session < data.sessions) {
        await runPhase(
          data.restSessions * 60,
          `Descanso entre sesiones (Sesión ${session + 1})`
        );
      }
    }
    setIsCycleComplete(true);
    setIsRunning(false);
    onComplete();
  };

  //Funciones de los Botones de inicio, pausa/reanudar y reinicio.
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;
    startCycle();
  };

  const handlePause = () => {
    setIsPaused((prevIsPaused) => {
      if (prevIsPaused) {
        startInterval();
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return !prevIsPaused;
    });
  };

  const handleReset = () => {
    setTimeLeft(0);
    setProgress(0);
    setStageLabel("");
    setCurrentSession(1);
    setIsCycleComplete(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentPhaseRef.current = null;
  };

  const handleResetButton = () => {
    handleReset();
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
  };

  // Función de finalización
  const onComplete = () => {
    setIsRunning(false);
    alert("¡Entrenamiento completado!");
  };

  // Efect
  useEffect(() => {
    isPausedRef.current = isPaused;
    timeLeftRef.current = timeLeft;
  }, [isPaused, isRunning, timeLeft]);

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timer}>
        {!isPaused && isRunning ? (
          <>
            <svg className={styles.svg} viewBox="0 0 100 100">
              <circle className={styles.progressTrack} cx="50" cy="50" r="45" />
              <circle
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
              <div className={styles.label}>{stageLabel}</div>
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
        <button className={styles.button} onClick={handleResetButton}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
