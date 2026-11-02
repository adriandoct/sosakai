"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, Shield, Award, Users } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      {/* Background ambient lighting */}
      <div className={styles.ambientGlowTop}></div>
      <div className={styles.ambientGlowCard}></div>

      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo-sosa-kai.png" 
              alt="Sosa Kai Logo" 
              width={42} 
              height={42} 
              priority
              className={styles.logoImg}
            />
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoWhite}>Sosa</span>
              <span className={styles.logoRed}>Kai</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="#metodologia" className={styles.navLink}>Metodología</Link>
            <Link href="#funciones" className={styles.navLink}>Funciones</Link>
            <Link href="#tarifas" className={styles.navLink}>Tarifas</Link>
          </nav>

          <div className={styles.authButtons}>
            <Link href="/login" className={styles.btnLogin}>
              Iniciar Sesión
            </Link>
            <Link href="/register" className={styles.btnRegister}>
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.mainTitle}>
            NUESTRO DOJO EN <span className={styles.titleRed}>ACCION</span>
          </h1>
          <p className={styles.mainSubtitle}>
            Mira una demostración del entrenamiento de Karate en nuestro dojo.<br className={styles.brDesktop} />
            Disciplina, técnica y valores en cada movimiento.
          </p>

          {/* Featured Card */}
          <div className={styles.showcaseCard}>
            {/* Left: Video / Image Presentation */}
            <div 
              className={styles.mediaContainer} 
              onClick={() => setIsVideoOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Reproducir video de presentación"
            >
              <Image 
                src="/karate-action.jpg" 
                alt="Demostración de Karate en el Dojo Shito-Ryu" 
                fill
                priority
                className={styles.mediaImage}
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className={styles.imageOverlay}></div>
              
              <div className={styles.playButtonWrapper}>
                <div className={styles.playButtonPulse}></div>
                <div className={styles.playButton}>
                  <Play size={24} fill="#ffffff" color="#ffffff" className={styles.playIcon} />
                </div>
              </div>

              <div className={styles.mediaBadgeBottom}>
                <span>🥋 Shito-Ryu Tradicional</span>
              </div>
            </div>

            {/* Right: Info Content */}
            <div className={styles.infoContent}>
              <div className={styles.badgePill}>
                VIDEO PRESENTACIÓN
              </div>

              <h2 className={styles.infoTitle}>
                Presentación del Dojo Shito-Ryu
              </h2>

              <p className={styles.infoDescription}>
                Una demostración de nuestra práctica habitual, que combina katas
                tradicionales con técnicas de combate y defensa personal adaptadas para
                todas las edades.
              </p>

              <div className={styles.featureHighlights}>
                <div className={styles.featureTag}>
                  <Shield size={16} className={styles.tagIcon} />
                  <span>Defensa Personal</span>
                </div>
                <div className={styles.featureTag}>
                  <Award size={16} className={styles.tagIcon} />
                  <span>Katas y Kumite</span>
                </div>
                <div className={styles.featureTag}>
                  <Users size={16} className={styles.tagIcon} />
                  <span>Todas las Edades</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  onClick={() => setIsVideoOpen(true)} 
                  className={styles.btnWatchDemo}
                >
                  <Play size={18} fill="currentColor" />
                  Ver Demostración
                </button>
                <Link href="/register" className={styles.btnClassSample}>
                  Clase de Prueba
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Video Modal Popup */}
      {isVideoOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsVideoOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseBtn} 
              onClick={() => setIsVideoOpen(false)}
              aria-label="Cerrar video"
            >
              <X size={24} />
            </button>
            <div className={styles.videoPlayerContainer}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/n4fCq7QdDks?autoplay=1&rel=0"
                title="Demostración Karate Shito Ryu Sosa Kai"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Subtle minimal bottom bar */}
      <footer className={styles.minimalFooter}>
        <p>© {new Date().getFullYear()} Sosa Kai • Dojo Shito-Ryu. Disciplina, respeto y superación.</p>
      </footer>
    </div>
  );
}
