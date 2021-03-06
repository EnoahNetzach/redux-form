'use strict';

var _isInvalid = require('../isInvalid');

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _plain = require('../../structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _expectations = require('../../structure/plain/expectations');

var _expectations2 = _interopRequireDefault(_expectations);

var _immutable = require('../../structure/immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _expectations3 = require('../../structure/immutable/expectations');

var _expectations4 = _interopRequireDefault(_expectations3);

var _addExpectations = require('../../__tests__/addExpectations');

var _addExpectations2 = _interopRequireDefault(_addExpectations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var describeIsInvalid = function describeIsInvalid(name, structure, expect) {
  var isInvalid = (0, _isInvalid2.default)(structure);

  var fromJS = structure.fromJS;
  var getIn = structure.getIn;
  var setIn = structure.setIn;


  describe(name, function () {
    it('should return a function', function () {
      expect(isInvalid('foo')).toBeA('function');
    });

    it('should return false when form data not present', function () {
      expect(isInvalid('foo')(fromJS({
        form: {}
      }))).toBe(false);
    });

    it('should return false when there are no errors', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Snoopy',
              cat: 'Garfield'
            },
            asyncErrors: {},
            submitErrors: {},
            syncErrors: {}
          }
        }
      }))).toBe(false);
    });

    it('should return false when there are sync errors for a NON-registered field', function () {
      expect(isInvalid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            syncErrors: {
              horse: 'Too old'
            }
          }
        }
      }), 'form.foo.syncErrors', {
        horse: 'Too Old'
      }))).toBe(false);
    });

    it('should return true when there are sync errors for registered fields', function () {
      expect(isInvalid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }]
          }
        }
      }), 'form.foo.syncErrors', {
        dog: 'Too old'
      }))).toBe(true);
    });

    it('should return true with sync error for registered array field', function () {
      expect(isInvalid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: ['Garfield']
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cats', type: 'FieldArray' }]
          }
        }
      }), 'form.foo.syncErrors', {
        cats: {
          _error: 'Too many cats'
        }
      }))).toBe(true);
    });

    it('should return true when there is a syncValidateFailed', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            error: 'Bad Data',
            syncValidateFailed: true,
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }]
          }
        }
      }))).toBe(true);
    });

    it('should return false when there are async errors for a NON-registered field', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            asyncErrors: {
              horse: 'Too old'
            }
          }
        }
      }))).toBe(false);
    });

    it('should return true when there are async errors for registered fields', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            asyncErrors: {
              dog: 'Too old'
            }
          }
        }
      }))).toBe(true);
    });

    it('should return true with async error for registered array field', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: ['Garfield']
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cats', type: 'FieldArray' }],
            asyncErrors: {
              cats: {
                _error: 'Too many cats'
              }
            }
          }
        }
      }))).toBe(true);
    });

    it('should return false when there are submit errors for a NON-registered field', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            submitErrors: {
              horse: 'Too old'
            }
          }
        }
      }))).toBe(false);
    });

    it('should return true when there are submit errors for registered fields', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            submitErrors: {
              dog: 'Too old'
            }
          }
        }
      }))).toBe(true);
    });

    it('should return true with submit error for registered array field', function () {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: ['Garfield']
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cats', type: 'FieldArray' }],
            submitErrors: {
              cats: {
                _error: 'Too many cats'
              }
            }
          }
        }
      }))).toBe(true);
    });

    it('should use getFormState if provided', function () {
      expect(isInvalid('foo', function (state) {
        return getIn(state, 'someOtherSlice');
      })(fromJS({
        someOtherSlice: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [{ name: 'dog', type: 'Field' }, { name: 'cat', type: 'Field' }],
            submitErrors: {
              dog: 'That dog is ugly'
            }
          }
        }
      }))).toBe(true);
    });
  });
};

describeIsInvalid('isInvalid.plain', _plain2.default, (0, _addExpectations2.default)(_expectations2.default));
describeIsInvalid('isInvalid.immutable', _immutable2.default, (0, _addExpectations2.default)(_expectations4.default));