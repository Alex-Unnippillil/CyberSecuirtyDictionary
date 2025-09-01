import React, { useMemo, useState } from "react";

interface ShareBuilderProps {
  /** Base URL of the site, e.g., https://example.com */
  baseUrl: string;
  /** ID of the element or term to link to */
  targetId: string;
  /** Optional default selection text */
  defaultSelection?: string;
}

/**
 * ShareBuilder renders a simple modal that allows a user to compose a
 * shareable URL for the current page.  UTM parameters can be supplied and any
 * selected text may be highlighted when the link is opened.
 */
const ShareBuilder: React.FC<ShareBuilderProps> = ({
  baseUrl,
  targetId,
  defaultSelection = "",
}) => {
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [selection, setSelection] = useState(defaultSelection);

  const shareUrl = useMemo(() => {
    const url = new URL(baseUrl);
    if (utmSource) url.searchParams.set("utm_source", utmSource);
    if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
    if (selection) url.searchParams.set("sel", encodeURIComponent(selection));
    url.hash = targetId;
    return url.toString();
  }, [baseUrl, targetId, utmSource, utmMedium, utmCampaign, selection]);

  return (
    <div className="share-modal">
      <h2>Share Link</h2>
      <label>
        UTM Source
        <input
          type="text"
          value={utmSource}
          onChange={(e) => setUtmSource(e.target.value)}
        />
      </label>
      <label>
        UTM Medium
        <input
          type="text"
          value={utmMedium}
          onChange={(e) => setUtmMedium(e.target.value)}
        />
      </label>
      <label>
        UTM Campaign
        <input
          type="text"
          value={utmCampaign}
          onChange={(e) => setUtmCampaign(e.target.value)}
        />
      </label>
      <label>
        Text to highlight (optional)
        <input
          type="text"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        />
      </label>
      <input type="text" readOnly value={shareUrl} />
    </div>
  );
};

export default ShareBuilder;
