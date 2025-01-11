import React, { useCallback } from 'react';

import { X } from 'lucide-react';

import { Input } from '../ui/input';

type Tag = {
  id: number;
  text: string;
};

type InputTagProps = {
  tags?: Array<string>;
  onChange: (_tags: Array<string>) => void;
  placeholder?: string;
};

const InputTag = ({ tags = [], onChange, placeholder = 'Enter tag' }: InputTagProps) => {
  const [allTags, setAllTags] = React.useState<Tag[]>(
    tags.map((tag, index) => ({
      id: Date.now() + index,
      text: tag,
    })),
  );

  const handleAddTag = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const input = e.currentTarget.querySelector('input');
      if (!input) {
        return;
      }

      const tagText = input.value.trim();

      if (!tagText) {
        return;
      }

      const newTag = {
        id: Date.now(),
        text: tagText,
      };

      setAllTags((prevTags) => [...prevTags, newTag]);
      onChange([...allTags.map((tag) => tag.text), tagText]);
      input.value = '';
    },
    [allTags, onChange],
  );

  const handleRemoveTag = useCallback(
    (tagId: number) => {
      setAllTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      onChange(allTags.filter((tag) => tag.id !== tagId).map((tag) => tag.text));
    },
    [allTags, onChange],
  );

  return (
    <div>
      <div className="mb-2">
        {allTags.map((tag) => (
          <div
            key={tag.id}
            id={tag.id.toString()}
            className="mb-2 mr-2 inline-flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1"
          >
            {tag.text}
            <span
              onClick={() => handleRemoveTag(tag.id)}
              className="cursor-pointer transition-all hover:brightness-50"
            >
              <X size={16} />
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTag}>
        <Input placeholder={placeholder} />
      </form>
    </div>
  );
};

export default InputTag;
