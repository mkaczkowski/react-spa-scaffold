import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InlineLoading, Loading, PageLoading } from '@/components/ui/loading';
import { Skeleton, SkeletonAvatar, SkeletonCard, SkeletonText } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { render } from '@/test-utils';

describe('Spinner', () => {
  it('renders with default size', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { container: sm } = render(<Spinner size="sm" />);
    const { container: lg } = render(<Spinner size="lg" />);

    expect(sm.querySelector('svg')).toHaveClass('size-4');
    expect(lg.querySelector('svg')).toHaveClass('size-8');
  });

  it('accepts custom className', () => {
    const { container } = render(<Spinner className="text-primary" />);
    expect(container.querySelector('svg')).toHaveClass('text-primary');
  });
});

describe('Loading', () => {
  it('renders spinner', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders text when provided', () => {
    render(<Loading text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders full screen version', () => {
    const { container } = render(<Loading fullScreen />);
    expect(container.firstChild).toHaveClass('fixed', 'inset-0');
  });
});

describe('PageLoading', () => {
  it('renders loading state', () => {
    render(<PageLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('InlineLoading', () => {
  it('renders inline loading', () => {
    render(<InlineLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('Skeleton components', () => {
  it('renders Skeleton', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders SkeletonText with multiple lines', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders SkeletonAvatar with different sizes', () => {
    const { container: sm } = render(<SkeletonAvatar size="sm" />);
    const { container: lg } = render(<SkeletonAvatar size="lg" />);

    expect(sm.firstChild).toHaveClass('size-8');
    expect(lg.firstChild).toHaveClass('size-12');
  });
});
