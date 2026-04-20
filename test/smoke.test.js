/**
 * Smoke test mínimo — FIX-AUD-PROF-008
 * Verifica que el test runner levanta sin crash.
 */
const { describe, it, expect } = require('vitest');

describe('Central-Eloria smoke', () => {
  it('entorno de tests levanta sin crash', () => {
    expect(1 + 1).toBe(2);
  });

  it('package.json es válido', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBeDefined();
    expect(pkg.scripts).toBeDefined();
  });
});
