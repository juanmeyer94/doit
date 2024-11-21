
import styles from "@/styles/DisplayTimer.module.css"
import TimerControls from "./timer-controls"
import { TimerDisplayProps } from "@/interfaces/timerDisplay.interface"


  export default function TimerDisplay({ handleDecrement, handleIncrement, handleInputChange, data}: TimerDisplayProps) {
  

    return (
        <div className={styles.timerDisplay}>
            <div className={styles.configGrid}>
                <TimerControls
                    label="Cantidad"
                    sublabel="Sesiones"
                    value={data.sessions}
                    name="sessions"
                    onChange={handleInputChange}
                    onIncrement={() => handleIncrement('sessions')}
                    onDecrement={() => handleDecrement('sessions')}
                />
                
                <TimerControls
                    label="Segundos"
                    sublabel="Ejercicio"
                    value={data.exerciseTime}
                    name="exerciseTime"
                    onChange={handleInputChange}
                    onIncrement={() => handleIncrement('exerciseTime')}
                    onDecrement={() => handleDecrement('exerciseTime')}
                />
                <TimerControls
                    label="Segundos"
                    sublabel="Descanso entre ejercicios"
                    value={data.exerciseRest}
                    name="exerciseRest"
                    onChange={handleInputChange}
                    onIncrement={() => handleIncrement('exerciseRest')}
                    onDecrement={() => handleDecrement('exerciseRest')}
                />
                <TimerControls
                    label="Minutos"
                    sublabel="Descanso entre sesiones"
                    value={data.restSessions}
                    name="restSessions"
                    onChange={handleInputChange}
                    onIncrement={() => handleIncrement('restSessions')}
                    onDecrement={() => handleDecrement('restSessions')}
                />
            </div>
           
        </div>
    )
}