/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { fromNano, toNano } from '@ton/core';

describe('Unit Converter', () => {
  describe('fromNano (nanoTON to TON)', () => {
    it('should convert 1 TON in nanoTON to TON', () => {
      const nanoTon = '1000000000'; // 1 TON
      const ton = fromNano(nanoTon);
      expect(ton).toBe('1');
    });

    it('should convert 0.5 TON in nanoTON to TON', () => {
      const nanoTon = '500000000'; // 0.5 TON
      const ton = fromNano(nanoTon);
      expect(ton).toBe('0.5');
    });

    it('should handle small amounts', () => {
      const nanoTon = '1'; // 0.000000001 TON
      const ton = fromNano(nanoTon);
      expect(ton).toBe('0.000000001');
    });

    it('should handle zero', () => {
      const nanoTon = '0';
      const ton = fromNano(nanoTon);
      expect(ton).toBe('0');
    });

    it('should handle large amounts', () => {
      const nanoTon = '1000000000000000000'; // 1 billion TON
      const ton = fromNano(nanoTon);
      expect(ton).toBe('1000000000');
    });
  });

  describe('toNano (TON to nanoTON)', () => {
    it('should convert 1 TON to nanoTON', () => {
      const ton = '1';
      const nanoTon = toNano(ton);
      expect(nanoTon.toString()).toBe('1000000000');
    });

    it('should convert 0.5 TON to nanoTON', () => {
      const ton = '0.5';
      const nanoTon = toNano(ton);
      expect(nanoTon.toString()).toBe('500000000');
    });

    it('should handle decimal precision', () => {
      const ton = '1.123456789';
      const nanoTon = toNano(ton);
      expect(nanoTon.toString()).toBe('1123456789');
    });

    it('should handle zero', () => {
      const ton = '0';
      const nanoTon = toNano(ton);
      expect(nanoTon.toString()).toBe('0');
    });
  });
});
