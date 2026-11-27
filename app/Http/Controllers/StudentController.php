<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function create()
    {
        return Inertia::render('students/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            // Student Identification
            'lrn' => ['nullable', 'string', 'max:12', 'unique:students,lrn'],
            'school_student_id' => ['nullable', 'string', 'max:255'],

            // Personal Information
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'sex' => ['nullable', 'string', 'max:50'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:255'],

            // Contact Information
            'email' => ['nullable', 'email', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'current_address' => ['nullable', 'string', 'max:255'],

            // Previous School
            'previous_school' => ['nullable', 'string', 'max:255'],
            'previous_grade_level' => ['nullable', 'string', 'max:100'],

            // Guardians
            'guardians' => ['nullable', 'array'],
            'guardians.*.first_name' => ['required', 'string', 'max:255'],
            'guardians.*.middle_name' => ['nullable', 'string', 'max:255'],
            'guardians.*.last_name' => ['required', 'string', 'max:255'],
            'guardians.*.suffix' => ['nullable', 'string', 'max:50'],
            'guardians.*.relationship' => ['required', 'string', 'max:100'],
            'guardians.*.contact_number' => ['nullable', 'string', 'max:30'],
            'guardians.*.email' => ['nullable', 'email', 'max:255'],
            'guardians.*.address' => ['nullable', 'string'],
            'guardians.*.occupation' => ['nullable', 'string', 'max:255'],
            'guardians.*.is_primary_contact' => ['boolean'],
            'guardians.*.is_emergency_contact' => ['boolean'],
        ]);

        $guardians = $data['guardians'] ?? [];
        
        $primaryCount = collect($guardians)
            ->filter(fn ($guardian) => (bool) ($guardian['is_primary_contact'] ?? false))
            ->count();

        if ($primaryCount > 1) {
            throw ValidationException::withMessages([
                'guardians' => 'Only one guardian can be the primary contact.',
            ]);
        }

        DB::transaction(function () use ($data, $guardians) {
            // Create the student with a temporary unique identifier.
            $student = Student::create([
                'srm_student_id' => 'TEMP-' . Str::uuid(),
                'lrn' => $data['lrn'] ?? null,
                'school_student_id' => $data['school_student_id'] ?? null,
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'last_name' => $data['last_name'],
                'suffix' => $data['suffix'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'sex' => $data['sex'] ?? null,
                'place_of_birth' => $data['place_of_birth'] ?? null,
                'nationality' => $data['nationality'] ?? 'Filipino',
                'email' => $data['email'] ?? null,
                'contact_number' => $data['contact_number'] ?? null,
                'current_address' => $data['current_address'] ?? null,
                'previous_school' => $data['previous_school'] ?? null,
                'previous_grade_level' => $data['previous_grade_level'] ?? null,
            ]);

            // Generate the permanent SRM Student ID.
            $student->update([
                'srm_student_id' => 'SRM-' . now()->format('Y') . '-' .
                    str_pad($student->id, 6, '0', STR_PAD_LEFT),
            ]);

            // Save and connect guardians.
            foreach ($guardians as $guardianData) {
                $guardian = Guardian::create([
                    'first_name' => $guardianData['first_name'],
                    'middle_name' => $guardianData['middle_name'] ?? null,
                    'last_name' => $guardianData['last_name'],
                    'suffix' => $guardianData['suffix'] ?? null,
                    'contact_number' => $guardianData['contact_number'] ?? null,
                    'email' => $guardianData['email'] ?? null,
                    'address' => $guardianData['address'] ?? null,
                    'occupation' => $guardianData['occupation'] ?? null,
                ]);

                $student->guardians()->attach($guardian->id, [
                    'relationship' => $guardianData['relationship'],
                    'is_primary_contact' => $guardianData['is_primary_contact'] ?? false,
                    'is_emergency_contact' => $guardianData['is_emergency_contact'] ?? false,
                ]);
            }
        });

        return redirect()
            ->route('students.index')
            ->with('success', 'Student profile successfully registered.');
    }


public function index(Request $request)
{
    $search = $request->input('search');

    $students = Student::query()
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('srm_student_id', 'like', "%{$search}%")
                    ->orWhere('lrn', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        })
        ->orderByDesc('id')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('students/index', [
        'students' => $students,
        'filters' => [
            'search' => $search,
        ],
    ]);
}


public function show(Student $student)
{
    $student->load('guardians');

    return Inertia::render('students/show', [
        'student' => $student,
    ]);
}

public function edit(Student $student)
{
    $student->load('guardians');

    return Inertia::render('students/edit', [
        'student' => $student,
    ]);
}



public function update(Request $request, Student $student)
{
    $validated = $request->validate([
        // Student Identification
        'lrn' => [
            'nullable',
            'string',
            'digits:12',
            'unique:students,lrn,' . $student->id,
        ],
        'school_student_id' => ['nullable', 'string', 'max:50'],

        // Personal Information
        'first_name' => ['required', 'string', 'max:100'],
        'middle_name' => ['nullable', 'string', 'max:100'],
        'last_name' => ['required', 'string', 'max:100'],
        'suffix' => ['nullable', 'string', 'max:20'],
        'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
        'sex' => ['nullable', 'string', 'max:20'],
        'place_of_birth' => ['nullable', 'string', 'max:150'],
        'nationality' => ['required', 'string', 'max:100'],

        // Contact Information
        'email' => ['nullable', 'email', 'max:255'],
        'contact_number' => ['nullable', 'string', 'max:30'],
        'current_address' => ['nullable', 'string', 'max:255'],

        // Previous School
        'previous_school' => ['nullable', 'string', 'max:255'],
        'previous_grade_level' => ['nullable', 'string', 'max:50'],

        // Existing Guardians
        'existing_guardians' => ['present', 'array'],
        'existing_guardians.*.id' => ['required', 'integer'],
        'existing_guardians.*.first_name' => ['required', 'string', 'max:255'],
        'existing_guardians.*.middle_name' => ['nullable', 'string', 'max:255'],
        'existing_guardians.*.last_name' => ['required', 'string', 'max:255'],
        'existing_guardians.*.suffix' => ['nullable', 'string', 'max:50'],
        'existing_guardians.*.relationship' => ['required', 'string', 'max:100'],
        'existing_guardians.*.contact_number' => ['nullable', 'string', 'max:30'],
        'existing_guardians.*.email' => ['nullable', 'email', 'max:255'],
        'existing_guardians.*.address' => ['nullable', 'string'],
        'existing_guardians.*.occupation' => ['nullable', 'string', 'max:255'],
        'existing_guardians.*.is_primary_contact' => ['required', 'boolean'],
        'existing_guardians.*.is_emergency_contact' => ['required', 'boolean'],

        // New Guardians
        'new_guardians' => ['present', 'array'],
        'new_guardians.*.first_name' => ['required', 'string', 'max:255'],
        'new_guardians.*.middle_name' => ['nullable', 'string', 'max:255'],
        'new_guardians.*.last_name' => ['required', 'string', 'max:255'],
        'new_guardians.*.suffix' => ['nullable', 'string', 'max:50'],
        'new_guardians.*.relationship' => ['required', 'string', 'max:100'],
        'new_guardians.*.contact_number' => ['nullable', 'string', 'max:30'],
        'new_guardians.*.email' => ['nullable', 'email', 'max:255'],
        'new_guardians.*.address' => ['nullable', 'string'],
        'new_guardians.*.occupation' => ['nullable', 'string', 'max:255'],
        'new_guardians.*.is_primary_contact' => ['required', 'boolean'],
        'new_guardians.*.is_emergency_contact' => ['required', 'boolean'],
    ]);

    $existingGuardians = $validated['existing_guardians'];
    $newGuardians = $validated['new_guardians'];

    // Get guardians currently connected to this student.
    $attachedGuardianIds = $student->guardians()
        ->pluck('guardians.id')
        ->map(fn ($id) => (int) $id)
        ->all();

    // Verify submitted existing guardians belong to this student.
    foreach ($existingGuardians as $guardianData) {
        if (!in_array((int) $guardianData['id'], $attachedGuardianIds, true)) {
            throw ValidationException::withMessages([
                'existing_guardians' => 'Invalid guardian record for this student.',
            ]);
        }
    }

    // Only one primary contact is allowed.
    $primaryCount = collect($existingGuardians)
        ->merge($newGuardians)
        ->filter(fn ($guardian) => (bool) $guardian['is_primary_contact'])
        ->count();

    if ($primaryCount > 1) {
        throw ValidationException::withMessages([
            'existing_guardians' => 'Only one guardian can be the primary contact.',
        ]);
    }

    DB::transaction(function () use (
        $validated,
        $existingGuardians,
        $newGuardians,
        $student,
        $attachedGuardianIds
    ) {
        // Update student information.
        $student->update(collect($validated)->except([
            'existing_guardians',
            'new_guardians',
        ])->all());

        // Update existing guardians.
        $submittedGuardianIds = [];

        foreach ($existingGuardians as $guardianData) {
            $guardian = Guardian::findOrFail($guardianData['id']);

            $guardian->update([
                'first_name' => $guardianData['first_name'],
                'middle_name' => $guardianData['middle_name'] ?? null,
                'last_name' => $guardianData['last_name'],
                'suffix' => $guardianData['suffix'] ?? null,
                'contact_number' => $guardianData['contact_number'] ?? null,
                'email' => $guardianData['email'] ?? null,
                'address' => $guardianData['address'] ?? null,
                'occupation' => $guardianData['occupation'] ?? null,
            ]);

            $student->guardians()->updateExistingPivot($guardian->id, [
                'relationship' => $guardianData['relationship'],
                'is_primary_contact' => $guardianData['is_primary_contact'],
                'is_emergency_contact' => $guardianData['is_emergency_contact'],
            ]);

            $submittedGuardianIds[] = (int) $guardian->id;
        }

        // Disconnect removed guardians from this student only.
        $guardianIdsToRemove = array_diff(
            $attachedGuardianIds,
            $submittedGuardianIds
        );

        if (!empty($guardianIdsToRemove)) {
            $student->guardians()->detach($guardianIdsToRemove);
        }

        // Create and connect new guardians.
        foreach ($newGuardians as $guardianData) {
            $guardian = Guardian::create([
                'first_name' => $guardianData['first_name'],
                'middle_name' => $guardianData['middle_name'] ?? null,
                'last_name' => $guardianData['last_name'],
                'suffix' => $guardianData['suffix'] ?? null,
                'contact_number' => $guardianData['contact_number'] ?? null,
                'email' => $guardianData['email'] ?? null,
                'address' => $guardianData['address'] ?? null,
                'occupation' => $guardianData['occupation'] ?? null,
            ]);

            $student->guardians()->attach($guardian->id, [
                'relationship' => $guardianData['relationship'],
                'is_primary_contact' => $guardianData['is_primary_contact'],
                'is_emergency_contact' => $guardianData['is_emergency_contact'],
            ]);
        }
    });

    return redirect()
        ->route('students.show', $student->id)
        ->with('success', 'Student profile and guardian information successfully updated!');
}


public function archived(Request $request)
{
    $search = $request->input('search');

    $students = Student::onlyTrashed()
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('srm_student_id', 'like', "%{$search}%")
                    ->orWhere('lrn', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        })
        ->orderByDesc('deleted_at')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('students/archived', [
        'students' => $students,
        'filters' => [
            'search' => $search,
        ],
    ]);
}

public function archive($id)
{
    $student = Student::findOrFail($id);

    $student->delete();

    return redirect()
        ->route('students.index')
        ->with('success', 'Student successfully archived.');
}

public function restore($id)
{
    $student = Student::withTrashed()->findOrFail($id);

    if (!$student->trashed()) {
        return redirect()
            ->route('students.index');
    }

    $student->restore();

    return redirect()
        ->route('students.archived')
        ->with('success', 'Student successfully restored.');
}


}
