export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="adsense"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5925353368498146"
      crossOrigin="anonymous"
    />,
  ]);
};