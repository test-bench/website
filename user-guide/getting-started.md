---
sidebar: auto
sidebarDepth: 0
---

# Getting Started

## Installation

### Via RubyGems

``` bash
> gem install test_bench
```

### Via Bundler

``` ruby
# Gemfile
source 'https://rubygems.org'

gem 'test_bench', group: :development

# Or

group :development do
  gem 'test_bench'
end
```

## Initialize TestBench

Place a test initialization file at test/test_init.rb.

``` ruby
# test/test_init.rb

# Load the code to be tested
require_relative '../lib/my/code.rb'

# Load TestBench
require 'test_bench'

# Activate TestBench
TestBench.activate
```

Activating TestBench with `TestBench.activate` makes the core DSL available in test files.

The effect of activating TestBench is very limited. It adds TestBench's core API methods to Ruby's `main` object, which is the Ruby script runner. Activating TestBench has no effects on any other objects or classes in the Ruby system except for the `main` script runner.

It's not strictly necessary to activate TestBench in order to use it. See the [Using TestBench Without Monkey Patching](/user-guide/recipes.md#use-testbench-without-monkey-patching) recipe for specifics.

## Load the Test Initialization File

At the top of every test file, load the `test_init.rb` file.

``` ruby
# test/automated/example.rb

require_relative '../test_init'

context "Some Example" do
  test "Some test" do
    assert(true)
  end
end
```
