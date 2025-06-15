import { type FC } from "react";

export const HorizontalGoogleAds: FC = () => {
  return (
    <div className="mt-8">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1941263261411851"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1941263261411851"
        data-ad-slot="2984328311"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  );
};
