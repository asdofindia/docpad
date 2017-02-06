// Generated by CoffeeScript 1.12.3
var DocPad, baseUrl, cliPath, deepEqual, difference, docpad, docpadConfig, docpadPath, docpadUtil, equal, expectPath, hostname, joe, outPath, pathUtil, port, ref, rootPath, safefs, scandir, srcPath, superAgent, testWait, util,
  hasProp = {}.hasOwnProperty;

util = require('util');

pathUtil = require('path');

difference = require('underscore').difference;

superAgent = require('superagent');

scandir = require('scandirectory');

safefs = require('safefs');

ref = require('assert-helpers'), equal = ref.equal, deepEqual = ref.deepEqual;

joe = require('joe');

DocPad = require('../lib/docpad');

docpadUtil = require('../lib/util');

docpadPath = pathUtil.join(__dirname, '..', '..');

rootPath = pathUtil.join(docpadPath, 'test');

srcPath = pathUtil.join(rootPath, 'src');

outPath = pathUtil.join(rootPath, 'out');

expectPath = pathUtil.join(rootPath, 'out-expected');

cliPath = pathUtil.join(docpadPath, 'bin', 'docpad');

port = 9770;

hostname = "0.0.0.0";

baseUrl = "http://" + hostname + ":" + port;

testWait = 1000 * 60 * 5;

docpadConfig = {
  port: port,
  hostname: hostname,
  rootPath: rootPath,
  logLevel: docpadUtil.getDefaultLogLevel(),
  skipUnsupportedPlugins: false,
  catchExceptions: false,
  environments: {
    development: {
      a: 'instanceConfig',
      b: 'instanceConfig',
      templateData: {
        a: 'instanceConfig',
        b: 'instanceConfig'
      }
    }
  }
};

process.on('uncaughtException', function(err) {
  throw err;
});

docpad = null;

joe.suite('docpad-actions', function(suite, test) {
  test('create', function(done) {
    return docpad = DocPad.createInstance(docpadConfig, function(err) {
      return done(err);
    });
  });
  test('config', function(done) {
    var a, b, c, config, expected, templateData;
    expected = {
      a: 'instanceConfig',
      b: 'instanceConfig',
      c: 'websiteConfig'
    };
    config = docpad.getConfig();
    a = config.a, b = config.b, c = config.c;
    deepEqual({
      a: a,
      b: b,
      c: c
    }, expected);
    templateData = docpad.getTemplateData();
    a = templateData.a, b = templateData.b, c = templateData.c;
    deepEqual({
      a: a,
      b: b,
      c: c
    }, expected);
    return done();
  });
  test('clean', function(done) {
    return docpad.action('clean', function(err) {
      return done(err);
    });
  });
  test('install', function(done) {
    return docpad.action('install', function(err) {
      return done(err);
    });
  });
  suite('generate', function(suite, test) {
    test('action', function(done) {
      return docpad.action('generate', function(err) {
        return done(err);
      });
    });
    test('writeSource', function(done) {
      var file;
      file = docpad.getFileAtPath('writesource.txt.eco');
      return file.writeSource(done);
    });
    suite('results', function(suite, test) {
      var testMarkup;
      testMarkup = function(key, actual, expected) {
        return test(key, function() {
          var actualString, expectedString;
          actualString = actual.trim().replace(/\s+/g, '').replace(/([abc])[\\]+/g, '$1/');
          expectedString = expected.trim().replace(/\s+/g, '').replace(/([abc])[\\]+/g, '$1/');
          return equal(actualString, expectedString);
        });
      };
      return test('same files', function(done) {
        return scandir({
          path: outPath,
          readFiles: true,
          ignoreHiddenFiles: false,
          next: function(err, outList) {
            return scandir({
              path: expectPath,
              readFiles: true,
              ignoreHiddenFiles: false,
              next: function(err, expectList) {
                var actual, expected, key;
                deepEqual(difference(Object.keys(outList), Object.keys(expectList)), [], 'difference to be empty');
                for (key in outList) {
                  if (!hasProp.call(outList, key)) continue;
                  actual = outList[key];
                  expected = expectList[key];
                  testMarkup(key, actual, expected);
                }
                return done();
              }
            });
          }
        });
      });
    });
    test('ignored "ignored" documents"', function(done) {
      return safefs.exists(outPath + "/ignored.html", function(exists) {
        equal(exists, false);
        return done();
      });
    });
    return test('ignored common patterns documents"', function(done) {
      return safefs.exists(outPath + "/.svn", function(exists) {
        equal(exists, false);
        return done();
      });
    });
  });
  suite('server', function(suite, test) {
    test('server action', function(done) {
      return docpad.action('server', function(err) {
        return done(err);
      });
    });
    test('served generated documents', function(done) {
      return superAgent.get(baseUrl + "/html.html", function(err, res) {
        var actual;
        if (err) {
          return done(err);
        }
        actual = res.text;
        return safefs.readFile(expectPath + "/html.html", function(err, expected) {
          if (err) {
            return done(err);
          }
          equal(actual.toString().trim(), expected.toString().trim());
          return done();
        });
      });
    });
    test('served custom urls', function(done) {
      return superAgent.get(baseUrl + "/my-custom-url", function(err, res) {
        var actual;
        if (err) {
          return done(err);
        }
        actual = res.text;
        return safefs.readFile(expectPath + "/custom-url.html", function(err, expected) {
          if (err) {
            return done(err);
          }
          equal(actual.toString().trim(), expected.toString().trim());
          return done();
        });
      });
    });
    test('supports secondary urls - part 1/2', function(done) {
      return superAgent.get(baseUrl + "/my-secondary-urls1", function(err, res) {
        var actual;
        if (err) {
          return done(err);
        }
        deepEqual(res.redirects, ['http://0.0.0.0:9770/secondary-urls.html'], 'redirects to be as expected');
        actual = res.text;
        return safefs.readFile(expectPath + "/secondary-urls.html", function(err, expected) {
          if (err) {
            return done(err);
          }
          equal(actual.toString().trim(), expected.toString().trim());
          return done();
        });
      });
    });
    test('supports secondary urls - part 2/2', function(done) {
      return superAgent.get(baseUrl + "/my-secondary-urls2", function(err, res) {
        var actual;
        if (err) {
          return done(err);
        }
        deepEqual(res.redirects, ['http://0.0.0.0:9770/secondary-urls.html'], 'redirects to be as expected');
        actual = res.text;
        return safefs.readFile(expectPath + "/secondary-urls.html", function(err, expected) {
          if (err) {
            return done(err);
          }
          equal(actual.toString().trim(), expected.toString().trim());
          return done();
        });
      });
    });
    test('served dynamic documents - part 1/2', function(done) {
      return superAgent.get(baseUrl + "/dynamic.html?name=ben", function(err, res) {
        var actual, expected;
        if (err) {
          return done(err);
        }
        actual = res.text;
        expected = 'hi ben';
        equal(actual.toString().trim(), expected);
        return done();
      });
    });
    return test('served dynamic documents - part 2/2', function(done) {
      return superAgent.get(baseUrl + "/dynamic.html?name=joe", function(err, res) {
        var actual, expected;
        if (err) {
          return done(err);
        }
        actual = res.text;
        expected = 'hi joe';
        equal(actual.toString().trim(), expected);
        return done();
      });
    });
  });
  return test('close the close', function() {
    return docpad.getServer(true).serverHttp.close();
  });
});
