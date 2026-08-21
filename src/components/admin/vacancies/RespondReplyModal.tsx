import { respondToCandidate } from '../../../api/vacancy'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeRespondReply } from '../../../store/slices/adminSlice'
import type { Respond } from '../../../types/domain'
import { ReplyModal } from '../ReplyModal'

export function RespondReplyModal({ responds }: { responds: Respond[] }) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.respondReplyId);
  const respond = id === null ? undefined : responds.find((r) => r.uuid === id);

  if (id === null || !respond) return null;

  return (
    <ReplyModal
      open
      stacked // открыта поверх списка откликов
      onClose={() => dispatch(closeRespondReply())}
      kicker="ответ кандидату"
      title={respond.fullName}
      recipient={respond.email}
      defaultSubject="Ваш отклик на вакансию — IPBuilding"
      send={(subject, message) =>
        respondToCandidate({ respond_id: respond.uuid, subject, message })}
    />
  );
}
