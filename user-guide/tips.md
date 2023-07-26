---
sidebar: auto
sidebarDepth: 1
---

# Tips

These tips are advice taken from years of hard work and learning about testing, test design, software design, usability design, and development process. These are not rules that should be applied blindly. They're guidelines that are effective in the vast majority of cases.

## Read the Test Output

There's a good reason that modern test frameworks allow the expression of tests using the hierarchical _context/specification_ style: The tests are intended to provide human-readable output that can be consumed by developers and other stakeholders to review the understanding of the system and the requirements expressed in the test output.

Take time to read and review the output printed when tests are run. You may be surprised to find how often this activity can expose not only misunderstandings of requirements and expectations, but also de facto design mistakes, and poor test structuring.

## Write Test Descriptions to be Read

This tip is the other side of the code of the _Read the Test Output_ tip.

The reason to write context descriptions and test descriptions is to have them be read. When you're writing the test descriptions, read and re-read the descriptions to make sure that the appropriate meaning is conveyed.

## Or Don't Write Test Descriptions at All

If you just can't come up with good test descriptions, or if you don't have the mental energy to come up with the right language, then skip it for now and come back later.

You can write `context` blocks and `test` blocks without providing any description at all.

``` ruby
context do
  test do
  end
end
```

## Separate Automated Tests from Interactive Tests

Some tests should always be executed with the intention of having an operator eye-balling the output. Usually these are "final inspection" tests where the operator isn't really expecting to find any problems, but that final step of having a human operator perform interactive tests is critical to being able to certify the software as being de facto verified.

Interactive testing is a necessary and healthy part of testing practice. It's neither something that should be eliminated or that _can_ be eliminated.

Separate automated tests from interactive tests by putting them in separate directories under your principal `test` directory.

``` bash{4,6}
|-test
| |-test_init.rb
| |-automated.rb
| |-automated
| | |-automated_init.rb
| |-interactive
| | |-interactive_init.rb
```

Note that interactive tests are not intended to be run as a batch in an automated fashion, and therefore, there's no `interactive.rb` batch runner on the `test` directory.

## Use Anonymous Context Blocks for Scoping

You may find that you need to use Ruby's lexical scoping to isolate test state.

You can use anonymous context blocks to create lexical scopes to ensure that the state of a test isn't accessible to another test.

``` ruby
context "Some Context" do
  context do
    value = true

    test "Something true" do
      assert(value)
    end
  end

  context do
    value = false

    test "Something false" do
      refute(value)
    end
  end
end
```

## Specify the Experience Rather than the Implementation

When writing test descriptions, try to describe the _experience_ of the software that you're specifying, rather than the implementation.

Avoid this:

``` ruby
context "Calculator" do
  sum = calculator.sum(1, 11, 111)

  test "#sum" do
    assert(sum == 123)
  end
end
```

Prefer this:

``` ruby
context "Sum" do
  sum = calculator.sum(1, 11, 111)

  test "Addends are added" do
    assert(sum == 123)
  end
end
```

The test implementation itself will already document the implementation that is being tested.

The natural language part of the test descriptions should be used to document the system from the vantage point of a user of the system. This is true even if the user of the system is other code, rather than a human user.

Remember that BDD is about describing observations of the _behavior_. The names of methods, and such mechanical implementation concerns, aren't _behavior_. Such things are _implementation details_, and they should not appear in test descriptions.

## Only Assertions in Test Blocks

Avoid putting any code in test blocks other than assertions.

Code that declares variables, or any other supporting code, should be outside of the test block in the context block that encompasses it.

## Literate and Scannable Code

_Readability_ is a less desirable quality of code than _scannability_.

Code should be understood at a glance. Avoid forcing users to have to read code in detail rather grasp its essence at a glance. Avoid forcing users to seek out the details of the test implementation, and write test code so that knowledge leaps off the screen.

Except for the most trivial of assertions, move meaningful things to the left margin of the code and avoid nesting significant facts about a test into an assertion.

Use _explaining variables_ to highlight meaningful and significant elements.

``` ruby
context "Sum" do
  sum = calculator.sum(1, 11, 111)

  added = (sum == 123)

  test "Addends are added" do
    assert(added)
  end
end
```

## Consistent Language

The descriptions and the implementation should reflect each other.

The test descriptions are the English (or whatever language) representation of the test's meaning, and the Ruby is the programming language representation of the same meaning.

Your goal is to provide interpretations of the same idea in both natural language and programming language.

The language of the test description and the language of the assertion code should be consistent with each other.

``` ruby
test "Addition of two numbers" do
  assert(two_numbers_added)
end
```

## Create Knowledge Hierarchies

Knowledge hierarchies, or _taxonomies_, are a critical characteristic of creating navigable tests.

Write tests so that outer contexts are more general, and inner contexts are more specific.

``` ruby
context "Calculator" do
  context "Sum" do
    sum = calculator.sum(1, 11, 111)

    test "Addends are added" do
      assert(sum == 123)
    end
  end
end
```

## Use Small and Focused Test Files

Avoid lengthy test files, and avoid anti-patterns like having a single test file per class, with many unrelated contexts and concerns.

Use a single file for a given test context. For some object or concern that can be used in different ways, create a different test file for each context, and organize those files into a directory.

Don't be afraid to use the file system to organize test concerns. There's little value in reducing the number of test files in a test suite. Just organize them sensibly.

## Use the File System as a Table of Contents

The file system's hierarchy of directories and files
is a natural table of contents.

Leverage the file system to create a navigable table of contents that the user can browse and explore to familiarize themselves with the concerns of the system under test, as well as the tests themselves.

## Use Empty Tests to Create To-Do Lists

Contexts and tests can be written without blocks. You can leverage this aspect of the TestBench API to write empty tests that act as to-do lists for tests that have yet to be written.

``` ruby
context "Some Context" do
  test "Something"
  test "Something Else"
end
```

## Temporarily Deactivate Contexts and Tests While Debugging

It can be useful occasionally when debugging a test to deactivate some of the tests in a test file or context.

Contexts and tests can be deactivated by adding an underscore prefix to their declaration.

``` ruby
context "Calculator" do
  context "Sum" do
    sum = calculator.sum(1, 11, 111)

    # This test will not be executed
    _test "Addends are added" do
      assert(sum == 123)
    end
  end

  # This context will not be executed
  _context "Subtract" do
    # ...
  end
end
```

## Exclude Files from Execution

While TestBench offers no dedicated feature to exclude certain files from execution, you can use the [batch runner's](/user-guide/running-tests.html#batch-runner) exclusion capability to skip files that match a pattern.

For example, you can use a pattern that skips files that start with the underscore pattern. When you want to deactivate a file, rename it and prefix the filename with `_`.

```ruby
# test/automated.rb

TestBench::Run.('test/some_directory',
  exclude: "{_*,*_init}.rb"
)
```

## Distribute Fixtures with a Library

If you're a developer of a library that other people are going to use, you can provide a set of fixtures that your users can leverage in their own tests that use your library.

A library that ships a set of fixtures doesn't have to take a dependency on the entirety of TestBench. The `TestBench::Fixture` namespace is its own self-contained package. That package is safe to be packaged with production code, whereas TestBench, being a test framework, should not be distributed with production code.
