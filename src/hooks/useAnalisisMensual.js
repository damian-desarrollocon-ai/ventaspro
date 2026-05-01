import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAnalisisMensual = () => {
  const [loading, setLoading] = useState(true)
  const [datosMensuales, setDatosMensuales] = useState({
    resumenMeses: [],
    comparativaMesActual: null,
    tendenciaAnual: [],
    mejorMes: null,
    peorMes: null
  })

  useEffect(() => {
    cargarAnalisisMensual()
  }, [])

  const cargarAnalisisMensual = async () => {
    setLoading(true)
    try {
      // 1. Obtener últimos 12 meses
      const resumenMeses = await obtenerUltimos12Meses()
      
      // 2. Comparativa mes actual vs anterior
      const comparativaMesActual = calcularComparativaMesActual(resumenMeses)
      
      // 3. Tendencia anual
      const tendenciaAnual = calcularTendenciaAnual(resumenMeses)
      
      // 4. Mejor y peor mes
      const { mejorMes, peorMes } = identificarMejorPeorMes(resumenMeses)

      setDatosMensuales({
        resumenMeses,
        comparativaMesActual,
        tendenciaAnual,
        mejorMes,
        peorMes
      })
    } catch (error) {
      console.error('Error cargando análisis mensual:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener datos de últimos 12 meses
  const obtenerUltimos12Meses = async () => {
    try {
      const fechaInicio = new Date()
      fechaInicio.setMonth(fechaInicio.getMonth() - 12)

      const { data, error } = await supabase
        .from('registros_diarios')
        .select('fecha, ventas, ingresos, citas_agendadas, citas_realizadas, encuestas')
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })

      if (error) {
        console.error('Error obteniendo datos mensuales:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Agrupar por mes
      const porMes = {}
      data.forEach(registro => {
        const fecha = new Date(registro.fecha)
        const año = fecha.getFullYear()
        const mes = fecha.getMonth() + 1
        const key = `${año}-${String(mes).padStart(2, '0')}`
        
        if (!porMes[key]) {
          porMes[key] = {
            año,
            mes,
            mesNombre: obtenerNombreMes(mes),
            label: `${obtenerNombreMes(mes, true)} ${año}`,
            ventas: 0,
            ingresos: 0,
            encuestas: 0,
            citasAgendadas: 0,
            citasRealizadas: 0
          }
        }
        
        porMes[key].ventas += registro.ventas || 0
        porMes[key].ingresos += registro.ingresos || 0
        porMes[key].encuestas += registro.encuestas || 0
        porMes[key].citasAgendadas += registro.citas_agendadas || 0
        porMes[key].citasRealizadas += registro.citas_realizadas || 0
      })

      // Calcular métricas adicionales
      const meses = Object.values(porMes).map(mes => ({
        ...mes,
        ticketPromedio: mes.ventas > 0 ? Math.round(mes.ingresos / mes.ventas) : 0,
        showRate: mes.citasAgendadas > 0 
          ? Math.round((mes.citasRealizadas / mes.citasAgendadas) * 100) 
          : 0,
        conversion: mes.citasRealizadas > 0
          ? Math.round((mes.ventas / mes.citasRealizadas) * 100)
          : 0
      }))

      return meses.slice(-12) // Últimos 12 meses
    } catch (error) {
      console.error('Error en obtenerUltimos12Meses:', error)
      return []
    }
  }

  // Calcular comparativa mes actual vs anterior
  const calcularComparativaMesActual = (meses) => {
    if (meses.length < 2) return null

    const mesActual = meses[meses.length - 1]
    const mesAnterior = meses[meses.length - 2]

    const calcularCambio = (actual, anterior) => {
      if (anterior === 0) return actual > 0 ? 100 : 0
      return Math.round(((actual - anterior) / anterior) * 100)
    }

    return {
      mesActual: mesActual.label,
      mesAnterior: mesAnterior.label,
      ventas: {
        actual: mesActual.ventas,
        anterior: mesAnterior.ventas,
        cambio: calcularCambio(mesActual.ventas, mesAnterior.ventas),
        aumento: mesActual.ventas > mesAnterior.ventas
      },
      ingresos: {
        actual: mesActual.ingresos,
        anterior: mesAnterior.ingresos,
        cambio: calcularCambio(mesActual.ingresos, mesAnterior.ingresos),
        aumento: mesActual.ingresos > mesAnterior.ingresos
      },
      encuestas: {
        actual: mesActual.encuestas,
        anterior: mesAnterior.encuestas,
        cambio: calcularCambio(mesActual.encuestas, mesAnterior.encuestas),
        aumento: mesActual.encuestas > mesAnterior.encuestas
      },
      showRate: {
        actual: mesActual.showRate,
        anterior: mesAnterior.showRate,
        cambio: mesActual.showRate - mesAnterior.showRate,
        aumento: mesActual.showRate > mesAnterior.showRate
      }
    }
  }

  // Calcular tendencia anual
  const calcularTendenciaAnual = (meses) => {
    if (meses.length === 0) return { tendencia: 'neutral', porcentaje: 0 }

    const primerMes = meses[0]
    const ultimoMes = meses[meses.length - 1]

    const crecimiento = primerMes.ventas > 0
      ? ((ultimoMes.ventas - primerMes.ventas) / primerMes.ventas) * 100
      : 0

    return {
      tendencia: crecimiento > 10 ? 'alcista' : crecimiento < -10 ? 'bajista' : 'neutral',
      porcentaje: Math.round(crecimiento),
      ventasInicio: primerMes.ventas,
      ventasFin: ultimoMes.ventas,
      mesInicio: primerMes.label,
      mesFin: ultimoMes.label
    }
  }

  // Identificar mejor y peor mes
  const identificarMejorPeorMes = (meses) => {
    if (meses.length === 0) {
      return { mejorMes: null, peorMes: null }
    }

    const mejorMes = meses.reduce((max, mes) => 
      mes.ventas > max.ventas ? mes : max
    )

    const peorMes = meses.reduce((min, mes) => 
      mes.ventas < min.ventas ? mes : min
    )

    return { mejorMes, peorMes }
  }

  return { datosMensuales, loading, refetch: cargarAnalisisMensual }
}

// Helper: Obtener nombre del mes
function obtenerNombreMes(mes, corto = false) {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const mesesCortos = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]
  return corto ? mesesCortos[mes - 1] : meses[mes - 1]
}