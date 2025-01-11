import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OPERATORS = [
  {
    value: '$eq',
    label: 'Equal',
  },
  {
    value: '$ne',
    label: 'Not Equal',
  },
  {
    value: '$gt',
    label: 'Greater Than',
  },
  {
    value: '$lt',
    label: 'Less Than',
  },
  {
    value: '$gte',
    label: 'Greater Than or Equal',
  },
  {
    value: '$lte',
    label: 'Less Than or Equal',
  },
];

type FilterOperatorProps = {
  value?: string;
  onChange: (_value: string) => void;
};

const FilterOperator = ({ value, onChange }: FilterOperatorProps) => {
  return (
    <Select defaultValue={value || OPERATORS[0].value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Operator" />
      </SelectTrigger>
      <SelectContent>
        {OPERATORS.map((operator) => (
          <SelectItem key={operator.value} value={operator.value}>
            {operator.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterOperator;
