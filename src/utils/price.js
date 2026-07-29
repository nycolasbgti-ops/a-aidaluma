export const fmt = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`

// Detecta se o produto tem tamanhos (P/M/G) em vez de preço único
export const hasSizes = (prices) =>
  prices != null &&
  prices.unique === undefined &&
  (prices.P !== undefined || prices.M !== undefined || prices.G !== undefined)

// Menor preço disponível (para exibir "a partir de" nos cards)
export const getBasePrice = (prices) => {
  if (!prices) return 0
  if (prices.unique !== undefined) return Number(prices.unique)
  return Number(prices.P ?? prices.M ?? prices.G ?? 0)
}

// Preço para um tamanho específico (ou fallback inteligente)
export const getPrice = (prices, size) => {
  if (!prices) return 0
  if (prices.unique !== undefined) return Number(prices.unique)
  if (size && prices[size] !== undefined) return Number(prices[size])
  return Number(prices.M ?? prices.P ?? prices.G ?? 0)
}
