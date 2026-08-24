import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './page';

describe('Home', () => {
  it('renders the getting started heading', () => {
    render(<Home />);

    expect(screen.getByText(/to get started, edit the/i)).toBeInTheDocument();
  });

  it('renders a link to the documentation', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: /documentation/i })).toHaveAttribute(
      'href',
      expect.stringContaining('nextjs.org/docs'),
    );
  });
});
