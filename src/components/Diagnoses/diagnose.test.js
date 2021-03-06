import KB from 'utils/kb.js';
import tests from './tests.json';
import concepts from 'data/concepts.json';
import offering from 'data/EECS111-2019WI.json';
import diagnoses from 'data/diagnoses.json';
import { diagnose } from './diagnose';
import { xmatch } from 'utils/matcher';

test('test data exists and is self-consistent', () => {
  expect(concepts).toBeDefined();

  expect(offering).toBeDefined();
  
  // there are samples
  const samples = offering.tickets;
  expect(samples).toBeDefined();
  const snames = Object.keys(samples);
  expect(snames.length).toBeGreaterThan(1);

  // there are diagnoses
  expect(diagnoses).toBeDefined();
  const dnames = Object.keys(diagnoses);
  expect(dnames.length).toBeGreaterThan(1);

  // there are test cases
  expect(tests).toBeDefined();
  const tnames = Object.keys(tests);
  expect(tnames.length).toBeGreaterThan(1);

  // every test name is a sample name
  // every test expects 0 or more diagnoses
  // every expected diagnosis is a diagnosis name
  tnames.forEach(tname => {
    expect(snames).toContain(tname);
    const expected = tests[tname].diagnoses;
    expect(expected).toBeDefined();
    expected.forEach(tdname => {
      expect(dnames).toContain(tdname);
    });
  });
});

test('all expected diagnoses are found', () => {
  const kb = KB({ diagnoses, concepts });
  const conceptMatch = (pat, obj, kb) => (
    xmatch(pat, obj, { isa: kb.isa.bind(kb) })
  );
  const samples = offering.tickets;
  Object.entries(samples).forEach(([sname, sample]) => {
    const expected = tests[sname].diagnoses;
    expect(expected).toBeDefined();
    expected.forEach(dname => {
      const pattern = diagnoses[dname].pattern;
      if (!conceptMatch(pattern, sample, kb).length) {
        console.log(`${dname} not returned for ${sname}`);
        console.log(JSON.stringify(pattern));
        console.log(JSON.stringify(sample));
      };
    });
    const actual = diagnose(sample, kb).map(result => result.name);
    expect(actual).toBeDefined();
    expect(Array.isArray(actual)).toBeTruthy();
    if (actual.length !== expected.length) {
      actual.filter(x => !(expected.includes(x))).forEach(dname => {
        console.log(`${dname} returned for ${sname}, not expected`);
        console.log(JSON.stringify(diagnoses[dname].pattern));
        console.log(JSON.stringify(sample));
      });
    }
    expect(actual.length).toStrictEqual(expected.length);
  });
});