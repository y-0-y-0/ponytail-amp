// Amp's complete API declares Observable[Symbol.observable]. TypeScript's standard
// library does not declare this observable interop symbol; no API member is replaced.
interface SymbolConstructor {
  readonly observable: unique symbol
}
