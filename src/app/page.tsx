import Link from 'next/link'
import styles from '@/styles/landing.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>DO-IT Timer</h1>
        <p className={styles.subtitle}>
          Optimiza tus entrenamientos funcionales con nuestro temporizador personalizable.
          Perfecto para ejercicios Funcional, CrossFit y rutinas basadas en ciclos.
        </p>
        <Link href="/timer" className={styles.ctaButton}>
          Comenzar Entrenamiento
        </Link>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Temporizador Personalizable</h2>
            <p className={styles.featureDescription}>
              Configura tiempos de ejercicio y descanso según tus necesidades específicas.
              Adapta el timer a cualquier tipo de entrenamiento.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Gestión de Ejercicios</h2>
            <p className={styles.featureDescription}>
              Organiza y personaliza tu rutina de ejercicios fácilmente.
              Añade, elimina y reordena ejercicios según tu plan de entrenamiento.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Diseño Responsive</h2>
            <p className={styles.featureDescription}>
              Accede desde cualquier dispositivo. Diseñado para funcionar perfectamente
              en tu teléfono, tablet o computadora.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Listo para entrenar?</h2>
        <p className={styles.ctaText}>
          Únete a los atletas que ya están mejorando sus entrenamientos con DO-IT Timer
        </p>
        <Link href="/timer" className={styles.ctaButton}>
          Comenzar Ahora
        </Link>
      </section>
    </div>
  )
}

