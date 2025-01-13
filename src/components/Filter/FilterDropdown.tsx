import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

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

export type Item = {
  label: string;
  value: string;
  type: 'text' | 'number' | 'boolean';
};

type Props = {
  className?: string;
  label?: string;
  items: Item[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onApply?: (value: any) => void;
};

const FilterDropdown = ({ className = '', label = 'Open', items = [], onApply }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleApply = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      const formValues = {
        value: selectedItem?.type === 'number' ? Number(form.get('value')) : form.get('value'),
        operator: form.get('operator'),
      };

      onApply?.({
        item: selectedItem,
        ...formValues,
      });

      setIsOpen(false);
      setSelectedItem(null);
    },
    [onApply, selectedItem],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className={className} asChild>
        <Button variant="outline">{label}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col" align="start">
        {!selectedItem ? (
          items.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className="justify-start"
              onClick={() => setSelectedItem(item)}
            >
              {item.label}
            </Button>
          ))
        ) : (
          <form className="flex flex-col gap-2" onSubmit={handleApply}>
            <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)} type="button">
              Back
            </Button>
            <h2>{selectedItem.label}</h2>

            {selectedItem.type === 'number' ? (
              <RadioGroup defaultValue={OPERATORS[0].value} name="operator">
                {OPERATORS.map((operator) => (
                  <div className="flex cursor-pointer items-center space-x-2" key={operator.value}>
                    <RadioGroupItem id={operator.value} value={operator.value} />
                    <label htmlFor={operator.value} className="cursor-pointer text-sm">
                      {operator.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            ) : null}
            {selectedItem.type === 'boolean' ? (
              <RadioGroup defaultValue="true" name="value">
                <div className="flex cursor-pointer items-center space-x-2">
                  <RadioGroupItem id="true" value="true" />
                  <label htmlFor="true" className="cursor-pointer text-sm">
                    True
                  </label>
                </div>
                <div className="flex cursor-pointer items-center space-x-2">
                  <RadioGroupItem id="false" value="false" />
                  <label htmlFor="false" className="cursor-pointer text-sm">
                    False
                  </label>
                </div>
              </RadioGroup>
            ) : null}

            {selectedItem.type !== 'boolean' ? (
              <input
                type={selectedItem.type}
                className={cn('input', 'w-full')}
                placeholder={selectedItem.label}
                name="value"
                autoFocus
              />
            ) : null}
            <Button variant="primary" type="submit">
              Apply
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
