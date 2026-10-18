import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectInstallPlatform } from './installPlatform.ts';
test('recognizes iPhone in Safari or another iOS browser', () => {
  assert.equal(
    detectInstallPlatform(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit Safari',
      5,
    ),
    'iphone',
  );
  assert.equal(
    detectInstallPlatform(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) CriOS',
      5,
    ),
    'iphone',
  );
});
test('recognizes iPad including desktop-style browser identity', () => {
  assert.equal(
    detectInstallPlatform('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)', 5),
    'ipad',
  );
  assert.equal(
    detectInstallPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5),
    'ipad',
  );
});
test('does not send Mac or Android users through iOS instructions', () => {
  assert.equal(
    detectInstallPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0),
    'other',
  );
  assert.equal(
    detectInstallPlatform('Mozilla/5.0 (Linux; Android 15)', 5),
    'other',
  );
});
