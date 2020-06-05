---
home: false
description: 'Design-oriented test framework for Ruby'
footer: MIT Licensed | Copyright © 2020-present Nathan Ladd
---

Documentation
=============





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

