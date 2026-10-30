import test from 'node:test';
import assert from 'node:assert/strict';
import { getTensionDetails, TENSION_PRESETS } from './tensionEngine';

test('getTensionDetails clamps inputs properly', () => {
  const low = getTensionDetails(-5);
  assert.equal(low.level, 1);
  const high = getTensionDetails(99);
  assert.equal(high.level, 10);
});

test('getTensionDetails returns accurate metadata for level 1 (peace)', () => {
  const details = getTensionDetails(1);
  assert.equal(details.level, 1);
  assert.equal(details.emoji, '🕊️');
  assert.match(details.label, /Brisa Pacífica/);
});

test('getTensionDetails returns accurate metadata for level 7 (critical)', () => {
  const details = getTensionDetails(7);
  assert.equal(details.level, 7);
  assert.equal(details.emoji, '⚡');
  assert.match(details.label, /Alerta Crítica/);
});

test('getTensionDetails returns accurate metadata for level 10 (nuclear)', () => {
  const details = getTensionDetails(10);
  assert.equal(details.level, 10);
  assert.equal(details.emoji, '💥');
  assert.match(details.label, /DEFCON 10/);
});

test('TENSION_PRESETS has valid values', () => {
  assert.equal(TENSION_PRESETS.length, 4);
  assert.equal(TENSION_PRESETS[0].value, 2);
  assert.equal(TENSION_PRESETS[3].value, 10);
});
