<?php

use App\Ai\Agents\FeedbackSummarizer;
use App\Models\Feedback;
use App\Models\User;

beforeEach(function () {
    FeedbackSummarizer::fake([
        ['summary' => 'User reported a bug.', 'label' => 'bug'],
    ]);
});

test('guest cannot access feedback form', function () {
    $response = $this->get(route('feedback.create'));

    $response->assertRedirect(route('login'));
});

test('authenticated user can see feedback form', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('feedback.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('feedback/create'));
});

test('authenticated user can submit feedback and is redirected with status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('feedback.store'), [
        'body' => 'The app crashes when I click submit.',
    ]);

    $response->assertRedirect(route('feedback.create'));
    $response->assertSessionHas('status');

    $this->assertDatabaseHas(Feedback::class, [
        'body' => 'The app crashes when I click submit.',
        'summary' => 'User reported a bug.',
        'label' => 'bug',
    ]);
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
