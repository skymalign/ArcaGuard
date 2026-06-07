export type RiskLevel = 'Alto' | 'Medio' | 'Bajo';

export interface Cliente {
  id: string;
  nombre: string;
  score: number;
  riesgo: RiskLevel;
  inactividad: string;
  inactividadFecha: string;
  cambio: number;
  territorio: string;
  subcanalMarca: string;
  segmento: string;
  revenue: string;
}

export const CLIENTES: Cliente[] = [
  { id: 'CLI-001', nombre: 'Tienda La Esperanza',          score: 87, riesgo: 'Alto',  inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -45, territorio: 'Monterrey',        subcanalMarca: 'Coca-Cola',      segmento: 'Tradicional',   revenue: '$125K' },
  { id: 'CLI-002', nombre: 'Super Abarrotes El Güero',     score: 92, riesgo: 'Alto',  inactividad: '4 meses', inactividadFecha: '2026-02-06', cambio: -62, territorio: 'Saltillo',         subcanalMarca: 'Monster Energy', segmento: 'Mayoreo',       revenue: '$340K' },
  { id: 'CLI-003', nombre: 'Restaurante Los Arcos',        score: 78, riesgo: 'Alto',  inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -38, territorio: 'Guadalajara',      subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$95K'  },
  { id: 'CLI-004', nombre: 'Tienda 3B Reforma',            score: 65, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -25, territorio: 'Mesa Central',      subcanalMarca: 'Jugos Del Valle', segmento: 'Moderno',       revenue: '$78K'  },
  { id: 'CLI-005', nombre: 'Oxxo Satélite',                score: 71, riesgo: 'Medio', inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -31, territorio: 'Monterrey',        subcanalMarca: 'Powerade',       segmento: 'Conveniencia',  revenue: '$156K' },
  { id: 'CLI-006', nombre: 'Minisuper Doña Mary',          score: 58, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -19, territorio: 'San Luis Potosí',   subcanalMarca: 'Coca-Cola',      segmento: 'Tradicional',   revenue: '$45K'  },
  { id: 'CLI-007', nombre: 'Restaurante Taquería El Tizoncito', score: 82, riesgo: 'Alto', inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -42, territorio: 'Aguascalientes', subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$112K' },
  { id: 'CLI-008', nombre: 'Soriana Express',              score: 48, riesgo: 'Medio', inactividad: '0 meses', inactividadFecha: '2026-05-28', cambio: -12, territorio: 'Mesa Central',      subcanalMarca: 'Agua Ciel',      segmento: 'Moderno',       revenue: '$67K'  },
  { id: 'CLI-009', nombre: 'Abarrotes San Judas',          score: 89, riesgo: 'Alto',  inactividad: '4 meses', inactividadFecha: '2026-02-06', cambio: -55, territorio: 'Reynosa',          subcanalMarca: 'Coca-Cola',      segmento: 'Mayoreo',       revenue: '$289K' },
  { id: 'CLI-010', nombre: 'Café La Parroquia',            score: 44, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -9,  territorio: 'Culiacán',         subcanalMarca: 'Café del Pacífico', segmento: 'Food Service', revenue: '$38K' },
  { id: 'CLI-011', nombre: 'Farmacia Guadalajara Norte',   score: 22, riesgo: 'Bajo',  inactividad: '0 meses', inactividadFecha: '2026-06-01', cambio: 5,   territorio: 'Guadalajara',      subcanalMarca: 'Powerade',       segmento: 'Conveniencia',  revenue: '$210K' },
  { id: 'CLI-012', nombre: 'Distribuidora López',          score: 95, riesgo: 'Alto',  inactividad: '5 meses', inactividadFecha: '2026-01-06', cambio: -70, territorio: 'Monclova',         subcanalMarca: 'Coca-Cola',      segmento: 'Mayoreo',       revenue: '$520K' },
  { id: 'CLI-013', nombre: '7-Eleven Centro',              score: 35, riesgo: 'Bajo',  inactividad: '0 meses', inactividadFecha: '2026-06-02', cambio: 2,   territorio: 'Mesa Central',      subcanalMarca: 'Monster Energy', segmento: 'Conveniencia',  revenue: '$178K' },
  { id: 'CLI-014', nombre: 'Tortas El Güero',              score: 67, riesgo: 'Medio', inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -28, territorio: 'Hermosillo',       subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$31K'  },
  { id: 'CLI-015', nombre: 'Mini Mart Express',            score: 76, riesgo: 'Alto',  inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -33, territorio: 'Chihuahua',        subcanalMarca: 'Jugos Del Valle', segmento: 'Tradicional',  revenue: '$55K'  },
];
