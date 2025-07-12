---
sidebarDepth: 2
---

# Running Tests

TestBench doesn't require the use of any special test runner. It's designed so that tests can be executed using nothing more than Ruby. There's no need to create or maintain plugins for editors or CI servers. It's just Ruby.

## Using the Ruby Executable

Run test files like any script file by passing the file name to the `ruby` command.

```
> ruby test/automated/example.rb
Example Context
  Some passing test
  Some other passing test
  Some failing test
    Assertion failed

Failure: 1

```

## Batch Runner

Runs a batch of files and directories.

**API**

```ruby
TestBench::Run.(path, exclude: nil)
```

**Parameters**

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| path | Path name to run | String or Array | test/automated |
| exclude | Pattern matching files to exclude | String | `*_init.rb` |

The batch runner is run from within a Ruby script file.

Here is an example of the batch runner being invoked from a file named `automated.rb` located in the `test` directory.

```ruby
# test/automated.rb

TestBench::Run.('test/automated')
```

### Batch Runner Output

In addition to the test output printed when running a test using the Ruby executable, the batch runner prints a summary of the results of all the tests.

```
Running test/automated/example.rb
Example Context
  Some passing test
  Some other passing test
  Some failing test
    Assertion failed

Failure: 1

Failure Summary:
- test/automated/example.rb: 1 failure

Attempted 1 file: 1 completed, 0 aborted, 0 not found
3 tests in 0.01 seconds (298.59 tests/sec)
2 passed, 1 failed, 0 skipped

```

### Excluding Files

The batch runner allows files or directories to be excluded.

The runner's `exclude` parameter allows a shell glob pattern to be specified that excluded test files from the batch run. If a file name matches the pattern, it will be skipped.

``` ruby
TestBench::Run.('test/automated',
  exclude: '{_*,*_init}.rb'
)
```

In this example above, files that start with underscore or that end with `_init.rb` are skipped.

## Command Line Runner

In addition to being able to run tests using the raw `ruby` executable, TestBench also provides it's own command line executable that offers a bit more power.

The `bench` executable can be used to run individual test files or directories containing test files.

### Running a Single File

To run a single test file, specify the file path as a command line argument.

``` bash
> bench test/automated/some_test.rb
```

### Running a Directory

To run a directory of test files, and its subdirectories, specify the directory path as a command line argument.

``` bash
> bench test/automated/some_directory/
```

### Default Test Directory

By default, when the `bench` commend is executed with no arguments, it will run all the test files under `test/automated`.

This default can be changed by setting the environment variable `TEST_BENCH_DEFAULT_TEST_PATH`.

### Piping Into the CLI

Test files and directories can be piped into the CLI via standard input ("stdin").

``` bash
> echo "test/automated/some_test.rb" | bench

> echo "test/automated/some_directory" | bench
```

### Command Line Switches

The `bench` command accepts command-line switches that configure how TestBench operates.

Each of the switches also has a corresponding environment variable which allows for TestBench to be configured for a local development environment.

Executing `bench` the `--help` or `-h` switches will print descriptions of the switches.

```
> bench --help
Usage: bench [options] [paths]

Informational Options:
  Help:
      -h, --help
          Print this help message and exit immediately

Execution Options:
  Abort On Failure:
      -a, --abort-on-failure
          Stops execution if a test fails or a test file aborts

  Exclude File Patterns:
      -x, --exclude PATTERN
          Exclude test files that match PATTERN
          If multiple --exclude arguments are supplied, then files that match any will be excluded
      -X, --no-exclude
          Don't exclude any files
      Default: '*_init.rb'

  Strict:
      -s, --strict
          Prohibit skipped tests and contexts, and require at least one test to be performed
      -S, --no-strict
          Relax strictness
      Default: non strict, unless TEST_BENCH_STRICT is set to 'on'

  Require Library:
      -r, --require LIBRARY
          Require LIBRARY before running any files
      -I, --include DIR
          Add DIR to the load path

  Random Seed:
      --random-seed SEED
          Pseudorandom number seed

Output Options:
  Backtrace Formatting:
      -b, --omit-backtrace PATTERN
          Omits backtrace frames that match PATTERN
          If multiple --omit-backtrace arguments are supplied, then frames that match any will be omitted

  Detail:
      -d, --detail
          Always show details
      -D, --no-detail
          Never show details
      Default: print details when their surrounding context failed, unless TEST_DETAIL is set to 'on' or 'off'

  Device:
      --device DEVICE
          stderr: redirect output to standard error
          null: don't write any output
      Default: stdout

  Verbosity:
      -l, --output-level LEVEL
          all: print output from every file
          not-passing: print output from files that skip tests and contexts or don't perform any tests
          failure: print output only from files that failed or aborted
          abort: print output only from file that aborted
      -q, --quiet
          Sets output verbosity level to 'not-passing'
      Default: all

  Styling:
      -o, --output-styling
          Enable output text styling
      -O, --no-output-styling
          Disable output text styling
      Default: enabled if the output device is an interactive terminal

  Summary:
      --no-summary
          Don't print summary after running files

Paths to test files (and directories containing test files) can be given after any command line arguments or via STDIN (or both).

If no paths are given, the directory 'test/automated' is scanned for test files.

The following environment variables can also control execution:

  TEST_BENCH_ABORT_ON_FAILURE           See --abort-on-failure
  TEST_BENCH_EXCLUDE_FILE_PATTERN       See --exclude
  TEST_BENCH_OUTPUT_SUMMARY             See --no-summary
  TEST_BENCH_STRICT                     See --strict
  TEST_BENCH_RANDOM_SEED                See --random-seed
  TEST_BENCH_FILTER_BACKTRACE_PATTERN   See --filter-backtrace
  TEST_BENCH_OUTPUT_DETAIL              See --detail
  TEST_BENCH_OUTPUT_DEVICE              See --device
  TEST_BENCH_OUTPUT_LEVEL               See --output-level
  TEST_BENCH_OUTPUT_STYLING             See --output-styling
  TEST_BENCH_DEFAULT_TEST_PATH          Specifies default path

```
