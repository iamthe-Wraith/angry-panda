/* global beforeEach before */

/***
 * before will do something before all tests are run
 * but unlike beforeEach, it will only execute once
 * before ALL tests.
 ***/
before(done => {
  done();
});

/***
 * create a hook to run before each test.
 *
 * by adding 'done' it tells mocha to wait
 * until done is called before it will continue on
 * to the next test...
 ***/
beforeEach(done => {
  done();
});
