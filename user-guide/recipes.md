---
sidebar: auto
sidebarDepth: 1
---

# Recipes

Following the [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), TestBench is designed to cooperate with the surrounding operating system, leveraging tools that are already part of the operating system, rather than maintaining duplicate implementations as part of the TestBench code.

These recipes offer TestBench users the benefit of features commonly found in most test frameworks, while reinforcing the learning and use of tools that have always been at their fingertips.

## Run All Tests in a Directory

The `bench` [executable](/user-guide/running-tests.md) can run all tests in a single directory. If TestBench is installed globally, invoke `bench` directly in your shell:

```
> bench test/automated/some_directory/
```

In cases where gems are installed locally within a project, the `bench` executable must be run from wherever the project installs executable files for gems. For instance:

```
> ./gems/bin/bench test/automated/some_directory
```

## Use TestBench Without Monkey Patching

[Activating](/user-guide/getting-started.md#-initialize-testbench) TestBench makes the core DSL available in test files.

To use TestBench without activating it, wrap test code in an outer `TestBench.context` block.

``` ruby{1}
TestBench.context "Example Context" do
  test "Pass" do
    assert(true)
  end
end
```

Alternatively, the test code can be wrapped in a `TestBench.evaluate` block.

``` ruby{1}
TestBench.evaluate do
  context "Example Context" do
    test "Pass" do
      assert(true)
    end
  end
end
```

TestBench never modifies Ruby's `Object` class. It modifies Ruby's `main` object, which is Ruby's script runner. The effect of activating TestBench is the addition of the methods `context`, `test`, `assert`, `refute`, `assert_raises`, `refute_raises`, and `comment`,  to the `main` object.

The `main` object is just the runner object within which Ruby executes script files. Adding TestBench's rather small API to the runner is extremely unlikely to cause the problems experienced when test frameworks presume to modify `Object`, `BasicObject`, or `Kernel`, which causes sweeping changes to the entire Ruby environment and all the classes and objects within it.

## Randomize Test Execution Order

TestBench executes test files as they are loaded. The load order, and thus the execution order, is Ruby's decision to make. However, your operating system already has facilities for changing the order of execution.

The `bench` executable can execute file names fed in through a pipe, as any good Unix program should. Combining `find`, `shuf`, and `bench` randomizes the execution order.

```
# Linux
> find test/automated -name '*.rb' | shuf | bench

# OSX
> find test/automated -name '*.rb' | gshuf | bench
```

The `find` command line utility scans the test directory for test files and prints them to the standard output device, `stdout`. That list of files is then piped to the `shuf` command, which randomizes, or _shuffles_, the order of the text piped into it.

The `shuf` utility is part of the standard [`coreutils`](https://www.gnu.org/software/coreutils/coreutils.html) package.

Mac OS users can install `coreutils` via [Homebrew](https://formulae.brew.sh/formula/coreutils) (or any other package manager that provides a `coreutils` distribution). On Mac OS, the `shuf` command is called `gshuf`.

## Parallel Test Execution

TestBench's runner doesn't execute tests in parallel. As with [randomized execution order](#randomizing-the-execution-order), parallelization is a responsibility that belongs to the operating system, and that the operating system already provides.

The `bench` executable can execute file names fed in through a pipe, as any good Unix program should. Combining `find`, `awk`, and `bench` executes subsets of test files in parallel:

```
# Run one half of the test files under test/automated
> find test/automated -name '*.rb' | awk 'NR % 2 == 0' | bench

# Run the other half of the test files under test/automated
> find test/automated -name '*.rb' | awk 'NR % 2 == 1' | bench
```

Parallel test execution is achieved by running multiple test runners in separate native operating system processes, and feeding each runner with a different subset of test files.

The `find` command line utility scans the test directory for test files and prints them to the standard output device, `stdout`. The `awk` command then splits list of files into subsets. Finally, the `bench` command executes the files names fed in through the pipe.

The above examples need to be run in separate terminal windows. A single shell script could run them in the background, and then wait for each segment to finish:

```sh
#!/bin/sh

find test/automated -name '*.rb' | awk 'NR % 2 == 0' | bench &

find test/automated -name '*.rb' | awk 'NR % 2 == 1' | bench &

wait
```

## Change TestBench's Output Device

TestBench's output device can be set via `TestBench.output=` attribute.

```ruby
# test/test_init.rb

# ...

TestBench.output = SomeOutput.new
```

Multiple outputs can also be assigned via an array, e.g.:

```ruby
TestBench.output = [TestBench::Output.build, SomeOutput.new]
```

To write custom output classes, mix in the [TestBench::Fixture::Output module](https://github.com/test-bench/test-bench-fixture/blob/master/lib/test_bench/fixture/output.rb). The arguments given to each method are the data relevant to the output method. For instance, the `finish_test` method has two parameters, `title` and `result`. `title` is the text string that's supplied to `test` (or `nil` if the test has no title), and `result` is a boolean indicating whether the test passed or failed.

## Re-Run Failed Tests

To have TestBench re-run failed test files, the failed test files are first printed to `stdout`. The list of failed test files will then be piped into the `bench` command.

The following script will run the test files contained in `test/automated` and print the names of files that have failed to `stdout`.

```ruby
#!/bin/sh

# script/run-tests-and-print-failures.sh

require 'test_bench'

class PrintFailedTestFiles
  include TestBench::Fixture::Output

  def exit_file(path, result)
    failed = result ? false : true

    STDOUT.puts(path) if failed
  end
end

TestBench.output = PrintFailedTestFiles.new

TestBench::Run.('test/automated')
```

The output of the script is then piped to the `bench` command.

``` bash
> ./script/run-tests-and-print-failures.sh | bench
```

By replacing TestBench's output with an implementation that prints the test files that have failed, the script produces output that can be fed into `bench`. If all the tests pass the first time, `bench` won't re-run any failed test files, and will exit successfully.
