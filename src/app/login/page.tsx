import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";
import styles from "../auth.module.css";
import { ArrowLeft, ShieldCheck, Key } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const displayError = error === "NEXT_REDIRECT" ? null : error;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}></div>
      
      <div className={styles.authCard}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dojo-white-dim)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image 
              src="/logo-sosa-kai.png" 
              alt="Sosa Kai Logo" 
              width={48} 
              height={48} 
              style={{ objectFit: 'contain', marginRight: '0.5rem' }}
              priority
            />
            <span>SOSA</span><span>KAI</span>
          </div>
        </div>
        
        <h1 className={styles.title}>Bienvenido a Sosa Kai</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales para continuar tu entrenamiento.</p>

        {/* Credentials Reminder Box */}
        <div style={{
          background: 'rgba(230, 0, 38, 0.08)',
          border: '1px solid rgba(230, 0, 38, 0.25)',
          borderRadius: '12px',
          padding: '0.9rem 1rem',
          margin: '1.25rem 0 1.5rem 0',
          fontSize: '0.85rem',
          color: '#cbd5e1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
            <Key size={16} color="#e60026" />
            <span>Credenciales Oficiales de Acceso:</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontFamily: 'monospace', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Super Admin:</span> <strong style={{ color: '#fff' }}>superadmin@admin.com</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Admin Dojo:</span> <strong style={{ color: '#fff' }}>admin@admin.com</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Contraseña:</span> <strong style={{ color: '#ff4d6d' }}>12345678Cecyte</strong>
            </div>
          </div>
        </div>

        {displayError && <div className={styles.errorBox}>{displayError}</div>}

        <form action={login}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <input 
              className={styles.input}
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@admin.com"
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
              placeholder="12345678Cecyte"
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
