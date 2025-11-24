import { NextPageWithLayout } from '@/types';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { BookCreationForm } from '@/components/admin/BookCreationForm';
import { requireAuth } from '@/lib/auth';

export const getServerSideProps = requireAuth('ADMIN');

const NewBookPage: NextPageWithLayout = () => {
  return (
    <div className="container mx-auto py-8">
      <BookCreationForm />
    </div>
  );
};

NewBookPage.getLayout = (page) => (
  <AdminLayout title="Create New Book">
    {page}
  </AdminLayout>
);

export default NewBookPage;
