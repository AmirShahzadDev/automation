<?php

namespace App\Http\Controllers;

use App\Ai\Agents\FeedbackSummarizer;
use App\Http\Requests\StoreFeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    /**
     * Show the feedback form.
     */
    public function create(): Response
    {
        return Inertia::render('feedback/create', [
            'status' => session('status'),
        ]);
    }

    /**
     * Store feedback, summarize and classify with AI, redirect with success.
     */
    public function store(StoreFeedbackRequest $request): RedirectResponse
    {
        $body = $request->validated('body');

        $result = (new FeedbackSummarizer)->prompt($body);

        Feedback::query()->create([
            'body' => $body,
            'summary' => $result['summary'] ?? null,
            'label' => $result['label'] ?? null,
        ]);

        return redirect()->route('feedback.create')
            ->with('status', 'Feedback submitted. AI has summarized and classified it.');
    }
}
