import type { Metadata } from "next";
import "@/app/global.css"

export const metadata: Metadata = {
  title: "DO IT - Tu mejor temporizador",
  description: "Temprizador de ejercicios basados en ciclos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const footerStyle: React.CSSProperties = {
    marginTop: '-40px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    padding: '10px 0',
    borderTop: '1px solid #ddd',
};

const linkStyle: React.CSSProperties = {
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: 'bold',
};

  return (
    <html lang="es">
      <body >
        {children}
         <footer style={footerStyle}>
            <span>Desarrollado por </span>
            <a 
                href="https://www.linkedin.com/in/juan-meyer-9b34a5269/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={linkStyle}
            >
                Juan Meyer
            </a>
        </footer>
      </body>
    </html>
  );
}
