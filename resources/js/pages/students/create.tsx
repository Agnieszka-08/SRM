
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Plus,
    Trash2,
    UserRound,
    Users,
    GraduationCap,
} from 'lucide-react';

interface Guardian {
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
    guardians: Guardian[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/students/create' },
    { title: 'Register Student', href: '/students/create' },
];

const emptyGuardian = (): Guardian => ({
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

const inputClass =
    'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';

const labelClass = 'text-sm font-medium text-foreground';

export default function CreateStudent() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<StudentForm>({
        lrn: '',
        school_student_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        date_of_birth: '',
        sex: '',
        place_of_birth: '',
        nationality: 'Filipino',
        email: '',
        contact_number: '',
        current_address: '',
        previous_school: '',
        previous_grade_level: '',
        guardians: [],
    });

    const addGuardian = () => {
        setData('guardians', [...data.guardians, emptyGuardian()]);
    };

    const removeGuardian = (index: number) => {
        setData(
            'guardians',
            data.guardians.filter((_, i) => i !== index),
        );
    };

    const updateGuardian = (
        index: number,
        field: keyof Guardian,
        value: string | boolean,
    ) => {
        const updated = [...data.guardians];
        updated[index] = { ...updated[index], [field]: value };
        setData('guardians', updated);
    };

    const setPrimaryGuardian = (index: number) => {
        const updated = data.guardians.map((guardian, i) => ({
            ...guardian,
            is_primary_contact: i === index,
        }));

        setData('guardians', updated);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Laravel redirects to the student dashboard after a successful save.
        // Inertia automatically loads the refreshed student list and flash message.
        post('/students');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Student" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="size-4" />
                        Student Management
                    </div>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                        Register New Student
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a permanent student profile in SRM.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Student Identification */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <UserRound className="size-5 text-primary" />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Student Identification
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Optional school-issued identifiers
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>LRN</label>
                                <input
                                    className={inputClass}
                                    maxLength={12}
                                    value={data.lrn}
                                    onChange={(e) => setData('lrn', e.target.value)}
                                    placeholder="12-digit LRN"
                                />
                                {errors.lrn && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.lrn}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    School Student ID
                                </label>
                                <input
                                    className={inputClass}
                                    value={data.school_student_id}
                                    onChange={(e) =>
                                        setData('school_student_id', e.target.value)
                                    }
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Personal Information */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <UserRound className="size-5 text-primary" />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Personal Information
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Basic details about the student
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className={labelClass}>First Name *</label>
                                <input
                                    className={inputClass}
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    required
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input
                                    className={inputClass}
                                    value={data.middle_name}
                                    onChange={(e) =>
                                        setData('middle_name', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Last Name *</label>
                                <input
                                    className={inputClass}
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                    required
                                />
                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Suffix</label>
                                <input
                                    className={inputClass}
                                    value={data.suffix}
                                    onChange={(e) =>
                                        setData('suffix', e.target.value)
                                    }
                                    placeholder="Jr., Sr., III"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Date of Birth</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={data.date_of_birth}
                                    onChange={(e) =>
                                        setData('date_of_birth', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Sex</label>
                                <select
                                    className={inputClass}
                                    value={data.sex}
                                    onChange={(e) =>
                                        setData('sex', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
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
                                <label className={labelClass}>Nationality</label>
                                <input
                                    className={inputClass}
                                    value={data.nationality}
                                    onChange={(e) =>
                                        setData('nationality', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="mb-5 font-semibold">
                            Contact & Address
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Contact Number
                                </label>
                                <input
                                    className={inputClass}
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData('contact_number', e.target.value)
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Current Address
                                </label>
                                <textarea
                                    rows={3}
                                    className={inputClass}
                                    value={data.current_address}
                                    onChange={(e) =>
                                        setData('current_address', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Previous School */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="mb-5 font-semibold">
                            Previous School Information
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Previous School
                                </label>
                                <input
                                    className={inputClass}
                                    value={data.previous_school}
                                    onChange={(e) =>
                                        setData('previous_school', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Previous Grade Level
                                </label>
                                <input
                                    className={inputClass}
                                    value={data.previous_grade_level}
                                    onChange={(e) =>
                                        setData('previous_grade_level', e.target.value)
                                    }
                                    placeholder="e.g. Grade 5"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Guardian Information */}
                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Users className="size-5 text-primary" />
                                </div>

                                <div>
                                    <h2 className="font-semibold">
                                        Parents / Guardians
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Add one or more family contacts
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addGuardian}
                                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                            >
                                <Plus className="size-4" />
                                Add Guardian
                            </button>
                        </div>

                        {errors.guardians && (
                            <p className="mb-3 text-sm text-destructive">
                                {errors.guardians}
                            </p>
                        )}

                        {data.guardians.length === 0 && (
                            <div className="rounded-lg border border-dashed p-8 text-center">
                                <Users className="mx-auto mb-2 size-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    No guardians added yet.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Click Add Guardian to include parent or guardian details.
                                </p>
                            </div>
                        )}

                        <div className="space-y-5">
                            {data.guardians.map((guardian, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-medium">
                                            Guardian {index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => removeGuardian(index)}
                                            className="inline-flex items-center gap-1 text-sm text-destructive hover:underline"
                                        >
                                            <Trash2 className="size-4" />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <label className={labelClass}>
                                                First Name *
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.first_name}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'first_name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Middle Name
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.middle_name}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'middle_name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Last Name *
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.last_name}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'last_name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Suffix
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.suffix}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'suffix',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Relationship *
                                            </label>
                                            <select
                                                className={inputClass}
                                                value={guardian.relationship}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'relationship',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select relationship
                                                </option>
                                                <option value="Father">Father</option>
                                                <option value="Mother">Mother</option>
                                                <option value="Grandfather">
                                                    Grandfather
                                                </option>
                                                <option value="Grandmother">
                                                    Grandmother
                                                </option>
                                                <option value="Uncle">Uncle</option>
                                                <option value="Aunt">Aunt</option>
                                                <option value="Sibling">Sibling</option>
                                                <option value="Legal Guardian">
                                                    Legal Guardian
                                                </option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Contact Number
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.contact_number}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'contact_number',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className={inputClass}
                                                value={guardian.email}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Occupation
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.occupation}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'occupation',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="lg:col-span-3">
                                            <label className={labelClass}>
                                                Address
                                            </label>
                                            <input
                                                className={inputClass}
                                                value={guardian.address}
                                                onChange={(e) =>
                                                    updateGuardian(
                                                        index,
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-5 border-t pt-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={guardian.is_primary_contact}
                                                onChange={() =>
                                                    setPrimaryGuardian(index)
                                                }
                                            />
                                            Primary Contact
                                        </label>

                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={guardian.is_emergency_contact}
                                                onChange={(e) =>
                                                    updateGuardian(
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
                    </section>

                    {/* Submit Buttons */}
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Student Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
