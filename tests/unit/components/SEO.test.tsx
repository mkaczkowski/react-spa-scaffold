import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SEO } from '@/components/shared/SEO';

describe('SEO', () => {
  it('renders title with app name', () => {
    render(<SEO title="Test Page" />);

    expect(document.title).toBe('Test Page | My App');
  });

  it('renders default title when no title provided', () => {
    render(<SEO />);

    expect(document.title).toBe('My App');
  });

  it('renders meta description', () => {
    render(<SEO description="Test description" />);

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute('content', 'Test description');
  });

  it('renders default description when none provided', () => {
    render(<SEO />);

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute('content', 'A modern React application');
  });

  it('renders keywords meta tag when provided', () => {
    render(<SEO keywords={['react', 'typescript', 'vite']} />);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toHaveAttribute('content', 'react, typescript, vite');
  });

  it('does not render keywords meta when empty array', () => {
    render(<SEO keywords={[]} />);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toBeNull();
  });

  it('renders Open Graph tags', () => {
    render(<SEO title="OG Test" description="OG Description" />);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogType = document.querySelector('meta[property="og:type"]');

    expect(ogTitle).toHaveAttribute('content', 'OG Test | My App');
    expect(ogDescription).toHaveAttribute('content', 'OG Description');
    expect(ogType).toHaveAttribute('content', 'website');
  });

  it('renders og:image when provided', () => {
    render(<SEO ogImage="https://example.com/image.jpg" />);

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage).toHaveAttribute('content', 'https://example.com/image.jpg');
  });

  it('renders Twitter Card tags', () => {
    render(<SEO title="Twitter Test" description="Twitter Description" />);

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    expect(twitterTitle).toHaveAttribute('content', 'Twitter Test | My App');
    expect(twitterDescription).toHaveAttribute('content', 'Twitter Description');
  });

  it('renders canonical URL when provided', () => {
    render(<SEO canonical="https://example.com/page" />);

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://example.com/page');
  });

  it('does not render canonical when not provided', () => {
    render(<SEO />);

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toBeNull();
  });

  it('renders noindex robots meta when noIndex is true', () => {
    render(<SEO noIndex />);

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).toHaveAttribute('content', 'noindex, nofollow');
  });

  it('does not render robots meta when noIndex is false', () => {
    render(<SEO noIndex={false} />);

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots).toBeNull();
  });

  it('renders article type when specified', () => {
    render(<SEO ogType="article" />);

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType).toHaveAttribute('content', 'article');
  });
});
