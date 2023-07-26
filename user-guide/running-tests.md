---
sidebar: auto
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

Finished running 1 file, 0 files crashed
Ran 3 tests in 0.010s (298 tests/second)
2 passed, 0 skipped, 1 failed

```

### Excluding Files

The batch runner allows files or directories to be excluded.

The runner's `exclude` parameter allows a regex pattern to be specified that excluded test files from the batch run. If a file name matches the regex pattern, it will be skipped.

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

This default can be changed by setting the environment variable `TEST_BENCH_TESTS_DIRECTORY`.

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

``` bash
> bench --help
Usage: bench [options] [paths]

Informational Options:
        -h, --help                        Print this help message and exit successfully
        -v, --version                     Print version and exit successfully

Configuration Options:
        -d, --[no]detail                  Always show (or hide) details (Default: failure)
        -x, --[no-]exclude PATTERN        Do not execute test files matching PATTERN (Default: "*_init.rb")
        -f, --[no-]only-failure           Don't display output for test files that pass (Default: off)
        -o, --output-styling [on|off|detect]
                                          Render output coloring and font styling escape codes (Default: detect)
        -s, --seed NUMBER                 Sets pseudo-random number seed (Default: not set)

Other Options:
        -r, --require LIBRARY             Require LIBRARY before running any files

Paths to test files (and directories containing test files) can be given after any command line arguments or via STDIN (or both).

If no paths are given, a default path (test/automated) is scanned for test files.

The following environment variables can also control execution:

        TEST_BENCH_DETAIL                 Same as -d or --detail
        TEST_BENCH_EXCLUDE_FILE_PATTERN   Same as -x or --exclude-file-pattern
        TEST_BENCH_ONLY_FAILURE           Same as -f or --only-failure
        TEST_BENCH_OUTPUT_STYLING         Same as -o or --output-styling
        TEST_BENCH_SEED                   Same as -s or --seed

```
