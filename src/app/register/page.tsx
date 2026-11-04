import Link from "next/link";
import Image from "next/image";
import { signup } from "../login/actions";
import styles from "../auth.module.css";
import { ArrowLeft } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const displayError =
    error === "fetch failed" || error === "NEXT_REDIRECT" ? null : error;

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
        
        <h1 className={styles.title}>Registro Oficial Sosa Kai</h1>
        <p className={styles.subtitle}>Crea tu cuenta de Sensei, Instructor o Tutor para acceder al portal.</p>

        {displayError && <div className={styles.errorBox}>{displayError}</div>}

        <form action={signup}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="userType">Tipo de Cuenta / Rol</label>
            <select 
              className={styles.input}
              id="userType"
              name="userType"
              defaultValue="sensei"
              style={{ background: '#131720', color: '#f8fafc', cursor: 'pointer' }}
            >
              <option value="sensei">🥋 Sensei / Instructor del Dojo</option>
              <option value="parent">👨‍👩‍👦 Padre o Tutor</option>
              <option value="student">🥋 Alumno / Karateka</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fullName">Nombre Completo del Sensei o Tutor</label>
            <input 
              className={styles.input}
              id="fullName" 
              name="fullName" 
              type="text" 
              placeholder="Ej. Sensei Adrian Silva o Carlos Mendoza"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="grade">Grado Marcial / Dan (Opcional)</label>
            <input 
              className={styles.input}
              id="grade" 
              name="grade" 
              type="text" 
              placeholder="Ej. Cinta Negra (4to Dan)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <input 
              className={styles.input}
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@correo.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Contraseña (Mínimo 6 caracteres)</label>
            <input 
              className={styles.input}
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Crear Cuenta
          </button>
        </form>

        <div className={styles.linkText}>
          ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
}
