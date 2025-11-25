"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const SellerLayout_1 = require("@/components/layout/SellerLayout");
const BookCreationForm_1 = require("@/components/admin/BookCreationForm");
const auth_1 = require("@/lib/auth");
exports.getServerSideProps = (0, auth_1.requireAuth)('SELLER', 'EDUCATOR');
const NewBookPage = () => {
    const handleSuccess = () => {
        // Redirect to the seller's books list after successful creation
        window.location.href = '/seller/books';
    };
    return (<div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <BookCreationForm_1.BookCreationForm onSuccess={handleSuccess}/>
    </div>);
};
NewBookPage.getLayout = (page) => (<SellerLayout_1.SellerLayout title="Add New Book">
    {page}
  </SellerLayout_1.SellerLayout>);
exports.default = NewBookPage;
