import Link from "next/link";

import styles from "@/pages.components/index/styles.module.scss";

export default function Home() {
  return (
    <div>
      <h1 className={styles.page_heading}>Hello world!</h1>
      <Link href="/login">
        <button className={styles.connect_button}>Connect</button>
      </Link>
    </div>
  );
}
