self.__BUILD_MANIFEST = {
  "/": [
    "./static/chunks/pages/index.js"
  ],
  "/[...slug]": [
    "./static/chunks/pages/[...slug].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/[...slug]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()