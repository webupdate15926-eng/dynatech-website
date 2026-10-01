export function isCloudinaryRawPdfUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname === "res.cloudinary.com"
      && /\/raw\/upload\//i.test(url.pathname)
      && /\.pdf$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function getPdfViewerHref(value: string) {
  return isCloudinaryRawPdfUrl(value)
    ? `/api/media/pdf?url=${encodeURIComponent(value)}`
    : value;
}

export function getCloudinaryRawPdfPublicId(value: string, cloudName: string) {
  try {
    if (!isCloudinaryRawPdfUrl(value)) return null;
    const url = new URL(value);
    const prefix = `/${cloudName}/raw/upload/`;
    if (!url.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^v\d+\//, "");
    return path.toLowerCase().endsWith(".pdf") ? path : null;
  } catch {
    return null;
  }
}
