<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizOptionsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_options', function (Blueprint $table) {
            $table->id();
            // Relación con la pregunta de quiz
            $table->unsignedBigInteger('question_id');
            $table->string('option_text');
            // Indica si la opción es la respuesta correcta
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('question_id')
                  ->references('id')->on('quiz_questions')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_options');
    }
}
