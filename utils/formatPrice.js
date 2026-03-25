export function formatPrice(value) {
  return (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
