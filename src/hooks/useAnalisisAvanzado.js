import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAnalisisAvanzado = () => {
  const [loading, setLoading] = useState(true)
  const [datos, setDatos] = useState({
    tendencias: [],
    vendedoresNuevos: [],
    comparativaEquipos: [],
    crecimientoIndividual: []
  })

  useEffect(() => {
    cargarAnalisis()
  }, [])

  const cargarAnalisis = async () => {
    setLoading(true)
    try {
      // 1. Tendencias últimas 8 semanas
      const tendencias = await obtenerTendencias()
      
      // 2. Análisis de vendedores nuevos (últimos 3 meses)
      const vendedoresNuevos = await obtenerVendedoresNuevos()
      
      // 3. Comparativa de equipos
      const comparativaEquipos = await obtenerComparativaEquipos()
      
      // 4. Crecimiento individual
      const crecimientoIndividual = await obtenerCrecimientoIndividual()

      setDatos({
        tendencias,
        vendedoresNuevos,
        comparativaEquipos,
        crecimientoIndividual
      })
    } catch (error) {
      console.error('Error cargando análisis:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener tendencias de últimas 8 semanas
  const obtenerTendencias = async () => {
    try {
      // Calcular fecha hace 56 días (8 semanas)
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - 56)

      const { data, error } = await supabase
        .from('registros_diarios')
        .select('fecha, ventas, ingresos, citas_realizadas')
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })

      if (error) {
        console.error('Error en obtenerTendencias:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Agrupar por semana
      const porSemana = {}
      data.forEach(registro => {
        const fecha = new Date(registro.fecha)
        const semana = getWeekNumber(fecha)
        const key = `${fecha.getFullYear()}-S${semana}`
        
        if (!porSemana[key]) {
          porSemana[key] = {
            semana: key,
            ventas: 0,
            ingresos: 0,
            citas: 0
          }
        }
        
        porSemana[key].ventas += registro.ventas || 0
        porSemana[key].ingresos += registro.ingresos || 0
        porSemana[key].citas += registro.citas_realizadas || 0
      })

      return Object.values(porSemana).slice(-8) // Últimas 8 semanas
    } catch (error) {
      console.error('Error en obtenerTendencias:', error)
      return []
    }
  }

  // Obtener vendedores nuevos y su impacto
  const obtenerVendedoresNuevos = async () => {
    try {
      const fechaLimite = new Date()
      fechaLimite.setDate(fechaLimite.getDate() - 90) // 3 meses atrás

      const { data: vendedores, error } = await supabase
        .from('vendedores')
        .select(`
          id,
          codigo_vendedor,
          created_at,
          usuarios (nombre_completo),
          equipos (nombre_equipo)
        `)
        .gte('created_at', fechaLimite.toISOString())
        .eq('activo', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error en obtenerVendedoresNuevos:', error)
        return []
      }

      if (!vendedores || vendedores.length === 0) {
        return []
      }

      // Obtener ventas de cada vendedor nuevo
      const vendedoresConVentas = await Promise.all(
        vendedores.map(async (vendedor) => {
          const { data: registros } = await supabase
            .from('registros_diarios')
            .select('ventas, ingresos')
            .eq('vendedor_id', vendedor.id)

          const totalVentas = registros?.reduce((sum, r) => sum + (r.ventas || 0), 0) || 0
          const totalIngresos = registros?.reduce((sum, r) => sum + (r.ingresos || 0), 0) || 0

          return {
            ...vendedor,
            totalVentas,
            totalIngresos,
            diasActivo: Math.floor((Date.now() - new Date(vendedor.created_at)) / (1000 * 60 * 60 * 24))
          }
        })
      )

      return vendedoresConVentas
    } catch (error) {
      console.error('Error en obtenerVendedoresNuevos:', error)
      return []
    }
  }

  // Comparativa de equipos (últimas 4 semanas)
  const obtenerComparativaEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('vista_resumen_semanal')
        .select('*')
        .order('semana_inicio', { ascending: false })
        .limit(32) // 8 equipos × 4 semanas

      if (error) {
        console.error('Error en obtenerComparativaEquipos:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Agrupar por equipo
      const porEquipo = {}
      data.forEach(registro => {
        if (!porEquipo[registro.numero_equipo]) {
          porEquipo[registro.numero_equipo] = {
            equipo: registro.nombre_equipo,
            ventasUltimas4Semanas: 0,
            ingresosUltimas4Semanas: 0,
            showRate: 0,
            conversion: 0,
            semanas: []
          }
        }
        
        porEquipo[registro.numero_equipo].ventasUltimas4Semanas += registro.total_ventas || 0
        porEquipo[registro.numero_equipo].ingresosUltimas4Semanas += registro.total_ingresos || 0
        porEquipo[registro.numero_equipo].semanas.push({
          semana: registro.numero_semana,
          ventas: registro.total_ventas,
          showRate: registro.show_rate
        })
      })

      // Calcular promedios
      Object.values(porEquipo).forEach(equipo => {
        const numSemanas = equipo.semanas.length
        if (numSemanas > 0) {
          equipo.showRate = equipo.semanas.reduce((sum, s) => sum + (s.showRate || 0), 0) / numSemanas
        }
      })

      return Object.values(porEquipo)
    } catch (error) {
      console.error('Error en obtenerComparativaEquipos:', error)
      return []
    }
  }

  // Crecimiento individual últimas 4 semanas
  const obtenerCrecimientoIndividual = async () => {
    try {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - 28) // 4 semanas atrás

      const { data, error } = await supabase
        .from('registros_diarios')
        .select(`
          fecha,
          ventas,
          ingresos,
          vendedores (
            codigo_vendedor,
            usuarios (nombre_completo)
          )
        `)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })

      if (error) {
        console.error('Error en obtenerCrecimientoIndividual:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Agrupar por vendedor
      const porVendedor = {}
      data.forEach(registro => {
        const vendedorId = registro.vendedores?.codigo_vendedor
        if (!vendedorId) return

        if (!porVendedor[vendedorId]) {
          porVendedor[vendedorId] = {
            vendedor: registro.vendedores.usuarios?.nombre_completo || 'Desconocido',
            codigo: vendedorId,
            semanas: [0, 0, 0, 0], // Últimas 4 semanas
            totalVentas: 0
          }
        }

        // Determinar semana (0 = más antigua, 3 = más reciente)
        const diasAtras = Math.floor((Date.now() - new Date(registro.fecha)) / (1000 * 60 * 60 * 24))
        const semanaIndex = Math.floor(diasAtras / 7)
        
        if (semanaIndex < 4) {
          porVendedor[vendedorId].semanas[3 - semanaIndex] += registro.ventas || 0
          porVendedor[vendedorId].totalVentas += registro.ventas || 0
        }
      })

      return Object.values(porVendedor)
        .filter(v => v.totalVentas > 0)
        .sort((a, b) => b.totalVentas - a.totalVentas)
    } catch (error) {
      console.error('Error en obtenerCrecimientoIndividual:', error)
      return []
    }
  }

  return { datos, loading, refetch: cargarAnalisis }
}

// Helper: Obtener número de semana (CORREGIDO)
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}