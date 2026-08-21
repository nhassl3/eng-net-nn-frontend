import { useEffect, useRef } from 'react'

/**
 * Стек открытых модалок. Escape обрабатывает только верхняя, иначе вложенная
 * модалка (ответ поверх списка откликов) закрыла бы обе разом: слушатели висят
 * на одном window, поэтому порядок задаётся регистрацией, а не вложенностью.
 */
const stack: symbol[] = [];

/**
 * Escape + блокировка скролла body — логика, продублированная в QuoteModal,
 * ServicesModal и CertsModal.
 */
export function useModalChrome(open: boolean, onClose: () => void): void {
  // onClose обычно пересоздаётся каждый рендер — держим в ref, чтобы эффект
  // не переподписывался и не дёргал стек на каждом рендере
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const id = Symbol('modal');
    stack.push(id);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (stack[stack.length - 1] !== id) return; // не верхняя — пропускаем
      onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    return () => {
      window.removeEventListener('keydown', onKey);
      const ix = stack.indexOf(id);
      if (ix !== -1) stack.splice(ix, 1);

      // Скролл возвращаем только когда закрылась последняя модалка
      if (stack.length === 0) {
        document.body.style.overflow = prev;
        document.body.classList.remove('modal-open');
      }
    };
  }, [open]);
}
