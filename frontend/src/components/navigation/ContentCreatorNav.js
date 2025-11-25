"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentCreatorNav = ContentCreatorNav;
const link_1 = __importDefault(require("next/link"));
const react_1 = require("next-auth/react");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
function ContentCreatorNav() {
    const { data: session } = (0, react_1.useSession)();
    const pathname = (0, navigation_1.usePathname)();
    if (!session)
        return null;
    // Check if user has any of the allowed roles
    const allowedRoles = ['ADMIN', 'SELLER', 'EDUCATOR'];
    if (!allowedRoles.includes(session.user.role)) {
        return null;
    }
    const basePath = session.user.role === 'ADMIN' ? '/admin' : '/seller';
    const isActive = (path) => pathname?.startsWith(path);
    return (<div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Content Management
      </h3>
      <nav className="space-y-1">
        <link_1.default href={`${basePath}/books`} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(`${basePath}/books`)
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
          <lucide_react_1.BookOpen className="mr-3 h-5 w-5"/>
          My Books
        </link_1.default>
        <link_1.default href={`${basePath}/books/new`} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(`${basePath}/books/new`)
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
          <lucide_react_1.BookPlus className="mr-3 h-5 w-5"/>
          Create Book
        </link_1.default>
        {session.user.role === 'ADMIN' && (<link_1.default href="/admin/approvals" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/admin/approvals')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
            <lucide_react_1.BookCheck className="mr-3 h-5 w-5"/>
            Approvals
          </link_1.default>)}
      </nav>
    </div>);
}
