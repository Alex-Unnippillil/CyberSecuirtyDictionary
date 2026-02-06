'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalTerm, savePersonalTerm } from '../lib/personalTerms';

interface PersonalTermFormProps {
  initial?: PersonalTerm;
  onSave?: (term: PersonalTerm) => void;
}

const schema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  definition: z.string().min(1, 'Definition is required'),
  tags: z.string().optional(),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PersonalTermForm({ initial, onSave }: PersonalTermFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: initial?.slug ?? '',
      definition: initial?.definition ?? '',
      tags: initial?.tags.join(', ') ?? '',
      source: initial?.source ?? '',
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        slug: initial.slug,
        definition: initial.definition,
        tags: initial.tags.join(', '),
        source: initial.source ?? '',
      });
    }
  }, [initial, reset]);

  const onSubmit = async (values: FormValues) => {
    const term: PersonalTerm = {
      slug: values.slug,
      definition: values.definition,
      tags: values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      source: values.source || '',
    };
    await savePersonalTerm(term);
    onSave?.(term);
    reset({ slug: '', definition: '', tags: '', source: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Slug
          <input type="text" {...register('slug')} />
        </label>
        {errors.slug && <p>{errors.slug.message}</p>}
      </div>
      <div>
        <label>
          Definition
          <textarea {...register('definition')} />
        </label>
        {errors.definition && <p>{errors.definition.message}</p>}
      </div>
      <div>
        <label>
          Tags (comma separated)
          <input type="text" {...register('tags')} />
        </label>
        {errors.tags && <p>{errors.tags.message}</p>}
      </div>
      <div>
        <label>
          Source
          <input type="text" {...register('source')} />
        </label>
        {errors.source && <p>{errors.source.message}</p>}
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
