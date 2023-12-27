// Tile component
import {ReactNode} from "react";
import styles from "./Tile.module.css";

interface TileProps {
  title: string;
  href?: string;
  children: ReactNode;
}

export const Tile: React.FC<TileProps> = ({ title, href, children }) => {

  const tileContent = (
    <div className={styles.tile}>
      <div className={styles.tileTitle}>{title}</div>
      <div className={styles.tileBody}>{children}</div>
    </div>
  );

  if (href) {
    return (
      <a href={href}>
        { tileContent }
      </a>
    );
    return tileContent;
  }
};
