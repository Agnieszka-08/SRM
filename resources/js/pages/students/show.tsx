
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    ArrowLeft,
    UserRound,
    Users,
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    IdCard,
    Pencil,
} from 'lucide-react';

interface Guardian {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    contact_number: string | null;
    email: string | null;
    address: string | null;
    occupation: string | null;
    pivot: {
        relationship: string;
        is_primary_contact: boolean;
        is_emergency_contact: boolean;
    };
}

interface Student {
    id: number;
    srm_student_id: string;
    lrn: string | null;
    school_student_id: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    date_of_birth: string | null;
    sex: string | null;
    place_of_birth: string | null;
    nationality: string;
    email: string | null;
    contact_number: string | null;
    current_address: string | null;
    previous_school: string | null;
    previous_grade_level: string | null;
    guardians: Guardian[];
}

interface Props {
    student: Student;
}

const breadcrumbs = (student: Student): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/students' },
    { title: 'Student Profile', href: `/students/${student.id}` },
];

const fullName = (
    person: {
        first_name: string;
        middle_name?: string | null;
        last_name: string;
        suffix?: string | null;
    },
) =>
    [
        person.first_name,
        person.middle_name,
        person.last_name,
        person.suffix,
    ]
        .filter(Boolean)
        .join(' ');

const formatDate = (date: string | null) => {
    if (!date) return 'Not provided';

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | null | undefined;
    icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2 text-sm font-medium">
                {icon}
                <span>{value || 'Not provided'}</span>
            </div>
        </div>
    );
}

export default function ShowStudent({ student }: Props) {
    const { flash } = usePage<{
        flash?: {
            success?: string;
        };
    }>().props;

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!flash?.success) return;

        setSuccessMessage(flash.success);

        const timeout = window.setTimeout(() => {
            setSuccessMessage('');
        }, 3000);

        return () => window.clearTimeout(timeout);
    }, [flash?.success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs(student)}>
            <Head title={`${fullName(student)} - Student Profile`} />

            {successMessage && (
                <div
                    role="status"
                    className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        ✓
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Successfully Updated!
                        </p>
                        <p className="text-xs text-gray-500">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <Link
                            href="/students"
                            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Student List
                        </Link>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Student Profile
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete student information and family contacts.
                        </p>
                    </div>

                    <Link
                        href={`/students/${student.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <Pencil className="size-4" />
                        Edit Profile
                    </Link>
                </div>

                {/* Student Identity Card */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                            <UserRound className="size-8 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-semibold">
                                {fullName(student)}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {student.srm_student_id}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    {student.sex || 'Sex not specified'}
                                </span>

                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                    {student.nationality || 'Nationality not specified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Student Identification */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <IdCard className="size-5 text-primary" />
                        </div>

                        <h2 className="font-semibold">
                            Student Identification
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                            label="SRM Student ID"
                            value={student.srm_student_id}
                        />
                        <InfoItem
                            label="Learner Reference Number (LRN)"
                            value={student.lrn}
                        />
                        <InfoItem
                            label="School Student ID"
                            value={student.school_student_id}
                        />
                    </div>
                </section>

                {/* Personal Information */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <UserRound className="size-5 text-primary" />
                        </div>

                        <h2 className="font-semibold">
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                            label="First Name"
                            value={student.first_name}
                        />
                        <InfoItem
                            label="Middle Name"
                            value={student.middle_name}
                        />
                        <InfoItem
                            label="Last Name"
                            value={student.last_name}
                        />
                        <InfoItem
                            label="Suffix"
                            value={student.suffix}
                        />
                        <InfoItem
                            label="Date of Birth"
                            value={formatDate(student.date_of_birth)}
                            icon={<CalendarDays className="size-4 text-muted-foreground" />}
                        />
                        <InfoItem
                            label="Sex"
                            value={student.sex}
                        />
                        <InfoItem
                            label="Place of Birth"
                            value={student.place_of_birth}
                        />
                        <InfoItem
                            label="Nationality"
                            value={student.nationality}
                        />
                    </div>
                </section>

                {/* Contact Information */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Phone className="size-5 text-primary" />
                        </div>

                        <h2 className="font-semibold">
                            Contact & Address
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InfoItem
                            label="Email Address"
                            value={student.email}
                            icon={<Mail className="size-4 text-muted-foreground" />}
                        />
                        <InfoItem
                            label="Contact Number"
                            value={student.contact_number}
                            icon={<Phone className="size-4 text-muted-foreground" />}
                        />
                        <div className="sm:col-span-2">
                            <InfoItem
                                label="Current Address"
                                value={student.current_address}
                                icon={<MapPin className="size-4 text-muted-foreground" />}
                            />
                        </div>
                    </div>
                </section>

                {/* Previous School */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <GraduationCap className="size-5 text-primary" />
                        </div>

                        <h2 className="font-semibold">
                            Previous School Information
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InfoItem
                            label="Previous School"
                            value={student.previous_school}
                        />
                        <InfoItem
                            label="Previous Grade Level"
                            value={student.previous_grade_level}
                        />
                    </div>
                </section>

                {/* Parents and Guardians */}
                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Users className="size-5 text-primary" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Parents / Guardians
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Registered family and emergency contacts
                            </p>
                        </div>
                    </div>

                    {student.guardians.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {student.guardians.map((guardian) => (
                                <div
                                    key={guardian.id}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold">
                                                {fullName(guardian)}
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {guardian.pivot.relationship}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {guardian.pivot.is_primary_contact && (
                                                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                                                    Primary
                                                </span>
                                            )}

                                            {guardian.pivot.is_emergency_contact && (
                                                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                                                    Emergency
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3 border-t pt-4">
                                        <InfoItem
                                            label="Contact Number"
                                            value={guardian.contact_number}
                                            icon={<Phone className="size-4 text-muted-foreground" />}
                                        />

                                        <InfoItem
                                            label="Email"
                                            value={guardian.email}
                                            icon={<Mail className="size-4 text-muted-foreground" />}
                                        />

                                        <InfoItem
                                            label="Occupation"
                                            value={guardian.occupation}
                                        />

                                        <InfoItem
                                            label="Address"
                                            value={guardian.address}
                                            icon={<MapPin className="size-4 text-muted-foreground" />}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <Users className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                            <p className="text-sm font-medium">
                                No guardian information
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                No parents or guardians have been registered for this student.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
