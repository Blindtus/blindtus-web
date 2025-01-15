import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownRendererProps = {
  children: string;
};

const MarkdownRenderer = ({ children }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
          <div className="mt-16 justify-between xs:flex">
            <h1 className="page-title" {...props} />
          </div>
        ),
        h2: (props) => <h2 className="mb-4 mt-8 text-2xl font-bold" {...props} />,
        h3: (props) => <h3 className="mb-4 mt-6 text-xl font-bold" {...props} />,
        h4: (props) => <h4 className="mb-4 mt-4 text-lg font-bold" {...props} />,
        p: (props) => <p {...props} className="mb-2" />,
        a: (props) => (
          <a
            {...props}
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        ul: (props) => <ul {...props} className="mb-4 ml-5 list-disc" />,
        li: (props) => <li {...props} className="mb-1" />,
        hr: (props) => <hr {...props} className="my-8 h-px border-0 bg-gray-200/30" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
