import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Archive,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    Users,
    X,
} from 'lucide-react';

interface Student {
    id: number;
    srm_student_id: string;
    lrn: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    sex: string | null;
    contact_number: string | null;
    deleted_at: string;
}

interface PaginatedStudents {
    data: Student[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    students: PaginatedStudents;
    filters: {
        search?: string;
    };
}

interface ToastMessage {
    id: number;
    message: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/students' },
    { title: 'Archived Students', href: '/students/archived' },
];

export default function ArchivedStudents({ students, filters }: Props) {
    const search = filters.search ?? '';

    const [toast, setToast] = useState<ToastMessage | null>(null);

    useEffect(() => {
        if (!toast) return;

        const timeout = window.setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => window.clearTimeout(timeout);
    }, [toast?.id]);

    const handleSearch = (value: string) => {
        router.get(
            '/students/archived',
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const fullName = (student: Student) =>
        [
            student.first_name,
            student.middle_name,
            student.last_name,
            student.suffix,
        ]
            .filter(Boolean)
            .join(' ');

    const handleRestore = (student: Student) => {
        const confirmed = window.confirm(
            `Restore ${fullName(student)} to the active student list?`,
        );

        if (!confirmed) return;

        router.patch(
            `/students/${student.id}/restore`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToast({
                        id: Date.now(),
                        message: `${fullName(student)} was successfully restored.`,
                    });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Students" />

            {toast && (
                <div
                    key={toast.id}
                    role="status"
                    aria-live="polite"
                    className="fixed right-5 top-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm items-center gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-xl"
                >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <span className="text-xl font-semibold">✓</span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                            Successfully Restored!
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close notification"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Archive className="size-4" />
                            Student Management
                        </div>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                            Archived Students
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View and restore student profiles that have been archived.
                        </p>
                    </div>

                    <Link
                        href="/students"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                        <Users className="size-4" />
                        Back to Active Students
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Archived Students
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">
                            {students.total}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Current Page
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">
                            {students.current_page}
                            <span className="text-lg font-normal text-muted-foreground">
                                {' '} / {students.last_page}
                            </span>
                        </h2>
                    </div>
                </div>

                <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-semibold">Archived Records</h2>
                            <p className="text-xs text-muted-foreground">
                                Search archived student profiles and restore them when needed.
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => handleSearch(event.target.value)}
                                placeholder="Search name, LRN, or SRM ID..."
                                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear search"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        SRM Student ID
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Student Name
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        LRN
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Sex
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Contact Number
                                    </th>
                                    <th className="px-5 py-4 text-right font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {students.data.length > 0 ? (
                                    students.data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="transition hover:bg-muted/30"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 font-medium">
                                                {student.srm_student_id}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-medium">
                                                {fullName(student)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                                                {student.lrn || '—'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {student.sex || '—'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {student.contact_number || '—'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/students/${student.id}`}
                                                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRestore(student)}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                                                    >
                                                        <RefreshCw className="size-3.5" />
                                                        Restore
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center"
                                        >
                                            <Archive className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                                            <p className="font-medium">
                                                No archived students found
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {search
                                                    ? 'Try another search term.'
                                                    : 'Archived student profiles will appear here.'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                            Showing {students.from ?? 0} to {students.to ?? 0} of {students.total} archived students
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {students.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    className={`min-w-9 rounded-lg border px-3 py-2 text-xs ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    } disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                    {link.label.includes('Previous') ? (
                                        <ChevronLeft className="size-4" />
                                    ) : link.label.includes('Next') ? (
                                        <ChevronRight className="size-4" />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
