
import { useState } from 'react';import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    ArrowLeft,
    Save,
    UserRound,
    IdCard,
    MapPin,
    GraduationCap,
    Users,
    Plus,
    Trash2,
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

interface GuardianForm {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    relationship: string;
    contact_number: string;
    email: string;
    address: string;
    occupation: string;
    is_primary_contact: boolean;
    is_emergency_contact: boolean;
}

interface StudentForm extends Record<string, any> {
    lrn: string;
    school_student_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    date_of_birth: string;
    sex: string;
    place_of_birth: string;
    nationality: string;
    email: string;
    contact_number: string;
    current_address: string;
    previous_school: string;
    previous_grade_level: string;
    existing_guardians: GuardianForm[];
    new_guardians: Omit<GuardianForm, 'id'>[];
}

interface Props {
    student: Student;
}

const emptyGuardian = (): Omit<GuardianForm, 'id'> => ({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    relationship: '',
    contact_number: '',
    email: '',
    address: '',
    occupation: '',
    is_primary_contact: false,
    is_emergency_contact: false,
});

export default function EditStudent({ student }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Students', href: '/students' },
        { title: 'Student Profile', href: `/students/${student.id}` },
        { title: 'Edit Profile', href: `/students/${student.id}/edit` },
    ];

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm<StudentForm>({
        lrn: student.lrn ?? '',
        school_student_id: student.school_student_id ?? '',
        first_name: student.first_name ?? '',
        middle_name: student.middle_name ?? '',
        last_name: student.last_name ?? '',
        suffix: student.suffix ?? '',
        date_of_birth: student.date_of_birth
            ? student.date_of_birth.substring(0, 10)
            : '',
        sex: student.sex ?? '',
        place_of_birth: student.place_of_birth ?? '',
        nationality: student.nationality ?? 'Filipino',
        email: student.email ?? '',
        contact_number: student.contact_number ?? '',
        current_address: student.current_address ?? '',
        previous_school: student.previous_school ?? '',
        previous_grade_level: student.previous_grade_level ?? '',

        existing_guardians: (student.guardians ?? []).map((guardian) => ({
            id: guardian.id,
            first_name: guardian.first_name ?? '',
            middle_name: guardian.middle_name ?? '',
            last_name: guardian.last_name ?? '',
            suffix: guardian.suffix ?? '',
            relationship: guardian.pivot.relationship ?? '',
            contact_number: guardian.contact_number ?? '',
            email: guardian.email ?? '',
            address: guardian.address ?? '',
            occupation: guardian.occupation ?? '',
            is_primary_contact: Boolean(guardian.pivot.is_primary_contact),
            is_emergency_contact: Boolean(guardian.pivot.is_emergency_contact),
        })),

        new_guardians: [],
    });

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

    const labelClass = 'mb-1.5 block text-sm font-medium';

    // ADD NEW GUARDIAN
    const addGuardian = () => {
        setData('new_guardians', [
            ...data.new_guardians,
            emptyGuardian(),
        ]);
    };

    // REMOVE NEW GUARDIAN
    const removeNewGuardian = (index: number) => {
        setData(
            'new_guardians',
            data.new_guardians.filter((_, i) => i !== index),
        );
    };

    // REMOVE EXISTING GUARDIAN FROM THIS STUDENT
    const removeExistingGuardian = (index: number) => {
        setData(
            'existing_guardians',
            data.existing_guardians.filter((_, i) => i !== index),
        );
    };

    // UPDATE EXISTING GUARDIAN
    const updateExistingGuardian = (
        index: number,
        field: keyof GuardianForm,
        value: string | boolean,
    ) => {
        const updated = [...data.existing_guardians];

        if (field === 'is_primary_contact' && value === true) {
            updated.forEach((guardian) => {
                guardian.is_primary_contact = false;
            });

            const updatedNew = data.new_guardians.map((guardian) => ({
                ...guardian,
                is_primary_contact: false,
            }));

            setData('new_guardians', updatedNew);
        }

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setData('existing_guardians', updated);
    };

    // UPDATE NEW GUARDIAN
    const updateNewGuardian = (
        index: number,
        field: keyof Omit<GuardianForm, 'id'>,
        value: string | boolean,
    ) => {
        const updated = [...data.new_guardians];

        if (field === 'is_primary_contact' && value === true) {
            const updatedExisting = data.existing_guardians.map((guardian) => ({
                ...guardian,
                is_primary_contact: false,
            }));

            updated.forEach((guardian) => {
                guardian.is_primary_contact = false;
            });

            setData('existing_guardians', updatedExisting);
        }

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setData('new_guardians', updated);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/students/${student.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Student Profile" />

            <div className="space-y-6 p-4 md:p-6">

                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Student Profile
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update student information and manage parents or guardians.
                        </p>
                    </div>

                    <Link
                        href={`/students/${student.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Profile
                    </Link>
                </div>

                {/* PERMANENT STUDENT ID */}
                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <IdCard className="size-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Permanent SRM Student ID
                            </p>
                            <p className="font-semibold">
                                {student.srm_student_id}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* STUDENT IDENTIFICATION */}
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <IdCard className="size-5 text-primary" />
                            <h2 className="font-semibold">Student Identification</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>LRN</label>
                                <input
                                    className={inputClass}
                                    value={data.lrn}
                                    maxLength={12}
                                    onChange={(e) => setData('lrn', e.target.value)}
                                    placeholder="12-digit LRN"
                                />
                                {errors.lrn && (
                                    <p className="mt-1 text-xs text-red-500">{errors.lrn}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>School Student ID</label>
                                <input
                                    className={inputClass}
                                    value={data.school_student_id}
                                    onChange={(e) =>
                                        setData('school_student_id', e.target.value)
                                    }
                                />
                                {errors.school_student_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.school_student_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* PERSONAL INFORMATION */}
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <UserRound className="size-5 text-primary" />
                            <h2 className="font-semibold">Personal Information</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className={labelClass}>First Name *</label>
                                <input
                                    className={inputClass}
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input
                                    className={inputClass}
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Last Name *</label>
                                <input
                                    className={inputClass}
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                {errors.last_name && (
                                    <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Suffix</label>
                                <input
                                    className={inputClass}
                                    value={data.suffix}
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    placeholder="Jr., Sr., III"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Date of Birth</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                {errors.date_of_birth && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.date_of_birth}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Sex</label>
                                <select
                                    className={inputClass}
                                    value={data.sex}
                                    onChange={(e) => setData('sex', e.target.value)}
                                >
                                    <option value="">Select sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Place of Birth</label>
                                <input
                                    className={inputClass}
                                    value={data.place_of_birth}
                                    onChange={(e) =>
                                        setData('place_of_birth', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Nationality *</label>
                                <input
                                    className={inputClass}
                                    value={data.nationality}
                                    onChange={(e) => setData('nationality', e.target.value)}
                                />
                                {errors.nationality && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.nationality}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* CONTACT INFORMATION */}
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <MapPin className="size-5 text-primary" />
                            <h2 className="font-semibold">Contact & Address</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Contact Number</label>
                                <input
                                    className={inputClass}
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData('contact_number', e.target.value)
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Current Address</label>
                                <textarea
                                    className={inputClass}
                                    rows={3}
                                    value={data.current_address}
                                    onChange={(e) =>
                                        setData('current_address', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* PREVIOUS SCHOOL */}
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <GraduationCap className="size-5 text-primary" />
                            <h2 className="font-semibold">Previous School Information</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Previous School</label>
                                <input
                                    className={inputClass}
                                    value={data.previous_school}
                                    onChange={(e) =>
                                        setData('previous_school', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Previous Grade Level</label>
                                <input
                                    className={inputClass}
                                    value={data.previous_grade_level}
                                    onChange={(e) =>
                                        setData('previous_grade_level', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* PARENTS / GUARDIANS */}
                    <section className="rounded-xl border bg-card p-5">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Users className="size-5 text-primary" />
                                <div>
                                    <h2 className="font-semibold">Parents / Guardians</h2>
                                    <p className="text-xs text-muted-foreground">
                                        Add or update the student's parent and guardian records.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addGuardian}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                                <Plus className="size-4" />
                                Add Guardian
                            </button>
                        </div>

                        {/* EXISTING GUARDIANS */}
                        {data.existing_guardians.length > 0 && (
                            <div className="mb-6 space-y-4">
                                <h3 className="text-sm font-semibold">
                                    Registered Parents / Guardians
                                </h3>

                                {data.existing_guardians.map((guardian, index) => (
                                    <div key={guardian.id} className="space-y-4 rounded-xl border p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h4 className="font-semibold">
                                                Existing Guardian #{index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() => removeExistingGuardian(index)}
                                                className="inline-flex items-center gap-1 text-sm text-red-500 hover:underline"
                                            >
                                                <Trash2 className="size-4" />
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className={labelClass}>First Name *</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.first_name}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'first_name', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Middle Name</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.middle_name}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'middle_name', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Last Name *</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.last_name}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'last_name', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Suffix</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.suffix}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'suffix', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Relationship *</label>
                                                <select
                                                    className={inputClass}
                                                    value={guardian.relationship}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'relationship', e.target.value)
                                                    }
                                                >
                                                    <option value="">Select relationship</option>
                                                    <option value="Father">Father</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Guardian">Guardian</option>
                                                    <option value="Grandfather">Grandfather</option>
                                                    <option value="Grandmother">Grandmother</option>
                                                    <option value="Uncle">Uncle</option>
                                                    <option value="Aunt">Aunt</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={labelClass}>Contact Number</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.contact_number}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'contact_number', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Email</label>
                                                <input
                                                    type="email"
                                                    className={inputClass}
                                                    value={guardian.email}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'email', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Occupation</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.occupation}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'occupation', e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Address</label>
                                                <input
                                                    className={inputClass}
                                                    value={guardian.address}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(index, 'address', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-5 border-t pt-4">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={guardian.is_primary_contact}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(
                                                            index,
                                                            'is_primary_contact',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                Primary Contact
                                            </label>

                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={guardian.is_emergency_contact}
                                                    onChange={(e) =>
                                                        updateExistingGuardian(
                                                            index,
                                                            'is_emergency_contact',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                Emergency Contact
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {data.existing_guardians.length === 0 &&
                            data.new_guardians.length === 0 && (
                                <div className="rounded-lg border border-dashed p-6 text-center">
                                    <Users className="mx-auto mb-2 size-8 text-muted-foreground" />
                                    <p className="font-medium">
                                        No Parent or Guardian Registered
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Click Add Guardian to register a parent or guardian.
                                    </p>
                                </div>
                            )}

                        {/* NEW GUARDIANS */}
                        {data.new_guardians.map((guardian, index) => (
                            <div key={index} className="mb-4 space-y-4 rounded-xl border p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h4 className="font-semibold">
                                        New Guardian #{index + 1}
                                    </h4>

                                    <button
                                        type="button"
                                        onClick={() => removeNewGuardian(index)}
                                        className="inline-flex items-center gap-1 text-sm text-red-500 hover:underline"
                                    >
                                        <Trash2 className="size-4" />
                                        Remove
                                    </button>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className={labelClass}>First Name *</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.first_name}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'first_name', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Middle Name</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.middle_name}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'middle_name', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Last Name *</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.last_name}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'last_name', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Suffix</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.suffix}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'suffix', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Relationship *</label>
                                        <select
                                            className={inputClass}
                                            value={guardian.relationship}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'relationship', e.target.value)
                                            }
                                        >
                                            <option value="">Select relationship</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Guardian">Guardian</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Grandmother">Grandmother</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Contact Number</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.contact_number}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'contact_number', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Email</label>
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={guardian.email}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'email', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Occupation</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.occupation}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'occupation', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Address</label>
                                        <input
                                            className={inputClass}
                                            value={guardian.address}
                                            onChange={(e) =>
                                                updateNewGuardian(index, 'address', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-5 border-t pt-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={guardian.is_primary_contact}
                                            onChange={(e) =>
                                                updateNewGuardian(
                                                    index,
                                                    'is_primary_contact',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        Primary Contact
                                    </label>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={guardian.is_emergency_contact}
                                            onChange={(e) =>
                                                updateNewGuardian(
                                                    index,
                                                    'is_emergency_contact',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        Emergency Contact
                                    </label>
                                </div>
                            </div>
                        ))}

                        {errors.existing_guardians && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.existing_guardians}
                            </p>
                        )}

                        {errors.new_guardians && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.new_guardians}
                            </p>
                        )}
                    </section>

                    {/* SAVE BUTTONS */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href={`/students/${student.id}`}
                            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                            <Save className="size-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
