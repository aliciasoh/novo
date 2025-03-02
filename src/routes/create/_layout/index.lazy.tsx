import { DraftForm } from '@/create/draft-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/create/_layout/')({
  component: DraftForm,
});
