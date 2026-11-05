import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";
import styles from "../auth.module.css";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const displayError =
    error === "NEXT_REDIRECT" || error === "fetch failed" ? null : error;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}></div>
      
      <div className={styles.authCard}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--dojo-white-dim)', marginBottom: '0.65rem', fontSize: '0.82rem' }}>
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image 
              src="/logo-sosa-kai.png" 
              alt="Sosa Kai Logo" 
              width={38} 
              height={38} 
              style={{ objectFit: 'contain', marginRight: '0.45rem' }}
              priority
            />
            <span>SOSA</span><span>KAI</span>
          </div>
        </div>
        
        <h1 className={styles.title}>Bienvenido a Sosa Kai</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales para continuar tu entrenamiento.</p>

        {displayError && <div className={styles.errorBox}>{displayError}</div>}

        <form action={login}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <input 
              className={styles.input}
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@email.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input 
              className={styles.input}
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Iniciar Sesión
          </button>
        </form>

        <p className={styles.footerText}>
          ¿No tienes una cuenta aún?{" "}
          <Link href="/register" className={styles.link}>
            Inscribirse al Dojo
          </Link>
        </p>
      </div>
    </div>
  );
}
