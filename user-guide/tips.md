---
sidebar: auto
sidebarDepth: 0
---

# Tips

- one assertion per test block
- use explaining variable; be aware of usability and cognition
- use the file system
- usability; create a TOC
- no monkey patching
- clarity; clarify
- don't confuse simplicity for things you already understand. if you're not a Ruby coder, the problem isn't that TB isn't simple, but that you don't have a grasp of Ruby and software design fundamentals
- use blockless contexts and tests to create todo lists
- use _context and _test to deactivate while debugging
_ exclude underscore-prefixed TestBench::CLI.(
  exclude_file_pattern: %r{/_\z}
)
- isolate tests because there's no random ordering

