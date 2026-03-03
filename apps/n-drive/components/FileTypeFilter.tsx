import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Doc } from '@/convex/_generated/dataModel';

const FileTypeFilter = ({
  handleChangeType,
  fileType
}: {
  handleChangeType: (value: Doc<'files'>['type'] | 'all') => void;
  fileType: Doc<'files'>['type'] | 'all';
}) => {
  return (
    <div className="ml-4">
      <Select value={fileType} onValueChange={handleChangeType}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FileTypeFilter;
