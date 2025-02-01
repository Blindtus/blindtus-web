import React, { useCallback, useState } from 'react';

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
  const [allTags, setAllTags] = useState<Tag[]>(
    tags.map((tag, index) => ({
      id: Date.now() + index,
      text: tag,
    })),
  );
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = useCallback(() => {
    const tagText = inputValue.trim();

    if (!tagText) return;

    // Check for duplicates (case-insensitive)
    const isDuplicate = allTags.some((tag) => tag.text.toLowerCase() === tagText.toLowerCase());
    if (isDuplicate) {
      setInputValue(''); // Clear input if duplicate
      return;
    }

    const newTag = { id: Date.now(), text: tagText };

    setAllTags((prevTags) => {
      const updatedTags = [...prevTags, newTag];
      onChange(updatedTags.map((tag) => tag.text));
      return updatedTags;
    });

    setInputValue(''); // Clear input after adding tag
  }, [inputValue, allTags, onChange]);

  const handleRemoveTag = useCallback(
    (tagId: number) => {
      setAllTags((prevTags) => {
        const updatedTags = prevTags.filter((tag) => tag.id !== tagId);
        onChange(updatedTags.map((tag) => tag.text));
        return updatedTags;
      });
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault(); // Prevent form submission or focus change
      handleAddTag();
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
            {tag.text}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="cursor-pointer transition-all hover:brightness-50"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter & Tab
      />
    </div>
  );
};

export default InputTag;
