import { Icon } from './Icon';

interface NoticeProps {
  children: React.ReactNode;
  tone?: 'info' | 'warning' | 'error' | 'success';
}

const styles = {
  info: 'border-electric-light/35 bg-electric/10 text-[#dbe7ff]',
  warning: 'border-amber-300/35 bg-amber-400/10 text-amber-100',
  error: 'border-red-400/40 bg-red-500/12 text-red-100',
  success: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100',
};

export function Notice({ children, tone = 'info' }: NoticeProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 size-4 shrink-0" name={tone === 'success' ? 'check' : tone === 'error' ? 'x' : 'shield'} />
      <div>{children}</div>
    </div>
  );
}
