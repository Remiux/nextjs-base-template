import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site';

import Home from './page';

describe('Home', () => {
  it('renders the project name as the main heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1, name: siteConfig.name })).toBeInTheDocument();
  });

  it('tells the developer which file to edit', () => {
    render(<Home />);

    expect(screen.getByText('src/app/page.tsx')).toBeInTheDocument();
  });

  it('renders a link to the documentation', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: /documentation/i })).toHaveAttribute(
      'href',
      expect.stringContaining('nextjs.org/docs'),
    );
  });
});
