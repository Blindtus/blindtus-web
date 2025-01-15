import { getLocale } from 'next-intl/server';

import MarkdownRenderer from '@/components/MarkdownRenderer/MarkdownRenderer';
import { loadMarkdown } from '@/utils/markdownUtils';

const TermsPage = async () => {
  const locale = await getLocale();
  const filePath = `terms/terms.${locale}.md`;
  const content = await loadMarkdown(filePath);

  return (
    <main className="container">
      <MarkdownRenderer>{content}</MarkdownRenderer>
    </main>
  );
};

export default TermsPage;
