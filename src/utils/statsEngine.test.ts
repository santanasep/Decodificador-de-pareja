import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCategoryStats,
  computeDangerStats,
  getMostFrequentPhrase,
  computeTensionIndex,
  INITIAL_SEED_INCIDENTS,
} from './statsEngine';
import { ConflictIncident } from '../types';

test('computeCategoryStats calculates counts and percentages accurately', () => {
  const stats = computeCategoryStats(INITIAL_SEED_INCIDENTS);
  assert.ok(stats.length > 0);
  const totalCount = stats.reduce((acc, curr) => acc + curr.count, 0);
  assert.equal(totalCount, INITIAL_SEED_INCIDENTS.length);

  // Top category should be emociones (3 occurrences) or comunicacion (3 occurrences)
  assert.ok(stats[0].count >= 3);
});

test('computeDangerStats calculates non-zero danger counts', () => {
  const dangerStats = computeDangerStats(INITIAL_SEED_INCIDENTS);
  assert.ok(dangerStats.length > 0);
  for (const s of dangerStats) {
    assert.ok(s.count > 0, `Danger stat count should be > 0: ${s.name}`);
  }
});

test('getMostFrequentPhrase correctly returns top recurring phrase', () => {
  const top = getMostFrequentPhrase(INITIAL_SEED_INCIDENTS);
  assert.ok(top !== null);
  assert.equal(top?.phrase, 'No me pasa nada');
  assert.equal(top?.count, 3);
});

test('computeTensionIndex provides score between 0 and 100', () => {
  const tension = computeTensionIndex(INITIAL_SEED_INCIDENTS);
  assert.ok(tension.score >= 0 && tension.score <= 100);
  assert.ok(typeof tension.status === 'string');
});

test('computeTensionIndex handles empty incidents gracefully', () => {
  const tension = computeTensionIndex([]);
  assert.equal(tension.score, 10);
  assert.equal(tension.status, 'Paz Conyugal Total');
});
