import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useToast } from '../ui/use-toast';
import { apiRequest } from '../../lib/api';

const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  priceUSD: z.coerce.number().min(0, 'Price must be a positive number'),
  priceSLL: z.coerce.number().min(0, 'Price must be a positive number'),
  level: z.enum(['JSS', 'SSS', 'OTHER']),
  subjects: z.string().optional(),
  tags: z.string().optional(),
  coverImage: z.string().url('Must be a valid URL').optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookCreationFormProps {
  onSuccess?: () => void;
}

export function BookCreationForm({ onSuccess }: BookCreationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not logged in or doesn't have the right role
  useEffect(() => {
    if (session === null) {
      router.push('/auth/signin');
    } else if (session?.user?.role) {
      const allowedRoles = ['ADMIN', 'SELLER', 'EDUCATOR'];
      if (!allowedRoles.includes(session.user.role)) {
        router.push('/dashboard');
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          variant: 'destructive',
        });
      }
    } else {
      // If there's no role in the session, redirect to sign in
      router.push('/auth/signin');
    }
  }, [session, router, toast]);

  const form = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priceUSD: 0,
      priceSLL: 0,
      level: 'OTHER' as const,
      subjects: '',
      tags: '',
      coverImage: '',
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      setIsSubmitting(true);

      // Convert comma-separated strings to arrays
      const bookData = {
        ...data,
        subjects: data.subjects ? data.subjects.split(',').map(s => s.trim()) : [],
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      };

      const response = await apiRequest('/api/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Book created successfully',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          // Default behavior: reset form
          form.reset();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create book');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create book',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Book</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="JSS">Junior Secondary School (JSS)</SelectItem>
                      <SelectItem value="SSS">Senior Secondary School (SSS)</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/cover.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceUSD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceSLL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (SLL)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Math, Physics, Chemistry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. educational, science, 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a detailed description of the book..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Book'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
