---
home: true
heroImage: /test-bench-icon-130x115.png
description: 'A Principled Test Framework for Ruby'
features:

- title: Simple
  details: >
    The TestBench API is just four methods: assert, refute, context, and test. There's nothing hidden. There's no guessing, no monkey-patching, no configuration, and no complexity. It's just programming.

- title: Principled
  details: >
    TestBench encourages clean test design that reflect fundamental principles. It has no superfluous syntax leading to cumbersome tests. It has no opinions, but makes no apologies.

- title: It's Just Ruby
  details: >
    Tests in TestBench are just Ruby scripts. They execute from top to bottom with no special runner and no special way to declare variables. If you know Ruby, you know TestBench.

footer: MIT Licensed | Copyright © 2020-present Nathan Ladd
---

TestBench is a no-nonsense testing framework for Ruby aiming to offer precisely what is needed to test well-designed code effectively and easily. In stark contrast to most other testing frameworks, test files are written using a procedural API, not a declarative one:

```ruby
# Begin test/automated/arithmetic.rb

require_relative '../test_init'

context "Arithmetic" do
  value = 11

  context "Multiplication" do
    test "Any value multiplied by zero is zero" do
      assert(value * 0 == 0)
    end
  end

  context "Addition" do
    test "Any value added by zero is the value" do
      assert(value + 0 == value)
    end
  end
end

# End test/automated/arithmetic.rb
```

There are many benefits to TestBench treating test files as Ruby scripts:

* Individual test files can be run directly via `ruby`. There is no need to invoke Rake or another CLI in order to run tests, although that is possible when useful.
* Test code gets executed in precisely the same order it's laid out in the file. There is no need to fathom how the underlying test runner arranges execution order at runtime, _because the test runner is just ruby_.
* Because local variables are natural to use in scripts, there is no need to use a declarative API to assign values to variables. This means no `let`, `let!`, `subject`, or even instance variables are necessary with TestBench.
* Both before/after blocks and setup/teardown methods are unnecessary. Put code that needs to run before a test before the test, and code that needs to run after a test after the test.
* Groups of tests can share a common setup and actuation that only gets executed once. Have multiple discrete tests that follow a single action, such as making an external HTTP API request? A TestBench file can written to perform the request once per run, or once per test, depending what's appropriate for the circumstance.
* Any log output or other telemetry produced by implementation code will be printed out alongside TestBench output.

### TestBench is an Object-Oriented Test Framework

TestBench's context specification DSL can be included in any class, making its functionality fully available to any object. Test classes, called "fixtures," can carry out a _fixed_ test procedure based on variable inputs. There is no difference between test code run from a script file or test code run from a fixture; they both behave the same way!

```ruby
module ArithmeticFixture
  include TestBench::Fixture

  attr_reader :value

  def initialize(value)
    @value = value
  end

  def call
    context "Multiplication" do
      test "Any value multiplied by zero is zero" do
        assert(value * 0 == 0)
      end
    end

    context "Addition" do
      test "Any value added by zero is the value" do
        assert(value + 0 == value)
      end
    end
  end
end
```

Using the TestBench DSL's `#fixture` method, the above test fixture is instantiated with the given value, `11`, and then executed:

```ruby
# Begin test/automated/arithmetic.rb

require_relative '../test_init'

context "Arithmetic" do
  fixture(ArithmeticFixture, 11)
end

# End test/automated/arithmetic.rb
```

Users of other Ruby test frameworks may recognize a similar feature in RSpec's shared examples, but TestBench fixtures offer very significant improvements:

* Fixtures can be unit tested in isolation, without their output interfering with the main test session. For example, a test of a fixture class can expect the fixture to fail, without that expected failure causing the overall test session to fail.
* Since fixtures are just Ruby classes, their inputs are declared explicitly as arguments passed to their initializer. RSpec shared examples, by contrast, cannot indicate what input values must be declared via `let` blocks.
* Fixtures can be published and packaged with your gems, without your gems having to depend on the whole TestBench framework. Instead, they only have to depend on [TestBench::Fixture](https://github.com/test-bench/test-bench-fixture), a library that has just what fixture classes need.
* Specialized assertions can also go in fixture classes, and unlike RSpec's matcher API, specialized assertions in TestBench also just use the same TestBench's context specification DSL that every test script is written in.

<div class="hero">
  <p class="action">
    <a href="/Documentation.html" class="nav-link action-button">Go To Documentation →</a>
  </p>
</div>
