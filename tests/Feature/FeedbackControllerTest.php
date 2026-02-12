<?php

use App\Ai\Agents\FeedbackSummarizer;
use App\Jobs\ProcessFeedbackWithAi;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('guest cannot access feedback index', function () {
    $response = $this->get(route('feedback.index'));

    $response->assertRedirect(route('login'));
});

test('guest cannot access feedback form', function () {
    $response = $this->get(route('feedback.create'));

    $response->assertRedirect(route('login'));
});

test('authenticated user can see feedback list', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('feedback.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('feedback/index')
        ->has('feedback')
        ->has('filter')
    );
});

test('authenticated user can see feedback form', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('feedback.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('feedback/create'));
});

test('authenticated user can submit feedback and is redirected with status', function () {
    Queue::fake();

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('feedback.store'), [
        'body' => 'The app crashes when I click submit.',
    ]);

    $response->assertRedirect(route('feedback.index'));
    $response->assertSessionHas('status');

    $this->assertDatabaseHas(Feedback::class, [
        'body' => 'The app crashes when I click submit.',
    ]);

    $feedback = Feedback::query()->where('body', 'The app crashes when I click submit.')->first();
    $this->assertNull($feedback->summary);
    $this->assertNull($feedback->label);

    Queue::assertPushed(ProcessFeedbackWithAi::class, fn (ProcessFeedbackWithAi $job) => $job->feedback->id === $feedback->id);
});

test('feedback form validates body is required', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('feedback.store'), []);

    $response->assertSessionHasErrors(['body']);
});

test('feedback form validates body max length', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('feedback.store'), [
        'body' => str_repeat('a', 10001),
    ]);

    $response->assertSessionHasErrors(['body']);
});

test('process feedback with ai job updates feedback summary and label', function () {
    FeedbackSummarizer::fake([
        ['summary' => 'User reported a bug.', 'label' => 'bug'],
    ]);

    $feedback = Feedback::factory()->create([
        'body' => 'The app crashes.',
        'summary' => null,
        'label' => null,
    ]);

    $job = new ProcessFeedbackWithAi($feedback);
    $job->handle();

    $feedback->refresh();
    $this->assertSame('User reported a bug.', $feedback->summary);
    $this->assertSame('bug', $feedback->label);
});

test('guest cannot access feedback show', function () {
    $feedback = Feedback::factory()->create();

    $response = $this->get(route('feedback.show', $feedback));

    $response->assertRedirect(route('login'));
});

test('authenticated user can view feedback', function () {
    $user = User::factory()->create();
    $feedback = Feedback::factory()->create([
        'body' => 'Some feedback text.',
        'summary' => 'AI summary here.',
        'label' => 'feature',
    ]);
    $this->actingAs($user);

    $response = $this->get(route('feedback.show', $feedback));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('feedback/show')
        ->has('feedback')
        ->where('feedback.id', $feedback->id)
        ->where('feedback.body', 'Some feedback text.')
    );
});
