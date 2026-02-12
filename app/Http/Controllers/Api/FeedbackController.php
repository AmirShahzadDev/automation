<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedbackRequest;
use App\Jobs\ProcessFeedbackWithAi;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;

class FeedbackController extends Controller
{
    /**
     * Store feedback via API and queue AI summarization.
     */
    public function __invoke(StoreFeedbackRequest $request): JsonResponse
    {
        $feedback = Feedback::query()->create([
            'body' => $request->validated('body'),
        ]);

        ProcessFeedbackWithAi::dispatch($feedback);

        return response()->json([
            'id' => $feedback->id,
            'body' => $feedback->body,
            'summary' => $feedback->summary,
            'label' => $feedback->label,
            'created_at' => $feedback->created_at->toIso8601String(),
        ], 201);
    }
}
