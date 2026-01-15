export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('script, style, iframe, object, embed').forEach((node) => {
    node.remove();
  });

  doc.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};
