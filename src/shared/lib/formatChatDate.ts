type ChatDateVariant = 'message' | 'preview';

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});

const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
});

const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

export const formatChatDate = (date: Date, variant: ChatDateVariant) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now);

  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = timeFormatter.format(date);

  if (isToday) return time;

  const shouldShowYear = date.getFullYear() !== now.getFullYear() || date < sixMonthsAgo;
  const dateFormatter = shouldShowYear ? fullDateFormatter : shortDateFormatter;
  const formattedDate = dateFormatter.format(date);

  return variant === 'message' ? `${formattedDate}, ${time}` : formattedDate;
};
