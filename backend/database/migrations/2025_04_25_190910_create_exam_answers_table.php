<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamAnswersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_result_id');
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('selected_option_id');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('exam_result_id')
                ->references('id')->on('exam_results')
                ->onDelete('cascade');

            $table->foreign('question_id')
                ->references('id')->on('exam_questions')
                ->onDelete('cascade');

            $table->foreign('selected_option_id')
                ->references('id')->on('exam_options')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_answers');
    }
}
