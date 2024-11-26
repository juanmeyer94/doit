"use client";

import { useState } from "react";
import Logo from "@/components/logo";
import TimerDisplay from "@/components/timer/timer-display";
import { DataInterface } from "@/interfaces/data.interface";
import CircularTimer from "@/components/timer/circularTimer";
import styles from "@/styles/page.module.css";
import ExercisesDND from "@/components/Excercises/DND/ExercisesDND";

export default function Home() {
  const [data, setData] = useState<DataInterface>({
    sessions: 3,
    exerciseTime: 45,
    exerciseRest: 15,
    currentSession: 1,
    restSessions: 1,
    restTime: 15,
    typeOfExercises: [
     
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleIncrement = (field: keyof DataInterface) => {
    setData((prevData) => ({
      ...prevData,
      [field]: (prevData[field] as number) + 1,
    }));
  };

  const handleDecrement = (field: keyof DataInterface) => {
    setData((prevData) => ({
      ...prevData,
      [field]: Math.max(0, (prevData[field] as number) - 1),
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div>

      <TimerDisplay
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
        handleInputChange={handleInputChange}
        data={data}
        />
        </div>
      <div className={styles.content}>
        <div className={styles.circularTimerContainer}>
          <CircularTimer data={data} />
        </div>
        <div className={styles.exercisesContainer}>
          <ExercisesDND
            typeOfExercises={data.typeOfExercises}
            setData={setData}
          />
        </div>
      </div>
    </div>
  );
}
