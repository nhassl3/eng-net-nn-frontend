import { respondToPlan } from '../../../api/plan'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closePlanReply } from '../../../store/slices/adminSlice'
import type { Plan } from '../../../types/domain'
import { ReplyModal } from '../ReplyModal'
import { planDirectionLabel } from '../format'

export function PlanReplyModal({ plans }: { plans: Plan[] }) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.planReplyId);
  const plan = id === null ? undefined : plans.find((p) => p.uuid === id);

  if (id === null || !plan) return null;

  return (
    <ReplyModal
      open
      onClose={() => dispatch(closePlanReply())}
      kicker="ответ на заявку"
      title={plan.full_name}
      recipient={plan.email_to_feedback}
      defaultSubject={`Коммерческое предложение — ${planDirectionLabel(plan.direction)}`}
      send={(subject, message) => respondToPlan({ plan_id: plan.uuid, subject, message })}
    />
  );
}
