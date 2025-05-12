//components 종류 : client component, server component
//[client component 안에는 server component 사용 불가], [server component 안에는 client component 사용 가능]

//use client : client에서 js를 적용한다는 표시 (필요한 것만 사용) [client component 적용]
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/navigation.module.css";

export default function Navigation() {
  const path = usePathname();

  return (
    <div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">Home</Link> {path === "/" ? "*" : ""}
          </li>
          <li>
            <Link href="/about-us">About Us</Link>{" "}
            {path === "/about-us" ? "*" : ""}
          </li>
        </ul>
      </nav>
    </div>
  );
}
