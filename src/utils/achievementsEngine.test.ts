import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAchievements,
  getRankLevel,
  generateAchievementShareText,
  BASE_ACHIEVEMENTS,
} from './achievementsEngine';
import { ConflictIncident, CouplePhrase } from '../types';

test('computeAchievements unlocks first treaty of peace with 1 resolution', () => {
  const sampleIncidents: ConflictIncident[] = [
    {
      id: 'test-1',
      phrase: 'No me pasa nada',
      category: 'emociones',
      dangerLevel: 'alto',
      timestamp: Date.now(),
      resolved: true,
    },
  ];
  const sampleDict: CouplePhrase[] = [];

  const achievements = computeAchievements(sampleIncidents, sampleDict);
  const firstPeace = achievements.find((a) => a.id === 'ach-first-peace');
  assert.ok(firstPeace !== undefined);
  assert.equal(firstPeace?.unlocked, true);
  assert.equal(firstPeace?.currentCount, 1);
});

test('computeAchievements unlocks Diplomático del Año when 10 resolutions are reached', () => {
  const tenResolved: ConflictIncident[] = Array.from({ length: 10 }, (_, i) => ({
    id: `inc-${i}`,
    phrase: 'Como quieras',
    category: 'planes',
    dangerLevel: 'medio',
    timestamp: Date.now(),
    resolved: true,
  }));

  const achievements = computeAchievements(tenResolved, []);
  const diplomat = achievements.find((a) => a.id === 'ach-diplomat-year');
  assert.ok(diplomat !== undefined);
  assert.equal(diplomat?.unlocked, true);
});

test('computeAchievements unlocks Experto en Desactivar Bombas with 3 nuclear/critical resolutions', () => {
  const nuclearIncidents: ConflictIncident[] = [
    { id: 'n1', phrase: 'Haz lo que quieras', category: 'comunicacion', dangerLevel: 'nuclear', timestamp: Date.now(), resolved: true },
    { id: 'n2', phrase: 'Tú sabrás', category: 'comunicacion', dangerLevel: 'critico', timestamp: Date.now(), resolved: true },
    { id: 'n3', phrase: 'Haz lo que quieras', category: 'comunicacion', dangerLevel: 'nuclear', timestamp: Date.now(), resolved: true },
  ];

  const achievements = computeAchievements(nuclearIncidents, []);
  const bombExpert = achievements.find((a) => a.id === 'ach-bomb-expert');
  assert.ok(bombExpert !== undefined);
  assert.equal(bombExpert?.unlocked, true);
});

test('computeAchievements checks custom phrases count for Alquimista del Diccionario', () => {
  const customPhrases: CouplePhrase[] = [
    { id: 'c1', phrase: 'Frase 1', literalMeaning: 'a', emotionalMeaning: 'b', recommendedAction: 'c', dangerLevel: 'medio', category: 'comunicacion', isCustom: true },
    { id: 'c2', phrase: 'Frase 2', literalMeaning: 'a', emotionalMeaning: 'b', recommendedAction: 'c', dangerLevel: 'medio', category: 'comunicacion', isCustom: true },
    { id: 'c3', phrase: 'Frase 3', literalMeaning: 'a', emotionalMeaning: 'b', recommendedAction: 'c', dangerLevel: 'medio', category: 'comunicacion', isCustom: true },
  ];

  const achievements = computeAchievements([], customPhrases);
  const dictMaster = achievements.find((a) => a.id === 'ach-dictionary-architect');
  assert.ok(dictMaster !== undefined);
  assert.equal(dictMaster?.unlocked, true);
});

test('getRankLevel scales with percentage of unlocked medals', () => {
  const rankLow = getRankLevel(1, 10);
  assert.equal(rankLow.title, 'Cadete del Entendimiento');

  const rankHigh = getRankLevel(9, 10);
  assert.equal(rankHigh.title, 'Canciller Mayor de la Paz Conyugal');
});

test('generateAchievementShareText creates celebratory WhatsApp copy', () => {
  const sampleAch = {
    ...BASE_ACHIEVEMENTS[1], // Experto en Desactivar Bombas
    currentCount: 3,
    unlocked: true,
  };
  const text = generateAchievementShareText(sampleAch);
  assert.match(text, /Experto en Desactivar Bombas/);
  assert.match(text, /Técnico Especialista en Explosivos Emocionales/);
});
