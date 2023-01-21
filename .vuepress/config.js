import { defaultTheme } from '@vuepress/theme-default';
import { searchPlugin } from '@vuepress/plugin-search';

export default {
  title: 'TestBench',
  description: 'Principled Test Framework for Ruby',
  dest: './_build',
  plugins: [searchPlugin()],
  theme: defaultTheme({
    activeHeaderLinks: true,
    navbar: [
      {
        text: 'Home', link: '/'
      },
      {
        text: 'Values', link: '/values.md'
      },
      {
        text: 'User Guide', children: [
          { text: 'Getting Started', link: '/user-guide/getting-started.md' },
          { text: 'Writing Tests', link: '/user-guide/writing-tests.md' },
          { text: 'Fixtures', link: '/user-guide/fixtures.md' },
          { text: 'Running Tests', link: '/user-guide/running-tests.md' },
          { text: 'Recipes', link: '/user-guide/recipes.md' },
          { text: 'Tips', link: '/user-guide/tips.md' }
        ]
      },
      // {
      //   text: 'Examples', children: [
      //     { text: 'Overview', link: '/examples/' },
      //     { text: 'Quickstart', link: '/examples/quickstart.md' },
      //     { text: 'Example Projects', link: '/examples/example-projects.md' }
      //   ]
      // },
      {
        text: 'Code', link: 'https://github.com/test-bench/test-bench'
      }
    ]
  })
}
