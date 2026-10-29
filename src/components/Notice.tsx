import { Icon } from './Icon';

interface NoticeProps {
  children: React.ReactNode;
  tone?: 'info' | 'warning' | 'error' | 'success';
}

const styles = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  error: 'border-red-200 bg-red-50 text-red-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

export function Notice({ children, tone = 'info' }: NoticeProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 size-4 shrink-0" name={tone === 'success' ? 'check' : tone === 'error' ? 'x' : 'shield'} />
      <div>{children}</div>
    </div>
  );
}
