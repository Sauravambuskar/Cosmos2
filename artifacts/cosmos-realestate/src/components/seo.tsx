import { Helmet } from "react-helmet-async";
import { canonical, siteUrl } from "@/lib/seo";
import { useSiteSettings } from "@/hooks/use-site-settings";

interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/residential" — used for the canonical URL. */
  path: string;
  keywords?: string;
  image?: string;
  /** Set for property/project detail pages. */
  type?: "website" | "article";
  /** JSON-LD objects to inject. */
  schemas?: object[];
  /** Keep admin and thin pages out of the index. */
  noindex?: boolean;
}

/**
 * Per-page document head. Because this is a single-page app, every route must
 * set its own title, description and canonical — otherwise all URLs share the
 * homepage metadata and compete with each other in search results.
 *
 * Site name, canonical host, share image and the site-wide noindex switch come
 * from Site Settings, so they can be changed from the admin panel.
 */
export default function Seo({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
  schemas = [],
  noindex = false,
}: SeoProps) {
  const settings = useSiteSettings();
  const root = siteUrl(settings);
  const url = canonical(path, settings);
  const chosenImage = image || settings.seo.ogImage;
  const absoluteImage = chosenImage.startsWith("http") ? chosenImage : `${root}${chosenImage}`;
  const hidden = noindex || settings.seo.noindexSite;
  const analyticsId = settings.seo.googleAnalyticsId.trim();

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={hidden ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />

      {/* Open Graph */}
      <meta property="og:site_name" content={settings.seo.siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Analytics, when a measurement ID is configured in Site Settings. */}
      {analyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
      )}
      {analyticsId && (
        <script>
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}');`}
        </script>
      )}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
