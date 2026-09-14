import { Icon } from "@/components/Icon/Icon";
import styles from "./AuthScreen.module.css";

const POINTS = [
  {
    icon: "budget" as const,
    title: "Jeden budżet",
    text: "Widzisz, ile jeszcze zostaje na płytki, AGD i robociznę.",
  },
  {
    icon: "rooms" as const,
    title: "Dom strefami",
    text: "Kuchnia, łazienka, salon — każda izba ma swoją listę.",
  },
  {
    icon: "piggy" as const,
    title: "Bez przekroczenia",
    text: "Odkładasz luksusy, gdy rezerwa zaczyna się kurczyć.",
  },
];

type AuthScreenProps = {
  children: React.ReactNode;
};

export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <div className={styles.wrap}>
      <section className={styles.story} aria-label="O aplikacji">
        <div className={styles.collage}>
          <img
            className={styles.heroPhoto}
            src="/auth/hero-interior.png"
            alt="Wnętrze domu w trakcie wykończenia: tynk, płytki i światło z okna."
          />
          <img
            className={styles.planPhoto}
            src="/auth/floorplan.png"
            alt="Rzut domu: kuchnia, salon, łazienka, sypialnia i garaż."
          />
        </div>

        <p className={styles.kicker}>Pracownia wykończenia</p>
        <h1 className={styles.title}>Zmieść się w budżecie, zanim wpadnie ekipa.</h1>
        <p className={styles.lead}>
          Dom w budżecie pilnuje wykończenia: planowane zakupy, to co już kupione
          i ile jeszcze zostaje, zanim ruszysz rezerwę.
        </p>

        <ul className={styles.points}>
          {POINTS.map((point) => (
            <li key={point.title}>
              <span className={styles.glyph} aria-hidden="true">
                <Icon name={point.icon} size={18} />
              </span>
              <div>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.form} aria-label="Logowanie">
        {children}
      </section>
    </div>
  );
}
