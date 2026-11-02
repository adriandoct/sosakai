"use client";

import styles from "../dashboard.module.css";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  AlertTriangle,
  Bell,
  Search,
  BrainCircuit,
  MessageCircleWarning
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion, Variants } from 'framer-motion';

const dataIngresos = [
  { name: 'Ene', ingresos: 4000, meta: 2400 },
  { name: 'Feb', ingresos: 3000, meta: 1398 },
  { name: 'Mar', ingresos: 2000, meta: 9800 },
  { name: 'Abr', ingresos: 2780, meta: 3908 },
  { name: 'May', ingresos: 1890, meta: 4800 },
  { name: 'Jun', ingresos: 2390, meta: 3800 },
  { name: 'Jul', ingresos: 3490, meta: 4300 },
];

const dataRiesgo = [
  { name: 'Grado 1', riesgo: 12 },
  { name: 'Grado 2', riesgo: 8 },
  { name: 'Grado 3', riesgo: 15 },
  { name: 'Grado 4', riesgo: 5 },
  { name: 'Grado 5', riesgo: 2 },
  { name: 'Grado 6', riesgo: 18 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardPage() {
  return (
    <motion.div 
      className="animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className={styles.topbar}>
        <div className={styles.greeting}>
          <h1>Dashboard Ejecutivo</h1>
          <p>Métricas de la institución en tiempo real.</p>
        </div>
        
        <div className={styles.topActions}>
          <div className={styles.actionBtn}>
            <Search size={20} />
          </div>
          <div className={styles.actionBtn}>
            <Bell size={20} />
          </div>
          <button className="btn-primary">Generar Reporte IA</button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Alumnos</span>
            <div className={`${styles.metricIcon} ${styles.blue}`}>
              <Users size={24} />
            </div>
          </div>
          <div className={styles.metricValue}>1,248</div>
          <div className={`${styles.metricTrend} ${styles.up}`}>
            <TrendingUp size={16} />
            <span>+12% este mes</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Asistencia Diaria</span>
            <div className={`${styles.metricIcon} ${styles.green}`}>
              <Users size={24} />
            </div>
          </div>
          <div className={styles.metricValue}>96.4%</div>
          <div className={`${styles.metricTrend} ${styles.up}`}>
            <TrendingUp size={16} />
            <span>+2.1% hoy</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Materias Activas</span>
            <div className={`${styles.metricIcon} ${styles.gold}`}>
              <BookOpen size={24} />
            </div>
          </div>
          <div className={styles.metricValue}>42</div>
          <div className={`${styles.metricTrend} ${styles.up}`}>
            <TrendingUp size={16} />
            <span>+3 nuevas curriculas</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Incidencias Abiertas</span>
            <div className={`${styles.metricIcon} ${styles.red}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className={styles.metricValue}>8</div>
          <div className={`${styles.metricTrend} ${styles.down}`}>
            <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>-5 respecto ayer</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={styles.panelsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Comparativa de Ingresos</h3>
            <select className="card-select" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'}}>
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataIngresos}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="var(--brand-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Alumnos en Riesgo</h3>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRiesgo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  cursor={{fill: 'var(--bg-tertiary)'}}
                />
                <Bar dataKey="riesgo" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={styles.panelsGrid}>
        <div className={styles.aiExecutiveWidget}>
          <div className={styles.aiWidgetHeader}>
            <BrainCircuit size={24} />
            <span>Asistente IA SOSA KAI</span>
          </div>
          <div className={styles.aiWidgetContent}>
            He detectado un aumento del 15% en retardos en el grupo 3°B durante esta semana. Además, hay 12 alumnos con riesgo de reprobación en Matemáticas Avanzadas. Te sugiero enviar un aviso a padres y agendar tutorías virtuales.
          </div>
          <button className={styles.aiWidgetBtn}>Verificar Alertas</button>
        </div>

        <div className={styles.chartCard} style={{ padding: '1.5rem' }}>
          <div className={styles.cardHeader}>
            <h3>Incidencias Recientes</h3>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <MessageCircleWarning size={20} />
              </div>
              <div className={styles.activityDetails}>
                <h4>Citatorio enviado a familia López</h4>
                <p>Hace 2 horas</p>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <AlertTriangle size={20} />
              </div>
              <div className={styles.activityDetails}>
                <h4>Falla en registro biométrico</h4>
                <p>Hace 4 horas • Acceso Norte</p>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <Bell size={20} />
              </div>
              <div className={styles.activityDetails}>
                <h4>Notificación de pago recibido</h4>
                <p>Hace 5 horas • 15 pagos procesados</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
