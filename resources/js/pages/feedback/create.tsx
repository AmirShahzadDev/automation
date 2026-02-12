import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import FeedbackController from '@/actions/App/Http/Controllers/FeedbackController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/feedback';
import FormTextarea from '@/components/form-textarea';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feedback',
        href: create().url,
    },
];

export default function CreateFeedback({ status }: { status?: string }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback" />
            <div className="mt-2 grid grid-cols-12 items-start gap-2 px-4 pb-6 pt-0">
                <header className="col-span-12">
                    <Heading
                        variant="small"
                        title="Send feedback"
                        description="Your message will be summarized and classified by AI (bug, feature, question, or other)."
                    />
                </header>
                <Card className="col-span-12 w-full max-w-4xl gap-4">
                    <CardHeader className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <CardTitle>Feedback</CardTitle>
                            <CardDescription>
                                Describe an issue, suggest a feature, or ask a
                                question.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...FeedbackController.store.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="grid grid-cols-12 gap-4"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="col-span-12">
                                        <FormTextarea
                                            label="Message"
                                            name="body"
                                            required
                                            placeholder="Type your feedback here..."
                                            rows={5}
                                            maxLength={10000}
                                            error={errors.body}
                                            helperText="Your feedback will be summarized and classified by AI."
                                        />
                                    </div>
                                    <div className="col-span-12 grid grid-cols-12 gap-4 sm:items-center">
                                        <div className="col-span-12 sm:col-span-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full sm:w-auto"
                                            >
                                                {processing
                                                    ? 'Submitting…'
                                                    : 'Submit feedback'}
                                            </Button>
                                        </div>
                                        <div className="col-span-12 sm:col-span-10">
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    Submitted
                                                </p>
                                            </Transition>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                        {status && (
                            <p className="mt-4 col-span-12 text-sm font-medium text-green-600 dark:text-green-400">
                                {status}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
