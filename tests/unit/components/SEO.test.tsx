import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SEO } from '@/components/shared/SEO';

describe('SEO', () => {
  describe('title', () => {
    it.each([
      { title: 'Test Page', expected: 'Test Page | My App' },
      { title: undefined, expected: 'My App' },
    ])('renders "$expected"', ({ title, expected }) => {
      render(<SEO title={title} />);
      expect(document.title).toBe(expected);
    });
  });

  describe('meta tags', () => {
    it.each([
      { prop: 'description', selector: 'meta[name="description"]', value: 'Test desc', attr: 'content' },
      { prop: 'ogImage', selector: 'meta[property="og:image"]', value: 'https://example.com/img.jpg', attr: 'content' },
      { prop: 'canonical', selector: 'link[rel="canonical"]', value: 'https://example.com/page', attr: 'href' },
      { prop: 'ogType', selector: 'meta[property="og:type"]', value: 'article', attr: 'content' },
    ])('renders $prop correctly', ({ prop, selector, value, attr }) => {
      render(<SEO {...{ [prop]: value }} />);
      expect(document.querySelector(selector)).toHaveAttribute(attr, value);
    });

    it('renders default description', () => {
      render(<SEO />);
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'A modern React application',
      );
    });
  });

  describe('keywords', () => {
    it('renders keywords when provided', () => {
      render(<SEO keywords={['react', 'typescript']} />);
      expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute('content', 'react, typescript');
    });

    it('omits keywords when empty', () => {
      render(<SEO keywords={[]} />);
      expect(document.querySelector('meta[name="keywords"]')).toBeNull();
    });
  });

  describe('Open Graph / Twitter', () => {
    it('renders OG and Twitter tags', () => {
      render(<SEO title="Test" description="Desc" />);

      expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Test | My App');
      expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', 'Desc');
      expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    });
  });

  describe('robots', () => {
    it.each([
      { noIndex: true, expected: 'noindex, nofollow' },
      { noIndex: false, expected: null },
    ])('noIndex=$noIndex renders correctly', ({ noIndex, expected }) => {
      render(<SEO noIndex={noIndex} />);
      const robots = document.querySelector('meta[name="robots"]');
      if (expected) {
        expect(robots).toHaveAttribute('content', expected);
      } else {
        expect(robots).toBeNull();
      }
    });
  });

  describe('optional elements', () => {
    it('omits canonical when not provided', () => {
      render(<SEO />);
      expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    });
  });
});
