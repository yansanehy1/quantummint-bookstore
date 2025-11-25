"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCreationForm = BookCreationForm;
const react_1 = require("react");
const router_1 = require("next/router");
const react_2 = require("next-auth/react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("zod");
const zod_2 = require("@hookform/resolvers/zod");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const textarea_1 = require("../ui/textarea");
const select_1 = require("../ui/select");
const form_1 = require("../ui/form");
const use_toast_1 = require("../ui/use-toast");
const api_1 = require("../../lib/api");
const bookFormSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    category: zod_1.z.string().min(1, 'Category is required'),
    priceUSD: zod_1.z.coerce.number().min(0, 'Price must be a positive number'),
    priceSLL: zod_1.z.coerce.number().min(0, 'Price must be a positive number'),
    level: zod_1.z.enum(['JSS', 'SSS', 'OTHER']),
    subjects: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().url('Must be a valid URL').optional(),
});
function BookCreationForm({ onSuccess }) {
    const { toast } = (0, use_toast_1.useToast)();
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const { data: session } = (0, react_2.useSession)();
    const router = (0, router_1.useRouter)();
    // Redirect if not logged in or doesn't have the right role
    (0, react_1.useEffect)(() => {
        if (session === null) {
            router.push('/auth/signin');
        }
        else if (session?.user?.role) {
            const allowedRoles = ['ADMIN', 'SELLER', 'EDUCATOR'];
            if (!allowedRoles.includes(session.user.role)) {
                router.push('/dashboard');
                toast({
                    title: 'Access Denied',
                    description: 'You do not have permission to access this page.',
                    variant: 'destructive',
                });
            }
        }
        else {
            // If there's no role in the session, redirect to sign in
            router.push('/auth/signin');
        }
    }, [session, router, toast]);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_2.zodResolver)(bookFormSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            priceUSD: 0,
            priceSLL: 0,
            level: 'OTHER',
            subjects: '',
            tags: '',
            coverImage: '',
        },
    });
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            // Convert comma-separated strings to arrays
            const bookData = {
                ...data,
                subjects: data.subjects ? data.subjects.split(',').map(s => s.trim()) : [],
                tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
            };
            const response = await (0, api_1.apiRequest)('/api/books', {
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
                }
                else {
                    // Default behavior: reset form
                    form.reset();
                }
            }
            else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create book');
            }
        }
        catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create book',
                variant: 'destructive',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Book</h1>
      <form_1.Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form_1.FormField control={form.control} name="title" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Title</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="Book title" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="category" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Category</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="Category" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="level" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Education Level</form_1.FormLabel>
                  <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                    <form_1.FormControl>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue placeholder="Select education level"/>
                      </select_1.SelectTrigger>
                    </form_1.FormControl>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="JSS">Junior Secondary School (JSS)</select_1.SelectItem>
                      <select_1.SelectItem value="SSS">Senior Secondary School (SSS)</select_1.SelectItem>
                      <select_1.SelectItem value="OTHER">Other</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="coverImage" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Cover Image URL</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="https://example.com/cover.jpg" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="priceUSD" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Price (USD)</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input type="number" step="0.01" {...field} value={field.value}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="priceSLL" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Price (SLL)</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input type="number" step="1" {...field} value={field.value}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="subjects" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Subjects (comma-separated)</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="e.g. Math, Physics, Chemistry" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={form.control} name="tags" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Tags (comma-separated)</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="e.g. educational, science, 2023" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
          </div>

          <form_1.FormField control={form.control} name="description" render={({ field }) => (<form_1.FormItem>
                <form_1.FormLabel>Description</form_1.FormLabel>
                <form_1.FormControl>
                  <textarea_1.Textarea placeholder="Enter a detailed description of the book..." className="min-h-[120px]" {...field}/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>

          <div className="flex justify-end space-x-4">
            <button_1.Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
              Reset
            </button_1.Button>
            <button_1.Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Book'}
            </button_1.Button>
          </div>
        </form>
      </form_1.Form>
    </div>);
}
