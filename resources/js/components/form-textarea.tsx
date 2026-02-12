import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

interface FormTextareaProps {
    label: string;
    name: string;
    maxLength?: number;
    required?: boolean;
    placeholder?: string;
    rows?: number;
    error?: string;
    helperText?: string;
    className?: string;
}

export default function FormTextarea({
    label,
    name,
    maxLength = 10000,
    required = false,
    placeholder,
    rows = 5,
    error,
    helperText,
    className,
}: FormTextareaProps) {
    const [value, setValue] = useState('');

    const characterCount = value.length;
    const remainingCharacters = maxLength - characterCount;
    const isApproachingLimit = characterCount >= maxLength * 0.9;
    const isAtLimit = characterCount >= maxLength;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <div className="flex items-center justify-between">
                <Label htmlFor={name} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
                    {label}
                </Label>
                <span
                    className={cn(
                        'text-xs',
                        isAtLimit
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : isApproachingLimit
                              ? 'text-amber-600 dark:text-amber-400 font-medium'
                              : 'text-muted-foreground'
                    )}
                >
                    {characterCount} / {maxLength}
                </span>
            </div>
            <Textarea
                id={name}
                name={name}
                required={required}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                value={value}
                onChange={handleChange}
                aria-invalid={!!error}
            />
            {helperText && !error && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            <InputError message={error} />
        </div>
    );
}
