<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeedbackRequest;
use App\Jobs\ProcessFeedbackWithAi;
use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    /**
     * List feedback with optional label filter.
     */
    public function index(Request $request): Response
    {
        $validLabels = ['bug', 'feature', 'question', 'other'];
        $filter = $request->query('label');
        if ($filter && in_array($filter, $validLabels, true)) {
            $feedback = Feedback::query()
                ->where('label', $filter)
                ->latest()
                ->paginate(15)
                ->withQueryString();
        } else {
            $feedback = Feedback::query()
                ->latest()
                ->paginate(15)
                ->withQueryString();
        }

        return Inertia::render('feedback/index', [
            'feedback' => $feedback,
            'filter' => $filter ?? '',
            'status' => session('status'),
        ]);
    }

    /**
     * Show a single feedback.
     */
    public function show(Feedback $feedback): Response
    {
        return Inertia::render('feedback/show', [
            'feedback' => $feedback->only(['id', 'body', 'summary', 'label', 'created_at']),
        ]);
    }

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
     * Store feedback and queue AI summarization; redirect with success.
     */
    public function store(StoreFeedbackRequest $request): RedirectResponse
    {
        $feedback = Feedback::query()->create([
            'body' => $request->validated('body'),
        ]);

        ProcessFeedbackWithAi::dispatch($feedback);

        return redirect()->route('feedback.index')
            ->with('status', 'Feedback submitted. AI is summarizing and classifying it.');
    }
}
