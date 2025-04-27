<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $assignmentId = $this->route('id'); // solo presente en update

        return [
            'course_id' => [
                'required',
                'exists:courses,id',
                Rule::unique('assignments', 'course_id')->ignore($assignmentId),
            ],
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'due_date'    => 'nullable|date|after_or_equal:today',
        ];
    }
}
