import { NextPageWithLayout } from '@/types';
import { SellerLayout } from '@/components/layout/SellerLayout';
import { BookCreationForm } from '@/components/admin/BookCreationForm';
import { requireAuth } from '@/lib/auth';

export const getServerSideProps = requireAuth('SELLER', 'EDUCATOR');

const NewBookPage: NextPageWithLayout = () => {
  const handleSuccess = () => {
    // Redirect to the seller's books list after successful creation
    window.location.href = '/seller/books';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <BookCreationForm onSuccess={handleSuccess} />
    </div>
  );
};

NewBookPage.getLayout = (page) => (
  <SellerLayout title="Add New Book">
    {page}
  </SellerLayout>
);

export default NewBookPage;
