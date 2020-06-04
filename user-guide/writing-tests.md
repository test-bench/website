---
sidebar: auto
sidebarDepth: 1
---

# Writing Tests

TestBench's API is just five core methods: `context`, `test`, `assert`, `comment`, and `fixture`. Other methods, such as `refute`, are built in terms of the core methods.

## Context and Test Blocks

The `context` method establishes a context around a block of test code.

``` ruby
context "Some Context" do
  test "Some test" do
    # ...
  end
end
```

The blocks given to `context` can further subdivide the test file into nested, sub-contexts.

### Nested Contexts

``` ruby
context "Some Context" do
  context "Some Inner Context" do
    test "Some test" do
      # ...
    end
  end
end
```

### Lexical Scoping

Ruby's lexical scoping allows variables defined in outer contexts to be available within nested contexts, but not available outside of the outer context.

``` ruby
context "Some Context" do
  context "Some Inner Context" do
    some_variable = 'some_value'

    context "Some Deeper Context" do
      puts some_variable
      # => "some_value"
    end
  end

  puts some_variable
  # => NameError (undefined local variable or method `some_variable' for main:Object)
end
```

### Test Blocks

Tests are titled blocks of code that perform assertions, typically one per test.

``` ruby
context "Some Context" do
  test "Some test" do
    assert(true)
  end

  test "Some other test" do
    assert(true)
  end
end
```

### Optional Titles

Titles are optional for both contexts and tests. Contexts without a title serve solely as lexical scopes and do not effect the test output in any way; nothing is printed and the indentation is not changed. Tests without titles are treated similarly, but if a test fails, a title of `Test` is used to indicate the test failure. Also, both contexts and tests can also be skipped by omitting the block argument.

``` ruby
context "Some Context" do
  context do
    some_variable = 'some_value'

    test do
      assert(some_variable == 'some_value')
    end
  end

  context do
    some_variable = 'some_other_value'

    test do
      assert(some_variable == 'some_other_value')
    end
  end
end
```

### Deactivating Contexts and Tests

Contexts and tests can be deactivated by prefixing them with the underscore character: `_context` and `_test`.

They're useful for temporarily disabling a context or test when debugging, troubleshooting, or doing exploratory testing.

``` ruby
context "Some Context" do

  # This context doesn't run
  _context "Some Inner Context" do
    test "Some test" do
      assert(true)
    end
  end

  context "Some Other Inner Context" do

    # This test doesn't run
    _test "Some test" do
      assert(true)
    end
  end
end
```

::: danger
A test run that includes deactivated contexts or tests will fail. A CI build that includes deactivated tests will result in a broken build.

Deactivated tests and contexts should **never** be checked in to version control. Checking in deactivated test code should be seen as a development process failure.

This behavior can be changed by setting the `TEST_BENCH_FAIL_DEACTIVATED_TESTS` environment variable to `off`.
:::

## Comments

Test output is intended to be read by users.

Often, the text printed by `context` and `test` sufficiently expresses what behavior the tests are expecting out of the test.

Comments can also be included in test code in order to provide the user with additional output.

```ruby
context "Some Context" do
  comment "Some comment"
  comment "Other comment"

  # ...
end
```

## Assertions

TestBench offers four assertion methods: `assert`, `refute`, `assert_raises`, and `refute_raises`.

### Assert and Refute

The `assert` and `refute` methods accept a single parameter. The value of the parameter must either be true or false, or _truthy_.

```ruby
assert(true)               # Passes
assert(false)              # Fails
assert(1 == 1)             # Passes
assert(some_object.nil?)   # Passes if some_object is nil
assert(1 > 1)              # Fails

refute(true)               # Fails
refute(false)              # Passes
refute(1 != 1)             # Passes
refute(!some_object)       # Passes if some_object is *not* nil
```

### Assert Raises and Refute Raises

To test that a block of code raises an error, use `assert_raises`. To test that a block of code _does not_ raise an error, use `refute_raises`.

Either method takes a block argument, and the respective assertion will either pass or fail based on whether the block raises an error when it's evaluated.

```ruby
# Passes
assert_raises do
  raise 'Some error message'
end

# Fails
assert_raises do

end

# Passes
refute_raises do

end

# Fails
refute_raises do
  raise 'Some error message'
end
```

If a class is given as the first positional parameter, the block must raise an instance of the given class.

```ruby
# Passes
assert_raises(RuntimeError) do
  raise 'Some error message'
end

# Fails
assert_raises(SomeOtherError) do
  raise 'Some error message'
end

# Passes
refute_raises(RuntimeError) do
  raise SomeOtherError
end

# Fails
refute_raises(SomeOtherError) do
  raise SomeOtherError
end
```

To match the raised error's message, the error message can be specified as the second argument.

```ruby
# Passes
assert_raises(RuntimeError, 'Some error message') do
  raise 'Some error message'
end

# Fails
assert_raises(RuntimeError, 'Some error message') do
  raise 'Some other error message'
end

# Passes
refute_raises(RuntimeError, 'Some error message') do
  raise 'Some other error message'
end

# Fails
refute_raises(RuntimeError, 'Some error message') do
  raise 'Some error message'
end
```

#### Strict Error Class Matching

The block cannot raise a subclass of the specified error class. To match against subclasses of the specified error class, supply the keyword argument `strict: false`.

A string can also be given as the second positional parameter, which is an error message that the exception raised by the block must match precisely.

When the given block raises an error that is not the error class specified, the error is _not_ rescued by `assert_raises`. Such an error was not anticipated by the test, and thus is not treated any different than any other error.

```ruby
# Passes because ArgumentError is a subclass of StandardError
assert_raises(StandardError, strict: false) do
  raise ArgumentError
end

# Fails because ArgumentError is not a subclass of RuntimeError
assert_raises(RuntimeError, strict: false) do
  raise ArgumentError
end
```

### Block-Form Assertions

In addition to its more basic form, `assert` can also take an optional block containing test code. All of TestBench’s facilities can be used inside a block-form assertion, including `context`, `test`, `assert`, `refute`, `assert_raises`, `refute_raises`, and `comment`. All tests performed by the block must pass in order to satisfy the block-form assertion.

The block-form assertion builds on the basic TestBench features to provide domain-specific assertions composed of lower-level assertions, as well as context blocks, test blocks, comments, and all other basic TestBench features.

Test output produced by the block is printed only when the assertion fails, allowing the block to convey useful details about the failure.

When a block is passed to `assert`, a positional argument must not be passed along with it.

The block given to a block-form assertion must perform at least one assertion, otherwise the block will fail.

TestBench itself uses block-form assertions to compose the `assert_raises` and `refute_raises` assertions.

An example of a block-form assertion:

```ruby
context "Block-form Assertion Example" do
  def assert_json(string)
    assert do
      comment "Assert JSON: #{string.to_s[0..100]}"

      assert(string.is_a?(String))

      test "Can be parsed as JSON" do
        refute_raises(JSON::ParserError) do
          JSON.parse(string)
        end
      end
    end
  end

  test "Pass" do
    assert_json('{ "someKey": "some-value" }')
  end

  test "Failure" do
    assert_json('not-a-json-document')
  end
end
```

In the above example, an assertion failure location would not refer to the correct source code file and line number. An optional caller_location keyword argument can be passed to the assertion to specify the actual failure location.

```ruby
def assert_json(string, caller_location: nil)
  caller_location ||= caller_locations.first

  assert(caller_location: caller_location) do
    # ...
  end
end
```

Here is the output of running the above test. Notice that, while the passing test case prints no output, the failing test case prints out detailed failure information:

```
Block-form Assertion Example
  Pass
  Failure
    test/automated/block_form_assertions/example.rb:7:in `assert_json': Assertion failed (TestBench::Fixture::AssertionFailure)
      Assert JSON: not-a-json-document
        Prohibited Error: JSON::ParserError (strict)
        Raised Error: #<JSON::ParserError: 767: unexpected token at 'not-a-json-document'>
      Can be parsed as JSON
        test/automated/block_form_assertions/example.rb:13:in `block (2 levels) in assert_json': Assertion failed (TestBench::Fixture::AssertionFailure)
```

The block-form of assert allows TestBench to offer detailed assertion failure output similar to other testing frameworks, but it offers two significant advantages over them:

- Specialized assertions are implemented using the same interface that TestBench users already know (versus, for instance, RSpec’s matcher API which is entirely separate from its testing DSL)
- Output from block-form assertions can be printed even when the assertions pass, by setting the output level to debug, either via passing `--output-level debug` to the bench executable, or by setting the `TEST_BENCH_OUTPUT_LEVEL` environment variable to `debug`.
