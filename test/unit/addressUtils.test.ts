/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Address } from '@ton/core';

describe('Address Utilities', () => {
  // Using a known valid TON address (TON Foundation wallet)
  const VALID_ADDRESS = 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N';
  const RAW_ADDRESS = '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8';

  describe('Address Validation', () => {
    it('should validate a correct TON address', () => {
      expect(() => Address.parse(VALID_ADDRESS)).not.toThrow();
    });

    it('should reject an invalid TON address', () => {
      const invalidAddress = 'invalid-address';
      expect(() => Address.parse(invalidAddress)).toThrow();
    });

    it('should handle raw address format', () => {
      expect(() => Address.parseRaw(RAW_ADDRESS)).not.toThrow();
    });
  });

  describe('Address Conversion', () => {
    it('should convert address to bounceable format', () => {
      const address = Address.parse(VALID_ADDRESS);
      const bounceable = address.toString({ bounceable: true });
      expect(bounceable).toMatch(/^EQ/);
    });

    it('should convert address to non-bounceable format', () => {
      const address = Address.parse(VALID_ADDRESS);
      const nonBounceable = address.toString({ bounceable: false });
      expect(nonBounceable).toMatch(/^UQ/);
    });

    it('should convert address to raw format', () => {
      const address = Address.parse(VALID_ADDRESS);
      const raw = address.toRawString();
      expect(raw).toMatch(/^0:/);
    });
  });
});
