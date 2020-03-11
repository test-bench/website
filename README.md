---
home: true
description: 'Design-oriented test framework for Ruby'
features:
- title: Simple
  details: The core context specification DSL contains just a few methods, like context, test, assert, and refute.
- title: Intuitive
  details: TestBench scripts behave just like any other ruby script. No more having to imagine how the test framework executes the test code behind the scenes!
- title: Powerful
  details: Define reusable test classes (“Fixtures”) that leverage the TestBench DSL you already know to curb redundancy across test files.
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
* Because local variables work fine in scripts, there is no need to use a declarative API to assign values to variables. This means no `let`, `let!`, `subject`, or even instance variables are necessary with TestBench.
* Both before/after blocks and setup/teardown methods are unnecessary. Put code that needs to run before a test before the test, and code that needs to run after a test after the test.
* Groups of tests can share a common setup and actuation that only gets executed once. Have multiple discrete tests that follow a single action, such as making an external HTTP API request? A TestBench file can written to perform the request once per run, or once per test, depending what's appropriate for the circumstance.
* Any log output or other telemetry produced by implementation code will be printed out alongside TestBench output.

<div class="hero">
  <p class="action">
    <a href="/Documentation.html" class="nav-link action-button">Go To Documentation →</a>
  </p>
</div>
