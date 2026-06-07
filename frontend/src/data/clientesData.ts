export type RiskLevel = 'Alto' | 'Medio' | 'Bajo';

export interface Cliente {
  id: string;
  hash: string;            // customer_id real (hash) del scoring del modelo
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

// Cada tienda demo está ligada a un cliente REAL del scoring del modelo
// (data/processed/scoring_clientes.csv): el hash es su customer_id y el score
// es exactamente su churn_proba × 100 (p. ej. CLI-001 → proba 0.87004 → 87).
// Así score, nivel y hash provienen de la misma fila real del modelo.
export const CLIENTES: Cliente[] = [
  { id: 'CLI-001', hash: 'e64895387c530141f528b805f57bab42a583e30ec53d964eb06f94cd', nombre: 'Tienda La Esperanza',          score: 87, riesgo: 'Alto',  inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -45, territorio: 'Monterrey',        subcanalMarca: 'Coca-Cola',      segmento: 'Tradicional',   revenue: '$125K' },
  { id: 'CLI-002', hash: '158e0836248d95dc27a7c5179e32a55fc1f566c48af91b39a571ba0a', nombre: 'Super Abarrotes El Güero',     score: 92, riesgo: 'Alto',  inactividad: '4 meses', inactividadFecha: '2026-02-06', cambio: -62, territorio: 'Saltillo',         subcanalMarca: 'Monster Energy', segmento: 'Mayoreo',       revenue: '$340K' },
  { id: 'CLI-003', hash: '9c59c6e543616f0d1918c2211a4a1d0b73515f46893dabdc528cbb15', nombre: 'Restaurante Los Arcos',        score: 78, riesgo: 'Medio', inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -38, territorio: 'Guadalajara',      subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$95K'  },
  { id: 'CLI-004', hash: 'd791608d7bdfe5c58f56566a8e3c28d88a921b8bd49ed62205d3937f', nombre: 'Tienda 3B Reforma',            score: 65, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -25, territorio: 'Mesa Central',      subcanalMarca: 'Jugos Del Valle', segmento: 'Moderno',       revenue: '$78K'  },
  { id: 'CLI-005', hash: 'fa2f65b13c515e3f4236e3a8d68714fe7e7c098d7450367fdc05b5f4', nombre: 'Oxxo Satélite',                score: 71, riesgo: 'Medio', inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -31, territorio: 'Monterrey',        subcanalMarca: 'Powerade',       segmento: 'Conveniencia',  revenue: '$156K' },
  { id: 'CLI-006', hash: '7f52bc5386debbfe6bc0f14107f95b61514c68eac90b671d3b1da90c', nombre: 'Minisuper Doña Mary',          score: 58, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -19, territorio: 'San Luis Potosí',   subcanalMarca: 'Coca-Cola',      segmento: 'Tradicional',   revenue: '$45K'  },
  { id: 'CLI-007', hash: '987e63cc13713b97318ede41e33a2eb3353dcc5b7c9c577842f5201c', nombre: 'Restaurante Taquería El Tizoncito', score: 82, riesgo: 'Alto', inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -42, territorio: 'Aguascalientes', subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$112K' },
  { id: 'CLI-008', hash: 'cf880ddbdb0ddebdd4e28624b85e63f9bc38cb6c95c90f5975023feb', nombre: 'Soriana Express',              score: 48, riesgo: 'Medio', inactividad: '0 meses', inactividadFecha: '2026-05-28', cambio: -12, territorio: 'Mesa Central',      subcanalMarca: 'Agua Ciel',      segmento: 'Moderno',       revenue: '$67K'  },
  { id: 'CLI-009', hash: 'ffe47a34d9fc1a740338a4c2d54dda36baab8d541bbecfcec84d6e8e', nombre: 'Abarrotes San Judas',          score: 89, riesgo: 'Alto',  inactividad: '4 meses', inactividadFecha: '2026-02-06', cambio: -55, territorio: 'Reynosa',          subcanalMarca: 'Coca-Cola',      segmento: 'Mayoreo',       revenue: '$289K' },
  { id: 'CLI-010', hash: '8bac087271d5b9ec430689810ce34b9003919288b9ac6b728de9dbba', nombre: 'Café La Parroquia',            score: 44, riesgo: 'Medio', inactividad: '1 mes',   inactividadFecha: '2026-05-06', cambio: -9,  territorio: 'Culiacán',         subcanalMarca: 'Café del Pacífico', segmento: 'Food Service', revenue: '$38K' },
  { id: 'CLI-011', hash: '1add60bede1a984fff3933c4dbab0edfff45198aebe373413a891bce', nombre: 'Farmacia Guadalajara Norte',   score: 22, riesgo: 'Bajo',  inactividad: '0 meses', inactividadFecha: '2026-06-01', cambio: 5,   territorio: 'Guadalajara',      subcanalMarca: 'Powerade',       segmento: 'Conveniencia',  revenue: '$210K' },
  { id: 'CLI-012', hash: '4d483fee9c93ac49d529dcf4bb1b20dfe25c6e4c6633a7e68f12c74f', nombre: 'Distribuidora López',          score: 95, riesgo: 'Alto',  inactividad: '5 meses', inactividadFecha: '2026-01-06', cambio: -70, territorio: 'Monclova',         subcanalMarca: 'Coca-Cola',      segmento: 'Mayoreo',       revenue: '$520K' },
  { id: 'CLI-013', hash: 'c4aba9671139a5aa5d3e5a51673e914d154d5f43083401230c8d92e7', nombre: '7-Eleven Centro',              score: 35, riesgo: 'Bajo',  inactividad: '0 meses', inactividadFecha: '2026-06-02', cambio: 2,   territorio: 'Mesa Central',      subcanalMarca: 'Monster Energy', segmento: 'Conveniencia',  revenue: '$178K' },
  { id: 'CLI-014', hash: 'ad6b250327d2f4802ab4616fd2df253471871a1c3a536d2f6c192f93', nombre: 'Tortas El Güero',              score: 67, riesgo: 'Medio', inactividad: '2 meses', inactividadFecha: '2026-04-06', cambio: -28, territorio: 'Hermosillo',       subcanalMarca: 'Coca-Cola',      segmento: 'Food Service',  revenue: '$31K'  },
  { id: 'CLI-015', hash: '702a0c06b0f0e12f723a19d89a4c9fd0be070403730a3a03564ed915', nombre: 'Mini Mart Express',            score: 76, riesgo: 'Medio', inactividad: '3 meses', inactividadFecha: '2026-03-06', cambio: -33, territorio: 'Chihuahua',        subcanalMarca: 'Jugos Del Valle', segmento: 'Tradicional',  revenue: '$55K'  },
];
