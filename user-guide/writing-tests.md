---
sidebar: auto
sidebarDepth: 0
---

# Writing Tests

TestBench's API is just five core methods: `context`, `test`, `assert`, `comment`, and `fixture`. Other methods, such as `refute`, are built in terms of the core methods.

### Context and Test

The `context` method establishes a context around a block of test code. The blocks given to `context` can further divide the test file into sub-contexts.

Ruby's lexical scoping allows variables defined in outer contexts to be available within nested contexts, but not available outside of the outer context.

Tests are titled blocks of code that perform assertions, typically one per test.

Titles are optional for both contexts and tests. Contexts without a title serve solely as lexical scopes and do not effect the test output in any way; nothing is printed and the indentation is not changed. Tests without titles are treated similarly, but if a test fails, a title of `Test` is used to indicate the test failure. Also, both contexts and tests can also be skipped by omitting the block argument.

Contexts and tests can be deactivated by prefixing them with the underscore character: `_context` and `_test`. They're useful for temporarily disabling a context or test when debugging, troubleshooting, or doing exploratory testing, but should never be checked in.

### Comments

With TestBench, test file output is intended to be read by users. Often, the text printed by `context` and `test` sufficiently expresses what behavior the tests are expecting out of the test subject. However, comments can also be included in test code in order to provide the user with additional output:

```ruby
context "Some Context" do
  comment "Some comment"
  comment "Other comment"

  # ...
end
```

### Assertions

TestBench offers four assertion methods: `assert`, `refute`, `assert_raises`, and `refute_raises`.

#### Assert and Refute

The `assert` and `refute` methods accept a single positional parameter. An `AssertionFailure` error is raised by both methods based on whether the value of the positional parameter is `nil` or `false`:

```ruby
assert(1 == 1)             # Passes
assert(some_object.nil?)   # Passes if some_object is nil
refute(1 != 1)             # Passes
refute(!some_object)       # Passes if some_object is *not* nil

assert(1 > 1)              # Fails
refute(true)               # Fails
```

#### Assert and Refute Raises

To test that a block of code raises an error, use `assert_raises`. It can be called with no arguments, in which case the given block must raise a `StandardError` of some kind. If a class is given as the first positional parameter, the block must raise an instance of the given class. The block cannot raise a subclass of the given class; to permit the block to raise a subclass, supply the keyword argument `strict: false`. A string can also be given as the second positional parameter, which is an error message that the exception raised by the block must match precisely.

When the given block raises an error that is not the class given to `assert_raises`, the error is _not_ rescued by `assert_raises`. Such an error was not anticipated by the test, and thus is not treated any different than any other error.

```ruby
# Passes
assert_raises do
  raise "Some error message"
end

# Passes
assert_raises(KeyError) do
  {}.fetch(:some_key)
end

# Passes
assert_raises(RuntimeError, "Some error message") do
  raise "Some error message"
end

# Fails
assert_raises do
end

# Does not pass or fail; the error raised by the block is not rescued
# by assert_raises, because it does not match the given class.
assert_raises(ArgumentError) do
  raise RuntimeError
end

# Like the above example, the error raised by the block is not
# rescued. Even though the block raises a KeyError, which is a
# subclass of IndexError, assert_raises is strict about errors being
# an instance of the given class (and not a subclass).
assert_raises(IndexError) do
  {}.fetch(:some_key)
end

# Passes because the strictness is relaxed
assert_raises(IndexError, strict: false) do
  {}.fetch(:some_key)
end

# Fails; error messages do not match precisely
assert_raises(RuntimeError, "Other error message") do
  raise "Some error message"
end
```

The `refute_raises` method complements `assert_raises`. When no argument is given, the block is expected to _not_ raise a `StandardError` of any kind. When a class is given as an argument, the block must not raise an error of the given class. Similar to `assert_raises`, if the block raises an error that is not an instance of the given class, the error is not rescued by `refute_raises` at all. Unlike its counterpart, however, `refute_raises` does not accept a second message argument.

```ruby
# Passes
refute_raises do
end

# Fails
refute_raises do
  raise "Some error message"
end

# Passes
refute_raises(KeyError) do
end

# Fails
refute_raises(KeyError) do
  {}.fetch(:some_key)
end

# Does not pass or fail; the error raised by the block is not rescued
# by assert_raises, because it does not match the given class.
refute_raises(ArgumentError) do
  raise RuntimeError
end

# Like the above example, the error raised by the block is not
# rescued. Even though the block raises a KeyError, which is a
# subclass of IndexError, refute_raises is strict about errors being
# an instance of the given class (and not a subclass).
refute_raises(IndexError) do
  {}.fetch(:some_key)
end

# Assertion failure, unlike above, because the strictness is relaxed
refute_raises(IndexError, strict: false) do
  {}.fetch(:some_key)
end
```

As is evident from the examples, `assert_raises` and `refute_raises` have _three_ possible outcomes, not two: they can pass, they can fail, or they can surface any error they didn't anticipate.

#### Block-form Assertions

The block-form assertion builds on the basic TestBench features to provide domain-specific assertions composed of lower-level assertions, as well as context blocks, test blocks, comments, and all other basic TestBench features.

In addition to its more basic form, `assert` can also take an optional block containing test code. All of TestBench’s facilities can be used inside a block-form assertion, including `context`, `test`, `assert`, `refute`, `comment`, etc. All tests performed by the block must pass in order to satisfy the assertion.

By default, any test output produced by the block is printed only when the assertion fails, allowing the block to convey useful details about the failure.

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

1. Specialized assertions are implemented using the same interface that TestBench users already know (versus, for instance, RSpec’s matcher API which is entirely separate from its testing DSL)
2. Output from block-form assertions can be printed even when the assertions pass, by setting the output level to debug, either via passing `--output-level debug` to the bench executable, or by setting the `TEST_BENCH_OUTPUT_LEVEL` environment variable to `debug`.
