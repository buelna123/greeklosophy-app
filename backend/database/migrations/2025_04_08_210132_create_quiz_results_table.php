<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizResultsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_results', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('quiz_question_id');
            $table->unsignedBigInteger('selected_option_id');
            // Registro si la respuesta fue correcta (booleano)
            $table->boolean('is_correct')->default(false);
            // Puntaje obtenido en la pregunta
            $table->integer('score')->default(0);
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('quiz_question_id')
                ->references('id')->on('quiz_questions')
                ->onDelete('cascade');

            $table->foreign('selected_option_id')
                ->references('id')->on('quiz_options')
                ->onDelete('cascade');

            // Agregar índice único para asegurar que cada usuario tenga una única respuesta por cada pregunta de quiz.
            $table->unique(['user_id', 'quiz_question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_results');
    }
}