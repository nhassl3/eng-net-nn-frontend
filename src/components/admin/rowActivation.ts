import type { KeyboardEvent } from 'react'

/**
 * Строки списков в админке кликабельны целиком (открывают просмотр), но <article>
 * сам по себе не фокусируется и не реагирует на Enter — без этого просмотр записи
 * недоступен с клавиатуры.
 */
export function rowActivationProps(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      // Не перехватываем клавиши, адресованные кнопкам действий внутри строки
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      onActivate();
    },
  };
}
