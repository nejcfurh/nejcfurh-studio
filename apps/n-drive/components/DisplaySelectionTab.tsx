import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GridIcon, Rows2Icon } from 'lucide-react';

const DisplaySelectionTab = ({
  display,
  handleChange,
}: {
  display: 'grid' | 'table';
  handleChange: (display: 'grid' | 'table') => void;
}) => {
  const handleDisplayChange = (display: 'grid' | 'table') => {
    handleChange(display);
  };
  return (
    <Tabs defaultValue={display} className="ml-6">
      <TabsList>
        <TabsTrigger
          value="grid"
          onClick={() => handleDisplayChange('grid')}
          className="flex items-center gap-2"
        >
          <GridIcon /> Grid
        </TabsTrigger>
        <TabsTrigger
          value="table"
          onClick={() => handleDisplayChange('table')}
          className="flex items-center gap-2"
        >
          <Rows2Icon /> Table
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DisplaySelectionTab;
