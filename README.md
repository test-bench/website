---
home: true
description: 'Design-oriented test framework for Ruby'
features:
- title: Simple
  details: The core context specification DSL contains just a few methods, like `context`, `test`, `assert`, and `refute`.
- title: Intuitive
  details: TestBench scripts behave just like any other ruby script. No more having to imagine how the test framework executes the test code behind the scenes!
- title: Powerful
  details: Define reusable test classes (“Fixtures”) that leverage the TestBench DSL you already know to curb redundancy across test files.
footer: MIT Licensed | Copyright © 2020-present Nathan Ladd
---

TestBench is a no-nonsense testing framework for Ruby aiming to offer precisely what is needed to test well-designed code effectively and easily. In stark contrast to most other testing frameworks, test files are written using a procedural API, not a declarative one, which brings a score of substantial benefits in exchange for largely immaterial drawbacks. 

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

TestBench files can be run directly by Ruby ...

```
> ruby test/automated/arithmetic.rb 
Arithmetic
  Multiplication
    Any value multiplied by zero is zero
  Addition
    Any value added by zero is the value

```

... or with the TestBench executable, `bench`:

```
> bench test/automated/arithmetic.rb
Running test/automated/arithmetic.rb
Arithmetic
  Multiplication
    Any value multiplied by zero is zero
  Addition
    Any value added by zero is the value

Finished running 1 file
Ran 2 tests in 0.008s (250.0 tests/second)
2 passed, 0 skipped, 0 failed, 0 total errors

```

<div class="hero">
  <p class="action">
    <a href="/Documentation.html" class="nav-link action-button">Go To Documentation →</a>
  </p>
</div>
