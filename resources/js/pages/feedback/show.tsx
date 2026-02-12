import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import feedback from '@/routes/feedback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export type FeedbackShow = {
    id: number;
    body: string;
    summary: string | null;
    label: string | null;
    created_at: string;
};

const breadcrumbs = (feedbackItem: FeedbackShow): BreadcrumbItem[] => [
    { title: 'Feedback', href: feedback.index().url },
    { title: 'View feedback', href: feedback.show({ feedback: feedbackItem.id }).url },
];

export default function ShowFeedback({ feedback: feedbackItem }: { feedback: FeedbackShow }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(feedbackItem)}>
            <Head title="Feedback" />
            <div className="mt-2 grid grid-cols-12 items-start gap-2 px-4 pb-6 pt-0">
                <div className="col-span-12 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={feedback.index().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <h1 className="text-base font-medium">Feedback</h1>
                </div>
                <Card className="col-span-12 w-full max-w-4xl gap-4">
                    <CardHeader className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <CardTitle>Feedback #{feedbackItem.id}</CardTitle>
                                <CardDescription>
                                    {new Date(feedbackItem.created_at).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </CardDescription>
                            </div>
                            {feedbackItem.label ? (
                                <Badge variant="secondary" className="capitalize">
                                    {feedbackItem.label}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                    Processing…
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">Message</h3>
                            <p className="whitespace-pre-wrap text-sm">{feedbackItem.body}</p>
                        </div>
                        {feedbackItem.summary && (
                            <div>
                                <h3 className="mb-1 text-sm font-medium text-muted-foreground">AI Summary</h3>
                                <p className="text-sm">{feedbackItem.summary}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
