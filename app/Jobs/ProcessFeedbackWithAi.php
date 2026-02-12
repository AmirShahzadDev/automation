<?php

namespace App\Jobs;

use App\Ai\Agents\FeedbackSummarizer;
use App\Models\Feedback;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessFeedbackWithAi implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Feedback $feedback
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $feedback = $this->feedback->fresh();
        if (! $feedback || $feedback->summary !== null) {
            return;
        }

        $result = (new FeedbackSummarizer)->prompt($feedback->body);

        $feedback->update([
            'summary' => $result['summary'] ?? null,
            'label' => $result['label'] ?? null,
        ]);
    }
}
