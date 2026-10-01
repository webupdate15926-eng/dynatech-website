import assert from "node:assert/strict";
import test from "node:test";

import { getCloudinaryRawPdfPublicId, getPdfViewerHref, isCloudinaryRawPdfUrl } from "../lib/cloudinary-pdf.ts";

const pdfUrl = "https://res.cloudinary.com/example/raw/upload/v1790864300/dynatech-cms/report.pdf";

test("Cloudinary raw PDF URLs use the signed viewer route", () => {
  assert.equal(isCloudinaryRawPdfUrl(pdfUrl), true);
  assert.equal(getPdfViewerHref(pdfUrl), `/api/media/pdf?url=${encodeURIComponent(pdfUrl)}`);
  assert.equal(getCloudinaryRawPdfPublicId(pdfUrl, "example"), "dynatech-cms/report.pdf");
});

test("the signed viewer rejects other clouds and non-PDF files", () => {
  assert.equal(getCloudinaryRawPdfPublicId(pdfUrl, "another-cloud"), null);
  assert.equal(isCloudinaryRawPdfUrl("https://example.com/report.pdf"), false);
  assert.equal(isCloudinaryRawPdfUrl("https://res.cloudinary.com/example/raw/upload/report.docx"), false);
  assert.equal(getPdfViewerHref("/documents/report.pdf"), "/documents/report.pdf");
});
