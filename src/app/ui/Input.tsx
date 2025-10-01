interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  multiline?: boolean;
}

export default function Input({
  label,
  multiline = false,
  className = "",
  ...props
}: InputProps) {
  const inputClassName =
    "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 outline-none focus:outline-none focus:ring-0";
  const finalClassName = `${inputClassName} ${className} outline-none`;

  return (
    <div>
      <label className='block text-white mb-2'>{label}</label>
      {multiline ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${finalClassName} min-h-[100px]`}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={finalClassName}
        />
      )}
    </div>
  );
}
