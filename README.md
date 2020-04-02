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

<!--
```ruby
context "Thing" do
  context "Correct Data" do

    thing = Thing.new(Controls::Thing.correct_data)

    Save.(thing)


  end

  context "Incorrect Data" do
  end



    context "Save" do



    test "Saved" do
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
``` -->

```ruby
context "Arithmetic" do
  value = 11

  context "Multiplication" do
    context "By One" do
      result = value * 1

      test "Is the value of the multiplier" do
        assert(result == value)
      end
    end

    context "By Zero" do
      result = value * 0

      test "Is zero" do
        assert(result == 0)
      end
    end
  end

  context "Addition" do
    context "Of Zero" do
      result = value + 0

      test "Is the value added to zero" do
        assert(result == value)
      end
    end
  end
end
```
<div class="hero">
  <p class="action">
    <a href="/Documentation.html" class="nav-link action-button">Go To Documentation →</a>
  </p>
</div>
