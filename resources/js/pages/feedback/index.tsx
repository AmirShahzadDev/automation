import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import feedback from '@/routes/feedback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

export type FeedbackItem = {
    id: number;
    body: string;
    summary: string | null;
    label: string | null;
    created_at: string;
};

export type PaginatedFeedback = {
    data: FeedbackItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const LABELS = [
    { value: 'all', label: 'All' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'question', label: 'Question' },
    { value: 'other', label: 'Other' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feedback',
        href: feedback.index().url,
    },
];

function truncate(str: string, max: number): string {
    if (str.length <= max) return str;
    return str.slice(0, max).trim() + '…';
}

export default function IndexFeedback({
    feedback: feedbackPaginated,
    filter,
    status,
}: {
    feedback: PaginatedFeedback;
    filter: string;
    status?: string;
}) {

    const handleFilterChange = (value: string) => {
        router.get(feedback.index().url, value && value !== 'all' ? { label: value } : {}, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback" />
            <div className="mt-2 grid grid-cols-12 items-start gap-2 px-4 pb-6 pt-0">
                <div className="col-span-12 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-base font-medium">Feedback</h1>
                    <div className="flex items-center gap-3">
                        <Select
                            value={filter || 'all'}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                {LABELS.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button asChild>
                            <Link href={feedback.create().url}>
                                <Plus className="size-4" />
                                Submit feedback
                            </Link>
                        </Button>
                    </div>
                </div>
                {status && (
                    <p className="col-span-12 text-sm font-medium text-green-600 dark:text-green-400">
                        {status}
                    </p>
                )}
                <div className="col-span-12 overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    {feedbackPaginated.data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                            No feedback yet.
                            <Link
                                href={feedback.create().url}
                                className="ml-1 font-medium text-foreground underline underline-offset-4 hover:no-underline"
                            >
                                Submit the first one
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {feedbackPaginated.data.map((item) => (
                                <li
                                    key={item.id}
                                    className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-12 sm:gap-4"
                                >
                                    <div className="min-w-0 sm:col-span-5">
                                        <p className="truncate text-sm text-foreground">
                                            {truncate(item.body, 120)}
                                        </p>
                                        {item.summary && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {truncate(item.summary, 100)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 sm:col-span-2 sm:justify-start">
                                        {item.label ? (
                                            <Badge variant="secondary" className="capitalize">
                                                {item.label}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground">
                                                Processing…
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground sm:col-span-2">
                                        {new Date(item.created_at).toLocaleDateString(undefined, {
                                            dateStyle: 'short',
                                        })}
                                    </div>
                                    <div className="flex items-center sm:col-span-3 sm:justify-end">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={feedback.show(item.id).url}>View</Link>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {feedbackPaginated.last_page > 1 && (
                    <div className="col-span-12 flex flex-wrap items-center justify-center gap-2">
                        {feedbackPaginated.links.map((link, i) => (
                            <span key={i}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={cn(
                                            'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-sm',
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent'
                                        )}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Link>
                                ) : (
                                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 text-sm text-muted-foreground">
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
