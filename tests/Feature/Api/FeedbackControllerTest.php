<?php

use App\Jobs\ProcessFeedbackWithAi;
use App\Models\Feedback;
use Illuminate\Support\Facades\Queue;

test('api can store feedback and returns 201', function () {
    Queue::fake();

    $response = $this->postJson('/api/feedback', [
        'body' => 'I would love an export feature.',
    ]);

    $response->assertCreated()
        ->assertJsonPath('body', 'I would love an export feature.')
        ->assertJsonPath('summary', null)
        ->assertJsonPath('label', null)
        ->assertJsonStructure(['id', 'body', 'summary', 'label', 'created_at']);

    $this->assertDatabaseHas(Feedback::class, [
        'body' => 'I would love an export feature.',
    ]);

    $feedback = Feedback::query()->where('body', 'I would love an export feature.')->first();
    Queue::assertPushed(ProcessFeedbackWithAi::class, fn (ProcessFeedbackWithAi $job) => $job->feedback->id === $feedback->id);
});

test('api validates body is required', function () {
    $response = $this->postJson('/api/feedback', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['body']);
});

test('api validates body max length', function () {
    $response = $this->postJson('/api/feedback', [
        'body' => str_repeat('a', 10001),
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['body']);
});
