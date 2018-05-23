import rules, { addRules } from './rules';

describe('Testing [addRules] function designed to allow extension of rules', () => {
  test('Should add new rules to set if they all are functions', () => {
    addRules({
      rule1() {
        return true;
      },
      rule2() {
        return true;
      },
      rule3() {
        return true;
      }
    });
    expect(rules).toMatchObject({
      rule1: expect.any(Function),
      rule2: expect.any(Function),
      rule3: expect.any(Function)
    });
  });

  test('Should throw an Error if rule is not function', () => {
    expect(() => {
      addRules({
        rule4: false
      });
    }).toThrowError(/rule4/);
  });

  test('Should throw an Error if rule is already declared', () => {
    expect(() => {
      addRules({
        rule2() {
          return true;
        }
      });
    }).toThrowError(/rule2/);
  });
});
