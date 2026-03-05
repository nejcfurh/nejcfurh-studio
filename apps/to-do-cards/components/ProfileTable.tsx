import type { IList } from '@/lib/models/user';
import { CheckCircle, ClipboardList, List } from 'lucide-react';

interface ProfileTableProps {
  lists: IList[];
}

export default function ProfileTable({ lists }: ProfileTableProps) {
  return (
    <table className="profile-table">
      <thead>
        <tr>
          <th>
            <div className="table-row">
              <List size={24} />
              <p>Lists</p>
            </div>
          </th>
          <th>
            <div className="table-row">
              <ClipboardList size={24} />
              <p>Tasks</p>
            </div>
          </th>
          <th>
            <div className="table-row">
              <CheckCircle size={24} />
              <p>Completed</p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {lists.map((list) => (
          <tr key={list._id}>
            <td className="list-name">{list.name}</td>
            <td>
              {!list.items.length
                ? 'No active tasks!'
                : list.items.length === 1
                  ? list.items.length + ' active task'
                  : list.items.length + ' active tasks'}
            </td>
            <td>
              {!list.completedItems.length
                ? 'None completed!'
                : list.completedItems.length === 1
                  ? list.completedItems.length + ' task completed'
                  : list.completedItems.length + ' tasks completed'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
