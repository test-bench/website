---
sidebar: auto
sidebarDepth: 1
---

# Running Tests

TestBench doesn't require the use of any special test runner. It's designed so that tests can be executed using nothing more than Ruby. There's no need to create or maintain plugins for editors or CI servers. It's just Ruby.

## Using the Ruby Executable

Run test files like any script file by passing the file name to the `ruby` command.

```
> ruby test/automated/example.rb
Some Context
  Some test
  Some other test
  Some failing test
    test/automated/some_test.rb:13:in `block (2 levels) in <top (required)>': Assertion failed (TestBench::Fixture::AssertionFailure)
```

## Batch Runner

```ruby
TestBench::Run.(*paths, exclude_file_pattern: nil)
```

Run a batch of files and directories.

**Parameters**

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| paths | Single path name or list of path names to run | String or Array | test/automated |
| exclude_file_pattern | Pattern matching files to exclude | Regex | _init.rb$ |

The batch runner is run from within a Ruby script file.

Here is an example of the batch runner being invoked from a file named `automated.rb` located in the `test` directory.

```ruby
# test/automated.rb

TestBench::Run.('test/some_directory',
  exclude_file_pattern: /\/_|_init\.rb\z/
)
```

### Batch Runner Output

In addition to the test output printed when running a test using the Ruby executable, the batch runner prints a summary of the results of all the tests.

```
Some Context
  Some test
  Some other test
  Some failing test
    test/automated/some_test.rb:13:in `block (2 levels) in <top (required)>': Assertion failed (TestBench::Fixture::AssertionFailure)

Error Summary:
   1: test/automated/some_test.rb
      test/automated/some_test.rb:13:in `block (2 levels) in <top (required)>': Assertion failed (TestBench::Fixture::AssertionFailure)

Finished running 1 file
Ran 3 tests in 0.001s (3000.0 tests/second)
2 passed, 0 skipped, 1 failed, 1 total error
```

### Excluding Files

The batch runner allows files or directories to be excluded.

The runner's `exclude_file_pattern` parameter allows a regex pattern to be specified that excluded test files from the batch run. If a file name matches the regex pattern, it will be skipped.

``` ruby
TestBench::Run.('test/automated',
  exclude_file_pattern: /\/_|_init\.rb\z/
)
```

In this example above, files that start with underscore or that end with `_init.rb` are skipped.

## Command Line Runner

In addition to being able to run tests using the raw `ruby` executable, TestBench also provides it's own command line executable that offers a bit more power.

The `bench` executable can be used to run individual test files or directories containing test files.

### Running a Single File

To run a single test file, specify the file path as a command line argument.

``` bash
> bench test/automated/example.rb
```

### Running a Directory

To run a directory of test files, and its subdirectories, specify the directory path as a command line argument.

``` bash
> bench test/automated/some_directory/
```

### Default Test Directory

By default, when the `bench` commend is executed with no arguments, it will run all the test files under `test/automated`.

This default can be changed by setting the environment variable `TEST_BENCH_TESTS_DIRECTORY`.

### Piping Into the CLI

Test files and directories can be piped into the CLI via standard input ("stdin").

``` bash
> echo "test/automated/example.rb" | bench

> echo "test/automated/some_directory" | bench
```

### Command Line Switches

The `bench` command accepts command-line switches that configure how TestBench operates.

Each of the switches also has a corresponding environment variable which allows for TestBench to be configured for a local development environment.

Executing `bench` the `--help` or `-h` switches will print descriptions of the switches.

``` bash
> bench --help
Usage: bench [options] [paths]

Informational Options
    -h, --help                       Print this help message and exit successfully
    -V, --version                    Print version and exit successfully

Configuration Options
    -a, --[no-]abort-on-error        Exit immediately after any test failure or error (Default: off)
    -x, --[no-]exclude PATTERN       Do not execute test files matching PATTERN (Default: /_init.rb$/)
    -o PATTERN,                      Omit backtrace frames matching PATTERN (Default: /test_bench/)
        --[no-]omit-backtrace
    -l [none|summary|failure|pass|debug],
        --output-level               Sets output level (Default: pass)
    -s [on|off|detect],              Render output coloring and font styling escape codes (Default: detect)
        --output-styling
    -p                               Do not fail the test run if there are deactivated tests or contexts, e.g. _test or _context (Default: off)
        --[no-]permit-deactivated-tests
    -r, --[no-]reverse-backtraces    Reverse order of backtraces when printing errors (Default: off)

Paths to test files (and directories containing test files) can be given after any command line arguments or via STDIN (or both).
If no paths are given, a default path (test/automated) is scanned for test files.

The following environment variables can also control execution:

    TEST_BENCH_ABORT_ON_ERROR          Same as -a or --abort-on-error
    TEST_BENCH_EXCLUDE_FILE_PATTERN    Same as -x or --exclude-file-pattern
    TEST_BENCH_OMIT_BACKTRACE_PATTERN  Same as -o or --omit-backtrace-pattern
    TEST_BENCH_OUTPUT_LEVEL            Same as -l or --output-level
    TEST_BENCH_OUTPUT_STYLING          Same as -s or --output-styling
    TEST_BENCH_FAIL_DEACTIVATED_TESTS  Opposite of -p or --permit-deactivated-tests
    TEST_BENCH_REVERSE_BACKTRACES      Same as -r or --reverse-backtraces

Finally, the VERBOSE environment variable can set the output level to debug. If given, VERBOSE will take precedence over TEST_BENCH_OUTPUT_STYLING.
```
