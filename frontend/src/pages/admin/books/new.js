"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const AdminLayout_1 = require("@/components/layout/AdminLayout");
const BookCreationForm_1 = require("@/components/admin/BookCreationForm");
const auth_1 = require("@/lib/auth");
exports.getServerSideProps = (0, auth_1.requireAuth)('ADMIN');
const NewBookPage = () => {
    return (<div className="container mx-auto py-8">
      <BookCreationForm_1.BookCreationForm />
    </div>);
};
NewBookPage.getLayout = (page) => (<AdminLayout_1.AdminLayout title="Create New Book">
    {page}
  </AdminLayout_1.AdminLayout>);
exports.default = NewBookPage;
