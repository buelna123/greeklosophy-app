<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            // Relación con el tema correspondiente
            $table->unsignedBigInteger('topic_id');
            $table->text('question_text');
            // Puntos asignados a la pregunta
            $table->integer('points')->default(1);
            $table->timestamps();

            $table->foreign('topic_id')
                  ->references('id')->on('topics')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
}
