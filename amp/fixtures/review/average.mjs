// Arithmetic mean of a non-empty array of finite numbers.
export function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length - 1)
}
