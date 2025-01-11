import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MEDIA_TYPES = [
  {
    value: 'movie',
    label: 'Movie',
  },
  {
    value: 'tv',
    label: 'TV Show',
  },
];

type MediaTypeSelectorProps = {
  value?: string;
  onChange: (_value: string) => void;
};

const MediaTypeSelector = ({ value, onChange }: MediaTypeSelectorProps) => {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Media Type" />
      </SelectTrigger>
      <SelectContent>
        {MEDIA_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MediaTypeSelector;
