import styles from "./styles.module.scss";

interface SpinnerProps {
  sm?: boolean;
}

export function Spinner({ sm }: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${sm && styles.small}`} />
  );
}