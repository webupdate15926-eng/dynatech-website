import assert from "node:assert/strict";
import test from "node:test";

import { normalizeCmsDocument } from "../lib/cms/normalize-document.ts";
import { groupSectionFields, isHiddenField } from "../components/admin/editor-model.ts";

test("legacy tech videos keep their titles paired with their files", () => {
  const oldDocument = {
    content: { videoSection: { items: [{ title: "First", description: "" }, { title: "Second", description: "" }] } },
    media: { ieaVideo: "/first.mp4", catlVideo: "/second.mp4" },
  };
  const result = normalizeCmsDocument("tech-info", oldDocument);
  assert.deepEqual(result.content.videoSection.items.map(({ title, src }) => [title, src]), [
    ["First", "/first.mp4"], ["Second", "/second.mp4"],
  ]);
  assert.equal(oldDocument.content.videoSection.items[0].src, undefined);
  result.content.videoSection.items.reverse();
  assert.equal(result.content.videoSection.items[0].src, "/second.mp4");
});

test("partner video overrides survive normalization and removal", () => {
  const document = {
    content: { copy: { gallery: [{ label: "First", src: "/replacement.mp4" }, { label: "Second" }] } },
    media: { gallery: ["/old-first.mp4", "/old-second.mp4"] },
  };
  const result = normalizeCmsDocument("partner-fft", document);
  assert.deepEqual(result.content.copy.gallery.map(({ src }) => src), ["/replacement.mp4", "/old-second.mp4"]);
  result.content.copy.gallery.splice(0, 1);
  assert.equal(result.content.copy.gallery[0].src, "/old-second.mp4");
  assert.deepEqual(normalizeCmsDocument("partner-cu", { content: { copy: { gallery: [] } }, media: document.media }).content.copy.gallery, []);
});

test("editable sections expose new controls but hide obsolete parallel media", () => {
  assert.equal(isHiddenField(["content", "technologyPartners", "partners", 2, "ctaHref"], "technology-partners"), false);
  assert.equal(isHiddenField(["media", "gallery"], "partner-fft"), true);
  assert.equal(isHiddenField(["media", "ieaVideo"], "tech-info"), true);
  assert.equal(isHiddenField(["content", "figures", 0, "countTo"], "the-auto-hub"), true);
  const groups = groupSectionFields({ title: "Contact", recipientEmail: "team@example.com", categories: [] }, "en", "contact", ["content", "form"]);
  assert.ok(groups.some(({ value }) => value.recipientEmail === "team@example.com"));
});
