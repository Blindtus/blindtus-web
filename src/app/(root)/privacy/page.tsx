import { getLocale } from 'next-intl/server';

import MarkdownRenderer from '@/components/MarkdownRenderer/MarkdownRenderer';
import { loadMarkdown } from '@/utils/markdownUtils';

const PrivacyPage = async () => {
  const locale = await getLocale();
  const filePath = `privacy/privacy.${locale}.md`;
  const content = await loadMarkdown(filePath);

  return (
    <main className="container">
      <MarkdownRenderer>{content}</MarkdownRenderer>
    </main>
  );
};

export default PrivacyPage;
