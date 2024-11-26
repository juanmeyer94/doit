import { Inter } from "next/font/google";
import Link from "next/link";

import "@/app/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DO-IT - Timer para Entrenamientos Funcionales",
  description:
    "Timer personalizable para entrenamientos funcionales, CrossFit y rutinas basadas en ciclos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header>
          <div className="container">
            <Link href="/">
              <span>DO-IT</span>
            </Link>
            <nav>
              <div>
                <Link href="/timer">
                  <button>Timer</button>
                </Link>
              </div>
              <div>
                <Link
                  href="https://github.com/juanmeyer94/doit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button>GitHub</button>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {children}
        <footer>
          <span>Desarrollado por </span>
          <a
            href="https://www.linkedin.com/in/juan-meyer-9b34a5269/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Juan Meyer{" "}
          </a>
        </footer>
      </body>
    </html>
  );
}
