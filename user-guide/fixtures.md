---
sidebarDepth: 1
---

# Fixtures

A fixture is a pre-defined, reusable test abstraction. The objects under test are specified at runtime, rather than hard-coded.

To get a better understanding of fixtures, imagine a regular test file, but the object (or objects) under test can be swapped so that the same standardized test implementation can be used against multiple objects.

A fixture is just a plain old Ruby object that includes the TestBench API. A fixture has access to the same API that any TestBench test would. By including the `TestBench::Fixture` module into a Ruby object, the object acquires all of the methods available to a test script, including `context`, `test`, `assert`, `refute`, `assert_raises`, `refute_raises`, `comment`, and `detail`.

## Fixture API

### Callable Object

The only requirement placed on a fixture's API is that it implements Ruby's _callable object_ protocol by implementing the `call` method, and that the signature of the method is parameterless.

### Fixture State and the Initializer

State is passed to a fixture object via the positional parameters of its initializer.

``` ruby
class SomeFixture
  include TestBench::Fixture

  def initialize(something, something_else)
    @something = something
    @something_else = something_else
  end

  def call
    # ...
  end
end
```

If the fixture class implements a method named `build`, that method will be used to construct an instance rather than the initializer, leaving the developer the freedom to either implement the `initialize` method or not.

## Implementing Fixtures

The TestBench API is just Ruby methods. There's no special syntax to invoke TestBench API methods, or any special rules or setup.

In the simplest case, a test can be implemented directly in the `call` method.

``` ruby
class SomeFixture
  include TestBench::Fixture

  attr_accessor :something
  attr_accessor :something_else

  def initialize(something, something_else)
    @something = something
    @something_else = something_else
  end

  def call
    context "Some Context" do
      context "Something" do
        included = something_else.include?(something)

        test "Included in Something Else" do
          assert(included)
        end
      end

      context "Something Else" do
        twice_as_long = something_else.length == something.length * 2

        test "Twice as long as something" do
          assert(twice_as_long)
        end
      end
    end
  end
end
```

## Using Fixtures

In addition to TestBench's core API for writing tests, the API also provides the `fixture` method for activating fixtures in a test script.

``` ruby
context "Some Fixture" do
  something = 'some value'
  something_else = something * 2

  fixture(SomeFixture, something, something_else)
end
```

The `fixture` method runs the test code in the fixture as if its part of the currently running test, maintaining the continuity of the output and indenting.

```
Other Context
  Some Context
    Something
      Included in Something Else
    Something Else
      Twice as long as something

```

**API**

`fixture(fixture_class, *args, **kwargs, test_session: nil, &block)`

**Parameters**

| Name          | Description                                                  | Type                 |
| ------------- | ------------------------------------------------------------ | -------------------- |
| fixture_class | Fixture class that will be actuated                          | `Class`              |
| args          | Arguments to pass to the fixture class's initializer         | `Array`              |
| kwargs        | Keyword arguments to pass to the fixture class's initializer | `Hash`               |
| test_session  | Reserved for used internally by TestBench                    | `TestBench::Session` |
| block         | Block argument to pass to the fixture class's initializer    | `Proc`               |

When supplied a fixture class, the `fixture` method instantiates the fixture class and invokes its `call` method. The parameters sent to the `fixture` method are passed along to the fixture's initializer.

When supplied a fixture object, the `fixture` method extends `TestBench::Fixture` onto the object as well as the object's `Fixture` module. If no
`Fixture` module can be resolved, an error is raised.

The `fixture` method also shares the running test script's output object with the fixture in order to preserve output continuity.

## Exercising Fixtures

Because fixtures are just Ruby objects, they can be instantiated and exercised just like any other Ruby object.

``` ruby
something = 'some value'
something_else = 'some value'

some_fixture = SomeFixture.new(something, something_else)

some_fixture.()

puts TestBench::Fixture.output(some_fixture)
```

```
Some Context
  Something
    Included in Something Else
  Something Else
    Twice as long as something
      Assertion failed

Failure: 1

```

## Testing Fixtures

If a fixture is sufficiently elaborate, it can even be tested like a plain old object.

``` ruby
context "SomeFixture" do
  something = 'some value'
  something_else = 'some value'

  some_fixture = SomeFixture.new(something, something_else)

  some_fixture.()

  context "Included in Something Else" do
    passed = some_fixture.test_session.test_passed?('Included in Something Else')

    test "Passed" do
      assert(passed)
    end
  end

  context "Twice as long as something" do
    failed = some_fixture.test_session.test_failed?('Twice as long as something')

    test "Failed" do
      assert(failed)
    end
  end
end
```

```
SomeFixture
  Included in Something Else
    Passed
  Twice as long as something
    Failed

```

A fixture's output can be printed by supplying the fixture to the `comment` or `detail` method:

```ruby
context "SomeFixture" do
  some_fixture = SomeFixture.new(something, something_else)

  # Prints the fixture's output
  comment some_fixture

  # ...
end
```

## Distributing Fixtures with a Library

Libraries can provide a set of fixtures that users of the library can leverage to test code that uses the library.

A library that ships a set of fixtures doesn't have to take a dependency on the entirety of TestBench. The `TestBench::Fixture` namespace is its own self-contained package. That package is safe to be packaged with production code, whereas TestBench, being a test framework, should not be distributed with production code.
