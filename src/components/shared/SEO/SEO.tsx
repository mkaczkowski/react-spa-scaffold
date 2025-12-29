import { APP_CONFIG } from '@/lib/config';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION = 'A modern React application';

/**
 * SEO component using React 19's native document metadata support.
 * These tags are automatically hoisted to the <head> section.
 */
export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
