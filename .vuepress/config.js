module.exports = {
  title: 'TestBench',
  description: 'A Principled Test Framework for Ruby',
  dest: './_build',
  themeConfig: {
    activeHeaderLinks: true,
    nav: [
      {
        text: 'Home', link: '/'
      },
      {
        text: 'Values', link: '/values.md'
      },
      {
        text: 'User Guide', items: [
          { text: 'Getting Started', link: '/user-guide/getting-started.md' },
          { text: 'Writing Tests', link: '/user-guide/writing-tests.md' },
          { text: 'Running Tests', link: '/user-guide/running-tests.md' },
          { text: 'Fixtures', link: '/user-guide/fixtures.md' },
          { text: 'Tips', link: '/user-guide/tips.md' },
          { text: 'Recipes', link: '/user-guide/recipes.md' }
        ]
      },
      {
        text: 'Examples', items: [
          { text: 'Overview', link: '/examples/' },
          { text: 'Quickstart', link: '/examples/quickstart.md' },
          { text: 'Example Projects', link: '/examples/example-projects.md' }
        ]
      },
      {
        text: 'Code', link: 'https://github.com/test-bench/test-bench'
      }
    ]
  }
}
