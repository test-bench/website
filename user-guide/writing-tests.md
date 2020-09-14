---
sidebar: auto
sidebarDepth: 1
---

# Writing Tests

TestBench's core API is just a handful of methods, including `context`, `test`, `assert`, `comment`, and `fixture`. Other methods, such as `refute` and `assert_raises` are built in terms of the core methods.

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

Multiple lines of text can be given as arguments to `comment`, and each will be indented at the same level as the first:

```ruby
context "Some Context" do
  comment "Multiline", "Comment", "Example"
end
```

## Details

When tests fail, it is often necessary to see details of the test scenario itself in order to diagnose the failure. However, it is generally undesirable to see information about the test scenario when reading the output from a test file that passes. For that reason, _detailed_ output can be printed with `detail`:

```ruby
context "Some Context" do
  test "Passing test" do
    detail "Will not be printed"

    assert(true)
  end

  test "Failing test" do
    detail "Will be printed"

    assert(false)
  end
end
```

Like comments, multiple lines of text can be given to `detail`, and each will be indented at the same level as the first:

```ruby
context "Some Context" do
  test "Failing test" do
    detail "Multiline", "Detail", "Example"

    assert(false)
  end
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
```

Unlike `assert_raises`, `refute_raises` does not accept an optional error message.

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

## Specialized Assertions and Details

Test details are printed only when the test file fails, allowing the output to convey useful information about the failure. This allows for declaring more specialized assertions that print all information that might be pertinent to the end user debugging the failure.

TestBench itself uses details in the `assert_raises` and `refute_raises` assertions to convey what exceptions (if any) were raised, which exceptions were expected, etc.

An example of using details to provide extra output for a higher level assertion:

```ruby
context "Detail Example" do
  def assert_json(string)
    detail "Assert JSON: #{string.to_s[0..100]}"

    assert(string.is_a?(String))

    test "Can be parsed as JSON" do
      refute_raises(JSON::ParserError) do
        JSON.parse(string)
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

  assert(string.is_a?(String), caller_location: caller_location)

  detail "Assert JSON: #{string.to_s[0..100]}"

  test "Can be parsed as JSON" do
    refute_raises(JSON::ParserError, caller_location: caller_location) do
      JSON.parse(string)
    end
  end
end
```

Here is the output of running the above test. Notice that, while the passing test case prints no output, the failing test case prints out detailed failure information:

```
Detail Example
  Pass
    Assert JSON: { "someKey": "some-value" }
    Can be parsed as JSON
      Prohibited Error: JSON::ParserError (strict)
      (No error was raised)
  Failure
    Assert JSON: not-a-json-document
    Can be parsed as JSON
      Prohibited Error: JSON::ParserError (strict)
      Raised Error: #<JSON::ParserError: 783: unexpected token at 'not-a-json-document'>
      scratch/json_example.rb:14:in `block in assert_json': Assertion failed (TestBench::Fixture::AssertionFailure)
```

Specialized assertions with TestBench can offer detailed assertion failure output similar to other testing frameworks, but it offers two significant advantages over them:

- Specialized assertions are implemented using the same interface that TestBench users already know (versus, for instance, RSpec’s matcher API which is entirely separate from its testing DSL)
- Unlike typical assertion failure messages from other testing frameworks, output from details can be printed even when the assertions pass, by setting the output level to debug, either via passing `--detail` to the bench executable, or by setting `TEST_BENCH_DETAIL` environment variable to `on`.
