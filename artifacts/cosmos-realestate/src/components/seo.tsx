import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, canonical } from "@/lib/seo";

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
 */
export default function Seo({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  schemas = [],
  noindex = false,
}: SeoProps) {
  const url = canonical(path);
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
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

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
