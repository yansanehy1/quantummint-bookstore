import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { BookPlus, BookOpen, BookCheck } from 'lucide-react';

export function ContentCreatorNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  // Check if user has any of the allowed roles
  const allowedRoles = ['ADMIN', 'SELLER', 'EDUCATOR'];
  if (!allowedRoles.includes(session.user.role)) {
    return null;
  }

  const basePath = session.user.role === 'ADMIN' ? '/admin' : '/seller';
  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Content Management
      </h3>
      <nav className="space-y-1">
        <Link
          href={`${basePath}/books`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive(`${basePath}/books`) 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <BookOpen className="mr-3 h-5 w-5" />
          My Books
        </Link>
        <Link
          href={`${basePath}/books/new`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive(`${basePath}/books/new`)
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <BookPlus className="mr-3 h-5 w-5" />
          Create Book
        </Link>
        {session.user.role === 'ADMIN' && (
          <Link
            href="/admin/approvals"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/admin/approvals')
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <BookCheck className="mr-3 h-5 w-5" />
            Approvals
          </Link>
        )}
      </nav>
    </div>
  );
}
