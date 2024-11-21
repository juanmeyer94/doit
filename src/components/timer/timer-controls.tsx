import styles from "@/styles/TimerControls.module.css";

interface TimerControlsProps {
    label: string
    sublabel: string
    value: number
    name: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onIncrement: () => void
    onDecrement: () => void
}

export default function TimerControls({
    label,
    sublabel,
    value,
    name,
    onChange,
    onIncrement,
    onDecrement,
}: TimerControlsProps) {
    return (
        <div className={styles.timercontrol}>
            <div className={styles.valuecontainer}>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={styles.valueinput}
                />
                <div className={styles.labels}>
                    <span className={styles.mainlabel}>{label}</span>
                    <span className={styles.sublabel}>{sublabel}</span>
                </div>
            </div>
            <div className={styles.buttons}>
                <button onClick={onIncrement} className={styles.controlbtn}>+</button>
                <button onClick={onDecrement} className={styles.controlbtn}>-</button>
            </div>
           
        </div>
    )
}