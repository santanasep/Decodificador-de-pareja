import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  calculateMatchScore,
  searchDictionary,
  generateFallbackAnalysis,
  generatePartnerAlertMessage,
  getDangerLevelDetails,
} from './decoderEngine';
import { DEFAULT_DICTIONARY } from '../data/defaultDictionary';

test('normalizeText strips diacritics, punctuation and converts to lowercase', () => {
  const input = '¿¡No Me Pasa NADA...!?';
  const result = normalizeText(input);
  assert.equal(result, 'no me pasa nada');
});

test('calculateMatchScore returns 1.0 for exact normalized strings', () => {
  const score = calculateMatchScore('como quieras', 'como quieras');
  assert.equal(score, 1.0);
});

test('calculateMatchScore gives high score for partial phrase containment', () => {
  const score = calculateMatchScore('te vas a poner eso', '¿te vas a poner eso?');
  assert.ok(score > 0.8, `Score ${score} should be > 0.8`);
});

test('searchDictionary correctly matches user query "No me pasa nada"', () => {
  const result = searchDictionary('No me pasa nada', DEFAULT_DICTIONARY);
  assert.ok(result.bestMatch !== null);
  assert.equal(result.bestMatch?.phrase, 'No me pasa nada');
  assert.equal(result.bestMatch?.dangerLevel, 'alto');
});

test('searchDictionary correctly matches "te vas a poner eso"', () => {
  const result = searchDictionary('vas a poner eso', DEFAULT_DICTIONARY);
  assert.ok(result.bestMatch !== null);
  assert.equal(result.bestMatch?.phrase, '¿Te vas a poner eso?');
});

test('generateFallbackAnalysis returns consistent structured object for unknown phrase', () => {
  const fallback = generateFallbackAnalysis('Todo perfecto, mi amor');
  assert.equal(fallback.phrase, 'Todo perfecto, mi amor');
  assert.ok(fallback.literalMeaning.length > 0);
  assert.ok(fallback.emotionalMeaning.length > 0);
  assert.ok(fallback.recommendedAction.length > 0);
});

test('generatePartnerAlertMessage contains user requested phrasing', () => {
  const msg = generatePartnerAlertMessage('Hablamos luego');
  assert.match(msg, /Me acabas de lanzar una indirecta nueva/);
  assert.match(msg, /ve al diccionario a ponerle subtítulos cuando puedas/i);
  assert.match(msg, /Hablamos luego/);
});

test('getDangerLevelDetails returns proper DEFCON codes', () => {
  const detailsCritico = getDangerLevelDetails('critico');
  assert.equal(detailsCritico.code, 'DEFCON 1');
  const detailsMedio = getDangerLevelDetails('medio');
  assert.equal(detailsMedio.code, 'DEFCON 3');
});
