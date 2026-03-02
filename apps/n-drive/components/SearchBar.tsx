import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Activity } from 'react';

const formSchema = z.object({
  searchQuery: z.string().min(0).max(100),
});

const SearchBar = ({
  setSearchQuery,
}: {
  setSearchQuery: (searchQuery: string) => void;
}) => {
  const pathname = usePathname();

  const isTrashPage = pathname === '/dashboard/trash';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchQuery(values.searchQuery);
    form.reset();
  };

  return (
    <Activity mode={isTrashPage ? 'hidden' : 'visible'}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 relative">
          <Input
            {...form.register('searchQuery')}
            placeholder="Search for a file"
            className="p-6 min-w-80 rounded-full"
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="size-8 rounded-full bg-gray-500 cursor-pointer absolute right-2"
          >
            {form.formState.isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <>
                <SearchIcon className="size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Activity>
  );
};

export default SearchBar;
