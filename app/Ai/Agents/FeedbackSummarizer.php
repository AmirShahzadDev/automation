<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

class FeedbackSummarizer implements Agent, HasStructuredOutput
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): string
    {
        return 'You are a feedback processor. Given a piece of user feedback or a message, you must:
1. Write a short, neutral summary in one or two sentences.
2. Classify the feedback into exactly one of: bug, feature, question, other.

Respond only with the structured output (summary and label).';
    }

    /**
     * Get the agent's structured output schema definition.
     *
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'summary' => $schema->string()->required(),
            'label' => $schema->string()->required()->enum(['bug', 'feature', 'question', 'other']),
        ];
    }
}
