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
use Illuminate\Support\Facades\DB; // ✅ Solo una vez
use Illuminate\Support\Carbon;     // ✅ Solo una vez

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

// 🚀 Tus manual seeds:
Route::get('/manual-seed-courses', function () {
    DB::table('courses')->insert([
        [
            'title' => 'Platón y la Teoría de las Ideas',
            'description' => 'Explora la filosofía de Platón y su influencia en el pensamiento occidental.',
            'image' => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => 'Filosofía',
            'tags' => 'Reflexión, Pensamiento',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title' => 'Aristóteles: Ética y Lógica',
            'description' => 'Un recorrido por la ética, metafísica y lógica aristotélica.',
            'image' => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => 'Ética',
            'tags' => 'Moral, Valores',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title' => 'Los Presocráticos',
            'description' => 'Descubre a los primeros filósofos y sus teorías sobre el cosmos.',
            'image' => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => 'Historia',
            'tags' => 'Antigüedad, Tradición',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title' => 'La Sofística y Sócrates',
            'description' => 'Analiza la diferencia entre los sofistas y la ética socrática.',
            'image' => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => 'Filosofía',
            'tags' => 'Reflexión, Pensamiento',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title' => 'El Estoicismo y el Epicureísmo',
            'description' => 'Dos formas de vida filosófica en la Grecia helenística.',
            'image' => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => 'Filosofía',
            'tags' => 'Reflexión, Pensamiento',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
    ]);

    return response()->json(['message' => 'Cursos insertados correctamente']);
});

Route::get('/manual-seed-articles', function () {
    // Deshabilitar restricciones de claves foráneas temporalmente
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    DB::table('articles')->truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    // Definimos arrays de categorías y tags disponibles
    $categories = ['Filosofía', 'Ética', 'Metafísica', 'Lógica'];
    $tagsList = [
        'Filosofía'   => 'Mito, Reflexión',
        'Ética'       => 'Moral, Valores',
        'Metafísica'  => 'Ser, Existencia',
        'Lógica'      => 'Razonamiento, Argumento'
    ];

    DB::table('articles')->insert([
        [
            'title'    => 'La Alegoría de la Caverna',
            'content'  => 'Analizamos el mito de la caverna de Platón y su significado en la actualidad.',
            'author'   => 'Platón',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[0],
            'tags'     => $tagsList[$categories[0]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title'    => 'El concepto de eudaimonía',
            'content'  => 'Exploramos cómo Aristóteles definía la felicidad y el propósito de la vida.',
            'author'   => 'Aristóteles',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[1],
            'tags'     => $tagsList[$categories[1]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title'    => 'Parménides vs. Heráclito: El Ser y el Cambio',
            'content'  => 'Una discusión sobre las ideas de estos dos pensadores presocráticos.',
            'author'   => 'Heráclito',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[2],
            'tags'     => $tagsList[$categories[2]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title'    => 'Sócrates y la Ética',
            'content'  => 'Cómo la mayéutica socrática transformó la filosofía moral.',
            'author'   => 'Sócrates',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[1],
            'tags'     => $tagsList[$categories[1]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title'    => 'El Estoicismo en la Vida Moderna',
            'content'  => 'Cómo aplicar el pensamiento estoico en el mundo actual.',
            'author'   => 'Epicteto',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[0],
            'tags'     => $tagsList[$categories[0]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'title'    => 'Introducción a la lógica formal',
            'content'  => 'Bases y conceptos fundamentales para entender el razonamiento lógico.',
            'author'   => 'Aristóteles',
            'image'    => 'https://i.imgur.com/ORWNbII.jpeg',
            'category' => $categories[3],
            'tags'     => $tagsList[$categories[3]],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
    ]);

    return response()->json([
        'message' => 'Artículos insertados correctamente',
        'count' => 6,
        'categories' => $categories
    ]);
});
