---
home: false
description: 'Design-oriented test framework for Ruby'
footer: MIT Licensed | Copyright © 2020-present Nathan Ladd
---

Documentation
=============


Running Test Files
------------------

Individual test files are most commonly run via the `ruby` executable:

```
> ruby test/automated/example.rb
Example Context
  Pass
  Assertion failure
    test/automated/example.rb:9:in `block (2 levels) in <main>': Assertion failed (TestBench::Fixture::AssertionFailure)
  Error
    test/automated/example.rb:13:in `block (2 levels) in <main>': Some error (RuntimeError)
	    *omitted*
	    from test/automated/example.rb:12:in `block in <main>'
	    *omitted*
	    from test/automated/example.rb:3:in `<main>'

```

However, the ruby executable can only run an individual file, so a test runner is therefore needed run multiple files or an entire test suite. Before TestBench's runner can be used, however, it must be added to the project. The most common way to do this is to add a ruby file, usually at `test/automated.rb`, that invokes the runner:

```ruby
# Begin test/automated.rb

TestBench::Run.('test/automated')

# End test/automated.rb
```

The above runner will run all tests under the `test/automated` directory (which, at present, only contains the one test file, `example.rb`, added above).

```
> ruby test/automated.rb
Running test/automated/example.rb
Example Context
  Pass
  Assertion failure
    test/automated/example.rb:9:in `block (2 levels) in <top (required)>': Assertion failed (TestBench::Fixture::AssertionFailure)
  Error
    test/automated/example.rb:13:in `block (2 levels) in <top (required)>': Some error (RuntimeError)
	    *omitted*
	    from test/automated/example.rb:12:in `block in <top (required)>'
	    *omitted*
	    from test/automated/example.rb:3:in `<top (required)>'
	    *omitted*
	    from test/automated.rb:5:in `<main>'

Error Summary:
   2: test/automated/example.rb
      test/automated/example.rb:9:in `block (2 levels) in <top (required)>': Assertion failed (TestBench::Fixture::AssertionFailure)
      test/automated/example.rb:13:in `block (2 levels) in <top (required)>': Some error (RuntimeError)

Finished running 1 file
Ran 3 tests in 0.001s (3000.0 tests/second)
1 passed, 0 skipped, 2 failed, 2 total errors

```

The TestBench library also provides an executable file, `bench`. It can be used to run individual test files or directories containing test files (just like the previously mentioned runner). To run a single test file, supply the path as a command line argument:

```ruby
> bench test/automated/example.rb

> bench test/automated/some_directory/
```

By default, when run with no arguments, the CLI will run all the test files under `test/automated`. This can be altered to any directory of your choosing by setting the environment variable `TEST_BENCH_TESTS_DIRECTORY`.

Finally, test files and directories can be piped into the CLI via standard input ("stdin"):

```
> echo "test/automated/example.rb" | bench

> echo "test/automated/some_directory" | bench
```

The CLI also accepts command-line switches that configure how TestBench operates. Each of the switches also has a corresponding environment variable which allows for TestBench to be configured for a local development environment. Invoking the CLI with the `--help` or `-h` arguments will cause the CLI to print documentation on each switch and then exit.




Fixtures
--------

To allow for generalized test abstractions, the TestBench core methods (`context`, `test`, `assert`, `refute`, `comment`, etc.) can be made available to any Ruby class or object. To add the methods to a class, mix in `TestBench::Fixture`:

```ruby
class SomeFixture
  include TestBench::Fixture

  def call
    context "Some Context" do
      test "Example passing test" do
        assert(true)
      end

      test "Example failing test" do
        refute(true)
      end
    end
  end
end
```

NOTE: Early on during the initial development of unit testing, the term "fixture" meant the specialized classes that would test implementation code. In the Ruby community, the term has come to mean test data loaded during the setup phase of tests. TestBench makes use of the original meaning of the term, not the latter.

In the above example, `SomeFixture` can be instantiated like any other Ruby class (`TestBench::Fixture` does not interfere with `#initialize`). Fixture classes can even be tested in isolation:

```ruby
some_fixture = SomeFixture.new

some_fixture.()

test "The example passing test passes" do
  assert(some_fixture.test_session.one_passed?('Example passing test'))
end

test "The example failing test fails" do
  assert(some_fixture.test_session.one_failed?('Example failing test'))
end
```

In order to run a fixture and have its output go to the appropriate place, TestBench includes the `fixture` method, which accepts a fixture class, along with any arguments to be passed to the constructor:

```ruby
context "Other Fixture" do
  class OtherFixture
    include TestBench::Fixture

    def initialize(arg1, arg2)
      # ...
    end

    def call
      # ...
    end
  end

  fixture(OtherFixture, 'some-arg', 'other-arg')
end
```

When a fixture class implements `#call`, `fixture` will invoke the `#call` method after instantiation. The intent of `#call` is to carry out a test procedure, just like a test script. Sometimes it may not makes sense for a fixture class to have a single call method; in such circumstances, a block can be supplied to `fixture` which is executed instead:

```ruby
context "Fixture Block Argument" do
  class YetAnotherFixture
    include TestBench::Fixture

    def initialize(arg1, arg2)
      # ...
    end
  end

  fixture(YetAnotherFixture, 'some-arg', 'other-arg') do
    context "Some Context" do
      test "Some test" do
        assert(true)
      end

      # ...
    end
  end
end
```

One final note on fixtures: fixture classes are designed to be included with libraries, alongside related implementation code. As a result, `TestBench::Fixture` is actually packaged in a separate library, [test_bench-fixture][2], so that such libraries do not have to take a dependency on a testing framework. That library is safe to be packaged with production code, whereas TestBench, being a test framework, does not belong in a typical production system.

