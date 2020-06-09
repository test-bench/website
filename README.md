---
home: true
heroImage: /test-bench-icon-130x115.png
description: 'Principled Test Framework for Ruby'
features:

- title: Simple
  details: >
    The TestBench core API has just four methods. There's nothing hidden. There's no guessing, no monkey-patching, no configuration, and no complexity. It's just programming.

- title: Principled
  details: >
    TestBench encourages clean test design that reflects fundamental principles. It has no superfluous syntax that leads to cumbersome tests. It has no opinions, but makes no apologies.

- title: It's Just Ruby
  details: >
    Tests in TestBench are just Ruby scripts. They execute from top to bottom with no special runner and no special way to declare variables. If you know Ruby, you know TestBench.

footer: MIT Licensed | Copyright © 2020-present Nathan Ladd
---

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
    <a href="/user-guide/getting-started.html" class="nav-link action-button">Get Started →</a>
  </p>
</div>
