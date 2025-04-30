<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\CourseExperienceController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\AdminTopicController;
use App\Http\Controllers\AdminAssignmentController;
use App\Http\Controllers\AdminQuizController;
use App\Http\Controllers\AdminExamController;
use App\Http\Controllers\AssignmentReviewController;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\EnrolledMiddleware;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Carbon;  
use App\Models\Course;
use App\Models\Exam;

// Rutas públicas
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::post('/courses', [CourseController::class, 'store']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::post('/articles', [ArticleController::class, 'store']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);

Route::get('/search', [SearchController::class, 'search']);
Route::get('/authors', [ArticleController::class, 'authors']);
Route::get('/categories', [ArticleController::class, 'categories']);

// Autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/session', [AuthController::class, 'session']);
Route::post('/register', [AuthController::class, 'register']);

// Edición desde modal
Route::put('/topic-quizzes/{topic}', [QuizController::class, 'update']);
Route::put('/course-exams/{course}', [ExamController::class, 'update']);
Route::get('/course-exams/{course}', [ExamController::class, 'show']);
Route::get('/course-exams/{course}/results', [ExamController::class, 'results']);
Route::get('/course-exams/results', [ExamController::class, 'resultsAll']);

// Rutas accesibles por administradores
Route::middleware([
    StartSession::class,
    AuthMiddleware::class,
])->group(function () {
    Route::get('/courses/{course}/quizzes', [QuizController::class, 'getAllByCourse']);
    Route::get('/courses/{course}/topics/{topic}/quiz', [QuizController::class, 'show']);
});

// Experiencia del curso protegida para estudiantes
Route::middleware([
    StartSession::class,
    AuthMiddleware::class,
    EnrolledMiddleware::class,
])->prefix('courses/{course}')->group(function () {
    Route::get('/topics', [TopicController::class, 'index']);
    Route::get('/topics/{topic}', [TopicController::class, 'show']);
    Route::post('/topics/{topic}/quiz/submit', [QuizController::class, 'submit']);

    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show']);
    Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit']);
    Route::get('/assignments/{assignment}/submission-status', [AssignmentController::class, 'submissionStatus']);

    Route::get('/progress', [CourseExperienceController::class, 'getProgress']);
    Route::post('/progress/update', [CourseExperienceController::class, 'updateProgress']);

    Route::get('/exam', [ExamController::class, 'show']);
    Route::post('/exam/submit', [ExamController::class, 'submit']);
    Route::get('/exam/submission-status', [ExamController::class, 'submissionStatus']);

    Route::get('/badges', [BadgeController::class, 'index']);
});

// Panel de administración
Route::prefix('admin')->group(function () {
    Route::get('/topics', [AdminTopicController::class, 'index']);
    Route::post('/topics', [AdminTopicController::class, 'store']);
    Route::put('/topics/{id}', [AdminTopicController::class, 'update']);
    Route::delete('/topics/{id}', [AdminTopicController::class, 'destroy']);

    Route::get('/assignments', [AdminAssignmentController::class, 'index']);
    Route::post('/assignments', [AdminAssignmentController::class, 'store']);
    Route::put('/assignments/{id}', [AdminAssignmentController::class, 'update']);
    Route::delete('/assignments/{id}', [AdminAssignmentController::class, 'destroy']);

    Route::get('/quizzes', [AdminQuizController::class, 'index']);
    Route::post('/quizzes', [AdminQuizController::class, 'store']);
    Route::put('/quizzes/{id}', [AdminQuizController::class, 'update']);
    Route::delete('/quizzes/{id}', [AdminQuizController::class, 'destroy']);

    Route::get('/exams', [AdminExamController::class, 'index']);
    Route::put('/exams/{id}', [AdminExamController::class, 'update']);
    Route::delete('/exams/{id}', [AdminExamController::class, 'destroy']);

    Route::get('/assignment-reviews', [AssignmentReviewController::class, 'index']);
    Route::post('/submissions/{submission}/feedback', [AssignmentReviewController::class, 'feedback']);
});


Route::get('/clear-config', function () {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    return 'Todo limpiadoss';
});

Route::get('/storage-link', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        return 'Enlace simbólico creado correctamente.';
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

